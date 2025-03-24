
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, Pie, Line, Tooltip, Legend, Cell } from "recharts";

const Analytics = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();

  // Redirect if user doesn't have permission to view this page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!permissions.canAccessAnalytics) {
      navigate('/');
    }
  }, [isAuthenticated, permissions, navigate]);

  // Sample data for charts
  const requestsByTypeData = [
    { name: "Medical", value: 35 },
    { name: "Educational", value: 25 },
    { name: "Financial", value: 20 },
    { name: "Food", value: 15 },
    { name: "Other", value: 5 },
  ];

  const monthlyRequestsData = [
    { month: "Jan", requests: 65 },
    { month: "Feb", requests: 78 },
    { month: "Mar", requests: 82 },
    { month: "Apr", requests: 70 },
    { month: "May", requests: 93 },
    { month: "Jun", requests: 88 },
  ];

  const statusDistributionData = [
    { name: "Completed", value: 45 },
    { name: "In Progress", value: 30 },
    { name: "Pending", value: 15 },
    { name: "Rejected", value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
              <div className="text-4xl font-bold">1,243</div>
              <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Completion Rate</CardTitle>
              <CardDescription>Requests successfully fulfilled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">78%</div>
              <p className="text-sm text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Requests</CardTitle>
              <CardDescription>Currently in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">243</div>
              <p className="text-sm text-muted-foreground">-8% from last month</p>
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
                      data={requestsByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {requestsByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  <BarChart data={monthlyRequestsData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="requests" fill="#8884d8" />
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
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
