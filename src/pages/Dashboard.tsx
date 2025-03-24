
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import RoleBasedWorkflow from "@/components/requests/RoleBasedWorkflow";
import { useRequestsData } from "@/hooks/useRequestsData";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, Calendar, Clock, FileCheck2, FileQuestion } from "lucide-react";

const Dashboard = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { filteredRequests } = useRequestsData();

  // Redirect if not authenticated
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

  // Get counts for different request statuses
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

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.first_name || 'User'}
          </p>
        </div>

        {/* Role-based workflow component showing role-specific info */}
        <RoleBasedWorkflow 
          userProfile={userProfile} 
          permissions={permissions} 
          statusCounts={statusCounts} 
        />

        {/* Dashboard Cards - shown to all users */}
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
        
        {/* Recent Activity - for all users */}
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
