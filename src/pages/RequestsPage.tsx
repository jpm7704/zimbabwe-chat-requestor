
import { useRequestsData } from "@/hooks/useRequestsData";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import RequestsHeader from "@/components/requests/RequestsHeader";
import RequestsSearchFilter from "@/components/requests/RequestsSearchFilter";
import RequestCard from "@/components/requests/RequestCard";
import RequestsLoadingState from "@/components/requests/RequestsLoadingState";
import EmptyRequestsState from "@/components/requests/EmptyRequestsState";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ClipboardCheck, 
  ListFilter,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RequestsPage = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();
  const {
    filteredRequests,
    loading,
    activeFilter,
    handleSearch,
    handleFilter
  } = useRequestsData();

  // Redirect users to their appropriate dashboard based on role
  useEffect(() => {
    if (!loading && isAuthenticated && userProfile) {
      if (userProfile.role === 'field_officer' && window.location.pathname === '/requests') {
        navigate('/field-work');
      } else if (userProfile.role === 'programme_manager' && window.location.pathname === '/requests') {
        navigate('/analytics');
      } else if (userProfile.role === 'management' && window.location.pathname === '/requests') {
        navigate('/admin');
      }
    }
  }, [userProfile, isAuthenticated, loading, navigate]);

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

  // Determine page content based on user role
  const renderRoleBasedContent = () => {
    if (!userProfile) return null;
    
    // Display role-specific header content
    let headerContent = null;
    
    if (permissions.canReviewRequests && !permissions.canApproveRequests) {
      // Field Officer View
      headerContent = (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h2 className="text-lg font-medium mb-2 flex items-center">
            <ClipboardCheck className="mr-2 h-5 w-5 text-yellow-600" />
            Field Officer Workflow
          </h2>
          <p className="text-muted-foreground mb-3">
            Your role is to verify information and conduct necessary due diligence on requests assigned to you.
          </p>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground mb-4">
            <li>Review the request details thoroughly</li>
            <li>Contact the applicant to arrange for verification</li>
            <li>Complete field assessment and gather necessary evidence</li>
            <li>Submit your verification report for Programme Manager review</li>
          </ol>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/field-work" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                My Assigned Work
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Pending Verifications ({statusCounts.underReview})
            </Button>
          </div>
        </div>
      );
    } else if (permissions.canApproveRequests && !permissions.canManageStaff) {
      // Programme Manager View
      headerContent = (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h2 className="text-lg font-medium mb-2 flex items-center">
            <ClipboardCheck className="mr-2 h-5 w-5 text-blue-600" />
            Programme Manager Workflow
          </h2>
          <p className="text-muted-foreground mb-3">
            Your role is to review verification findings and ensure all due diligence is complete before forwarding to Management.
          </p>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground mb-4">
            <li>Review field officer verification reports</li>
            <li>Check that all required information is collected</li>
            <li>Request additional information if necessary</li>
            <li>Forward verified requests to Management for final approval</li>
          </ol>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/analytics" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                Program Overview
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Pending Reviews ({statusCounts.underReview})
            </Button>
          </div>
        </div>
      );
    } else if (permissions.canManageStaff) {
      // Management View
      headerContent = (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h2 className="text-lg font-medium mb-2 flex items-center">
            <ClipboardCheck className="mr-2 h-5 w-5 text-green-600" />
            Management Workflow
          </h2>
          <p className="text-muted-foreground mb-3">
            Your role is to make final decisions on requests that have been verified and reviewed.
          </p>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground mb-4">
            <li>Review all documentation and recommendations</li>
            <li>Make final determinations on resource allocation</li>
            <li>Approve or reject requests based on program criteria</li>
            <li>Authorize disbursement of approved assistance</li>
          </ol>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                Administration
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Awaiting Approval ({statusCounts.awaitingApproval})
            </Button>
          </div>
        </div>
      );
    } else {
      // Regular User View
      headerContent = (
        <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-md">
          <h2 className="text-lg font-medium mb-2 flex items-center">
            <ClipboardCheck className="mr-2 h-5 w-5 text-primary" />
            Request Process
          </h2>
          <p className="text-muted-foreground mb-3">
            Your request will go through the following process:
          </p>
          <ol className="list-decimal ml-6 text-sm text-muted-foreground mb-4">
            <li>Submit your request with all required information</li>
            <li>Field Officer verification and due diligence</li>
            <li>Programme Manager review</li>
            <li>Management approval and action</li>
          </ol>
          <div className="flex gap-3 mt-2">
            <Button size="sm" asChild>
              <Link to="/submit?action=new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Link>
            </Button>
          </div>
        </div>
      );
    }
    
    return headerContent;
  };

  // For regular users, show summary cards at the top
  const renderUserSummary = () => {
    if (userProfile?.role !== 'user') return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusCounts.pending + statusCounts.underReview}</div>
            <p className="text-sm text-muted-foreground">Requests being processed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusCounts.completed}</div>
            <p className="text-sm text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusCounts.rejected}</div>
            <p className="text-sm text-muted-foreground">Requests not approved</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  // If the user should be redirected based on role, show nothing while redirecting
  if (!loading && isAuthenticated && userProfile) {
    if ((userProfile.role === 'field_officer' || 
         userProfile.role === 'programme_manager' || 
         userProfile.role === 'management') && 
        window.location.pathname === '/requests') {
      return null;
    }
  }

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <RequestsHeader 
        showNewRequestButton={!permissions.canReviewRequests || userProfile?.role === 'user'} 
      />
      
      {renderUserSummary()}
      {renderRoleBasedContent()}
      
      <RequestsSearchFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        activeFilter={activeFilter}
      />

      <div className="space-y-4">
        {loading ? (
          <RequestsLoadingState />
        ) : filteredRequests.length === 0 ? (
          <EmptyRequestsState />
        ) : (
          filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
