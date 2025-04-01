
import { useRequestsData } from "@/hooks/useRequestsData";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRoles } from "@/hooks/useRoles";
import RequestsHeader from "@/components/requests/RequestsHeader";
import RequestsSearchFilter from "@/components/requests/RequestsSearchFilter";
import RequestsList from "@/components/requests/RequestsList";
import RoleBasedWorkflow from "@/components/requests/RoleBasedWorkflow";
import UserStatsSummary from "@/components/requests/UserStatsSummary";
import { useToast } from "@/hooks/use-toast";

const RequestsPage = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const { isPatron } = useRoles(userProfile);
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    filteredRequests,
    loading,
    error,
    activeFilter,
    searchTerm,
    handleSearch,
    handleFilter,
    handleSort,
    refreshRequests
  } = useRequestsData();
  
  // Redirect users to their appropriate dashboard based on role
  useEffect(() => {
    if (!loading && isAuthenticated && userProfile) {
      // Redirect Patron to approvals page as they don't create or manage individual requests
      if (isPatron() && window.location.pathname === '/requests') {
        navigate('/approvals');
        return;
      }
      
      if (userProfile.role === 'field_officer' && window.location.pathname === '/requests') {
        navigate('/field-work');
      } else if (userProfile.role === 'programme_manager' && window.location.pathname === '/requests') {
        navigate('/analytics');
      } else if (userProfile.role === 'management' && window.location.pathname === '/requests') {
        navigate('/admin');
      }
    }
  }, [userProfile, isAuthenticated, loading, navigate, isPatron]);

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

  // If it's a Patron, return nothing since they'll be redirected
  if (userProfile && isPatron()) {
    return null;
  }

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
      
      {userProfile?.role === 'user' && <UserStatsSummary statusCounts={statusCounts} />}
      <RoleBasedWorkflow 
        userProfile={userProfile} 
        permissions={permissions} 
        statusCounts={statusCounts} 
      />
      
      <RequestsSearchFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        activeFilter={activeFilter}
      />

      <RequestsList 
        requests={filteredRequests} 
        loading={loading} 
        searchTerm={searchTerm}
        error={error}
        onRetry={refreshRequests}
      />
    </div>
  );
};

export default RequestsPage;
