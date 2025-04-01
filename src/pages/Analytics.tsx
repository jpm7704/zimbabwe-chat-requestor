import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, Pie, Line, Tooltip, Legend, Cell } from "recharts";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const Analytics = () => {
  const { userProfile } = useAuth();
  const { data, loading, error } = useAnalyticsData();

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics: {error.message}</div>;

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Review program metrics and request statistics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Requests</CardTitle>
              <CardDescription>All time requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{data.totalRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Completion Rate</CardTitle>
              <CardDescription>Requests successfully fulfilled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {data.completedRequests ? 
                  `${Math.round((data.completedRequests / data.totalRequests) * 100)}%` : 
                  'N/A'
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Requests</CardTitle>
              <CardDescription>Currently in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{data.pendingRequests}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Requests by Type</CardTitle>
              <CardDescription>Distribution of support types requested</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.requestsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.requestsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Requests</CardTitle>
              <CardDescription>Request volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.requestsByMonth}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Current status of all requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.requestsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.requestsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
