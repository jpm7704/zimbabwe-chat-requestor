
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ClipboardCheck, HelpCircle, BarChart3, FileText, UserCheck } from "lucide-react";

const Dashboard = () => {
  const { userProfile } = useAuth();
  const { isRegularUser, isFieldOfficer, isDirector } = useRoles(userProfile);

  // Helper function to determine if user is staff
  const isStaff = () => isFieldOfficer() || 
                         userProfile?.role?.toLowerCase() === 'programme_manager' || 
                         userProfile?.role?.toLowerCase() === 'head_of_programs';
  
  // Helper function to check if user is management
  const isManagement = () => isDirector() || 
                             userProfile?.role?.toLowerCase() === 'ceo' ||
                             userProfile?.role?.toLowerCase() === 'patron';

  return (
    <div className="container px-4 mx-auto max-w-7xl py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Regular User Cards */}
        {isRegularUser() && (
          <>
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
                  <Link to="/enquiry">Submit Enquiry</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  My Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and track all your submitted requests and applications.
                </p>
                <Button asChild size="sm">
                  <Link to="/requests">View Requests</Link>
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
          </>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
