
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
  const { isRegularUser, isPatron, isFieldOfficer } = useRoles(userProfile);
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
      // Only regular users should access the requests page
      // All other roles should be redirected to their respective dashboards
      if (!isRegularUser()) {
        // Redirect based on role
        if (isPatron()) {
          navigate('/approvals');
        } else if (isFieldOfficer()) {
          navigate('/field-work');
        } else if (userProfile.role === 'programme_manager') {
          navigate('/analytics');
        } else if (userProfile.role === 'management' || 
                  userProfile.role === 'director' || 
                  userProfile.role === 'ceo') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [userProfile, isAuthenticated, loading, navigate, isRegularUser, isPatron, isFieldOfficer]);

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

  // If the user should be redirected based on role, show nothing while redirecting
  if (!loading && isAuthenticated && userProfile && !isRegularUser()) {
    return null;
  }

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <RequestsHeader showNewRequestButton={isRegularUser()} />
      
      {isRegularUser() && <UserStatsSummary statusCounts={statusCounts} />}
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
