
import { useRequestsData } from "@/hooks/useRequestsData";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
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
  Clock 
} from "lucide-react";

const RequestsPage = () => {
  const { userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  const {
    filteredRequests,
    loading,
    activeFilter,
    handleSearch,
    handleFilter
  } = useRequestsData();

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
            Field Officer Dashboard
          </h2>
          <p className="text-muted-foreground">
            Review and verify requests assigned to you. Complete field assessments and submit verification reports.
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/field-work" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                View Assigned Work
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Pending Verifications ({filteredRequests.filter(r => r.status === 'assigned').length})
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
            Programme Manager Dashboard
          </h2>
          <p className="text-muted-foreground">
            Review verified requests from field officers and approve or reject them. Assign requests to field officers.
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Pending Reviews ({filteredRequests.filter(r => r.status === 'under_review').length})
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/analytics" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                View Analytics
              </Link>
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
            Management Dashboard
          </h2>
          <p className="text-muted-foreground">
            Final approval for all requests. Oversee staff performance and program outcomes.
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Awaiting Approval ({filteredRequests.filter(r => r.status === 'manager_review').length})
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </div>
      );
    }
    
    return headerContent;
  };

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <RequestsHeader 
        showNewRequestButton={!permissions.canReviewRequests || userProfile?.role === 'user'} 
      />
      
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
