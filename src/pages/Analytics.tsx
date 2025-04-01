
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, LineChart, Legend } from "recharts";
import { Bar, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell as RechartsCell } from "recharts";

const Analytics = () => {
  // Sample data for charts
  const monthlyRequestsData = [
    { name: "Jan", requests: 65 },
    { name: "Feb", requests: 59 },
    { name: "Mar", requests: 80 },
    { name: "Apr", requests: 81 },
    { name: "May", requests: 56 },
    { name: "Jun", requests: 55 },
    { name: "Jul", requests: 40 }
  ];

  const requestTypeData = [
    { name: "Financial Aid", value: 400 },
    { name: "Housing", value: 300 },
    { name: "Medical", value: 300 },
    { name: "Education", value: 200 },
    { name: "Other", value: 100 }
  ];

  const processingTimeData = [
    { name: "Week 1", avgTime: 4.5 },
    { name: "Week 2", avgTime: 3.8 },
    { name: "Week 3", avgTime: 4.2 },
    { name: "Week 4", avgTime: 3.5 },
    { name: "Week 5", avgTime: 2.9 },
    { name: "Week 6", avgTime: 3.1 }
  ];

  const regionData = [
    { name: "Harare", completed: 65, pending: 35 },
    { name: "Bulawayo", completed: 45, pending: 20 },
    { name: "Mutare", completed: 30, pending: 15 },
    { name: "Gweru", completed: 25, pending: 10 },
    { name: "Victoria Falls", completed: 15, pending: 8 }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF"];

  return (
    <div className="container px-4 mx-auto max-w-7xl py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="requests">Request Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="regional">Regional Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Requests</CardTitle>
                <CardDescription>
                  Number of requests submitted per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRequestsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="requests" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Request Types</CardTitle>
                <CardDescription>
                  Distribution of requests by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={requestTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {requestTypeData.map((entry, index) => (
                          <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Average Processing Time</CardTitle>
              <CardDescription>
                Average time (in days) to process requests over the last 6 weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processingTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="avgTime" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Average Days"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Request Status</CardTitle>
              <CardDescription>
                Completed vs pending requests by region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#4ade80" name="Completed" />
                    <Bar dataKey="pending" fill="#f97316" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
