
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, Line, Tooltip, Legend } from "recharts";
import { Settings, Database, Shield, Server, Users } from "lucide-react";

const AdminPanel = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();

  // Redirect if user doesn't have permission to view this page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!permissions.canAccessAdminPanel) {
      navigate('/');
    }
  }, [isAuthenticated, permissions, navigate]);

  // Sample data for chart
  const systemActivityData = [
    { day: "Mon", requests: 35, users: 20 },
    { day: "Tue", requests: 42, users: 25 },
    { day: "Wed", requests: 58, users: 30 },
    { day: "Thu", requests: 45, users: 28 },
    { day: "Fri", requests: 50, users: 32 },
    { day: "Sat", requests: 38, users: 15 },
    { day: "Sun", requests: 30, users: 12 },
  ];

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            System administration and configuration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Registered accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">856</div>
              <p className="text-sm text-muted-foreground">+24 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Staff Users</CardTitle>
              <CardDescription>Internal accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">33</div>
              <p className="text-sm text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">All Systems Operational</div>
              <p className="text-sm text-muted-foreground">99.98% uptime</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Database Size</CardTitle>
              <CardDescription>Total storage used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">1.2GB</div>
              <p className="text-sm text-muted-foreground">+120MB this month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>7-day request and user activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={systemActivityData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="#8884d8" activeDot={{ r: 8 }} name="Requests" />
                  <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Administration</CardTitle>
              <CardDescription>Manage system configuration and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full flex justify-between items-center" variant="outline">
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>System Settings</span>
                </div>
                <span className="text-xs text-muted-foreground">Last updated: 2 days ago</span>
              </Button>
              <Button className="w-full flex justify-between items-center" variant="outline">
                <div className="flex items-center">
                  <Database className="mr-2 h-4 w-4" />
                  <span>Database Management</span>
                </div>
                <span className="text-xs text-muted-foreground">Last backup: Today</span>
              </Button>
              <Button className="w-full flex justify-between items-center" variant="outline">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Security Settings</span>
                </div>
                <span className="text-xs text-muted-foreground">Last audit: 5 days ago</span>
              </Button>
              <Button className="w-full flex justify-between items-center" variant="outline">
                <div className="flex items-center">
                  <Server className="mr-2 h-4 w-4" />
                  <span>API Configuration</span>
                </div>
                <span className="text-xs text-muted-foreground">4 active integrations</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Administration</CardTitle>
              <CardDescription>Manage users and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full flex justify-between items-center" variant="outline">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>User Management</span>
                </div>
                <span className="text-xs text-muted-foreground">856 total users</span>
              </Button>
              <Button className="w-full flex justify-between items-center" variant="outline">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Role Management</span>
                </div>
                <span className="text-xs text-muted-foreground">5 roles configured</span>
              </Button>
              <Button className="w-full flex justify-between items-center" variant="outline">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Staff Directory</span>
                </div>
                <span className="text-xs text-muted-foreground">33 staff members</span>
              </Button>
              <Button className="w-full flex justify-between items-center" variant="outline">
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Permission Settings</span>
                </div>
                <span className="text-xs text-muted-foreground">Last modified: Yesterday</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
