
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCheck, HelpCircle, BarChart3, FileText, UserCheck, Plus, User } from "lucide-react";

const Dashboard = () => {
  const { userProfile, loading } = useAuth();
  const { isRegularUser, isFieldOfficer, isProjectOfficer, isAssistantProjectOfficer, isDirector, isHeadOfPrograms, isCEO, isPatron, isAdmin } = useRoles(userProfile);

  console.log("Dashboard - user profile:", userProfile);
  console.log("Dashboard - loading:", loading);
  console.log("Dashboard - user role:", userProfile?.role);

  // Loading state
  if (loading) {
    return (
      <div className="container px-4 mx-auto max-w-7xl py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  // If no user profile is available
  if (!userProfile) {
    return (
      <div className="container px-4 mx-auto max-w-7xl py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Profile Unavailable</h2>
              <p className="text-muted-foreground text-center mb-4">
                We couldn't load your profile. Please try signing out and signing in again.
              </p>
              <Button asChild>
                <Link to="/profile">Go to Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function to determine if user is staff
  const isStaff = () => isFieldOfficer() || 
                         isProjectOfficer() ||
                         isAssistantProjectOfficer() ||
                         isHeadOfPrograms();
  
  // Helper function to check if user is management
  const isManagement = () => isDirector() || 
                             isCEO() ||
                             isPatron();

  return (
    <div className="container px-4 mx-auto max-w-7xl py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="text-muted-foreground mb-6">
        Welcome, {userProfile.first_name}. You are signed in as: <span className="font-medium">{userProfile.role?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Regular User Cards */}
        {isRegularUser() && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  Submit Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Apply for medical assistance, educational support, or other programs.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link to="/requests">
                      <Plus className="h-4 w-4 mr-1" />
                      New Request
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/requests">View My Requests</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Submit an Enquiry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask questions about our support programs without a formal application.
                </p>
                <Button asChild size="sm">
                  <Link to="/requests">Submit Enquiry</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  My Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and track all your submitted requests and applications.
                </p>
                <Button asChild size="sm">
                  <Link to="/requests">View All Applications</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
        
        {/* Staff Cards */}
        {isStaff() && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  Requests Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and process pending requests and applications.
                </p>
                <Button asChild size="sm">
                  <Link to="/requests">Manage Requests</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Field Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage and track field operations and site visits.
                </p>
                <Button asChild size="sm">
                  <Link to="/field-work">View Field Work</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage verification reports.
                </p>
                <Button asChild size="sm">
                  <Link to="/reports">View Reports</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
        
        {/* Head of Programs specific */}
        {isHeadOfPrograms() && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View performance metrics and operational statistics.
              </p>
              <Button asChild size="sm">
                <Link to="/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Management Cards */}
        {isManagement() && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View performance metrics and operational statistics.
                </p>
                <Button asChild size="sm">
                  <Link to="/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Review and approve pending requests requiring management action.
                </p>
                <Button asChild size="sm">
                  <Link to="/approvals">View Approvals</Link>
                </Button>
              </CardContent>
            </Card>
            
            {(isDirector() || isCEO()) && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage user accounts and permissions.
                  </p>
                  <Button asChild size="sm">
                    <Link to="/admin/users">Manage Users</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
        
        {/* Admin Cards */}
        {isAdmin() && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Admin Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Access administrative functions and system settings.
                </p>
                <Button asChild size="sm">
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
