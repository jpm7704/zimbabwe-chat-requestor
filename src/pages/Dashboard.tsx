import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import RoleBasedWorkflow from "@/components/requests/RoleBasedWorkflow";
import { useRequestsData } from "@/hooks/useRequestsData";
import { useToast } from "@/hooks/use-toast";
import { useRoles } from "@/hooks/useRoles";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { 
  Bookmark, Calendar, Clock, FileCheck2, FileQuestion, PieChart, 
  Users, TrendingUp, Building, Settings, Database, Shield, Server 
} from "lucide-react";

const Dashboard = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();
  const permissions = usePermissions(userProfile);
  const roles = useRoles(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { filteredRequests } = useRequestsData();
  
  const isDevelopment = import.meta.env.DEV;
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  const isDevAdmin = isDevelopment && devRole === 'admin';
  
  const isAdmin = isDevAdmin || userProfile?.role === 'admin';

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate, toast]);

  const systemActivityData = [
    { day: "Mon", requests: 35, users: 20 },
    { day: "Tue", requests: 42, users: 25 },
    { day: "Wed", requests: 58, users: 30 },
    { day: "Thu", requests: 45, users: 28 },
    { day: "Fri", requests: 50, users: 32 },
    { day: "Sat", requests: 38, users: 15 },
    { day: "Sun", requests: 30, users: 12 },
  ];

  const getStatusCounts = () => {
    const counts = {
      pending: filteredRequests.filter(r => r.status === 'submitted').length,
      underReview: filteredRequests.filter(r => ['assigned', 'under_review'].includes(r.status)).length,
      awaitingApproval: filteredRequests.filter(r => r.status === 'manager_review').length,
      completed: filteredRequests.filter(r => ['completed', 'forwarded'].includes(r.status)).length,
      rejected: filteredRequests.filter(r => r.status === 'rejected').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalRequests = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  const renderAdminContent = () => {
    if (!isAdmin) return null;
    
    return (
      <>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">System Administration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

          <Card className="mb-6">
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
      </>
    );
  };

  const renderRoleSpecificCards = () => {
    if (roles.isCEO() || roles.isPatron()) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-500" />
                Approval Rate
              </CardTitle>
              <CardDescription>Executive decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statusCounts.completed > 0 ? Math.round((statusCounts.completed / (statusCounts.completed + statusCounts.rejected)) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">Requests approved vs rejected</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
                Pending Approval
              </CardTitle>
              <CardDescription>Awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.awaitingApproval}</div>
              <Progress 
                value={statusCounts.awaitingApproval / (totalRequests || 1) * 100} 
                className="h-2 mt-2 bg-muted" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Building className="mr-2 h-5 w-5 text-green-500" />
                Programs
              </CardTitle>
              <CardDescription>Active initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Strategic programs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-yellow-500" />
                Allocation
              </CardTitle>
              <CardDescription>Budget utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">68%</div>
              <p className="text-sm text-muted-foreground">Annual budget deployed</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    else if (roles.isAdmin() || roles.isHeadOfPrograms()) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                Staff Capacity
              </CardTitle>
              <CardDescription>Team workload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">73%</div>
              <p className="text-sm text-muted-foreground">Current staff utilization</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileQuestion className="mr-2 h-5 w-5 text-yellow-500" />
                Awaiting Approval
              </CardTitle>
              <CardDescription>Pending decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.awaitingApproval}</div>
              <p className="text-sm text-muted-foreground">Ready for review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck2 className="mr-2 h-5 w-5 text-green-500" />
                Processed
              </CardTitle>
              <CardDescription>Recently handled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.completed}</div>
              <p className="text-sm text-muted-foreground">Completed requests</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-indigo-500" />
                Response Rate
              </CardTitle>
              <CardDescription>Processing speed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.2 days</div>
              <p className="text-sm text-muted-foreground">Average processing time</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    else if (roles.isProjectOfficer() || roles.isAssistantProjectOfficer()) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
                Assigned
              </CardTitle>
              <CardDescription>Your workload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statusCounts.underReview}
              </div>
              <Progress 
                value={statusCounts.underReview / (totalRequests || 1) * 100} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-500" />
                Field Team
              </CardTitle>
              <CardDescription>Officers reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Active field officers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck2 className="mr-2 h-5 w-5 text-green-500" />
                Processed
              </CardTitle>
              <CardDescription>Your completions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.completed}</div>
              <Progress 
                value={statusCounts.completed / (totalRequests || 1) * 100} 
                className="h-2 mt-2 bg-muted" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-yellow-500" />
                Pending Visits
              </CardTitle>
              <CardDescription>Scheduled field work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.pending}</div>
              <p className="text-sm text-muted-foreground">Site visits needed</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    else if (roles.isFieldOfficer()) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
                My Tasks
              </CardTitle>
              <CardDescription>Assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statusCounts.pending + statusCounts.underReview}
              </div>
              <Progress 
                value={(statusCounts.pending + statusCounts.underReview) / 
                  (totalRequests || 1) * 100} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck2 className="mr-2 h-5 w-5 text-green-500" />
                Verified
              </CardTitle>
              <CardDescription>Assessments completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.completed}</div>
              <Progress 
                value={statusCounts.completed / (totalRequests || 1) * 100} 
                className="h-2 mt-2 bg-muted" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                Response Time
              </CardTitle>
              <CardDescription>Your average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3.1 days</div>
              <p className="text-sm text-muted-foreground">Verification speed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                Next Visit
              </CardTitle>
              <CardDescription>Upcoming schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.pending > 0 ? "Today" : "None"}</div>
              <p className="text-sm text-muted-foreground">Planned verification</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
                Active Requests
              </CardTitle>
              <CardDescription>In progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statusCounts.pending + statusCounts.underReview + statusCounts.awaitingApproval}
              </div>
              <Progress 
                value={(statusCounts.pending + statusCounts.underReview + statusCounts.awaitingApproval) / 
                  (totalRequests || 1) * 100} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck2 className="mr-2 h-5 w-5 text-green-500" />
                Completed
              </CardTitle>
              <CardDescription>Successfully fulfilled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.completed}</div>
              <Progress 
                value={statusCounts.completed / (totalRequests || 1) * 100} 
                className="h-2 mt-2 bg-muted" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                Response Time
              </CardTitle>
              <CardDescription>Average processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.2 days</div>
              <p className="text-sm text-muted-foreground">-0.8 days from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                Next Steps
              </CardTitle>
              <CardDescription>Upcoming activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalRequests > 0 ? 3 : 0}</div>
              <p className="text-sm text-muted-foreground">Tasks requiring attention</p>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.first_name || 'User'}
          </p>
        </div>

        {renderAdminContent()}

        <RoleBasedWorkflow 
          userProfile={userProfile} 
          permissions={permissions} 
          statusCounts={statusCounts} 
        />

        {renderRoleSpecificCards()}
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            {totalRequests > 0 ? (
              <div className="space-y-4">
                {filteredRequests.slice(0, 3).map((request, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 border rounded-md">
                    <Bookmark className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">{request.title || 'Untitled Request'}</div>
                      <div className="text-sm text-muted-foreground">
                        Status updated to <span className="font-medium">{request.status.replace('_', ' ')}</span>
                        {' • '} {new Date(request.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No recent activity to display</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
