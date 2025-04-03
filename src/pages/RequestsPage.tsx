
import { useRequestsData } from "@/hooks/useRequestsData";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { useNavigate } from "react-router-dom";
import RequestsHeader from "@/components/requests/RequestsHeader";
import RequestsSearchFilter from "@/components/requests/RequestsSearchFilter";
import RequestsList from "@/components/requests/RequestsList";
import RoleBasedWorkflow from "@/components/requests/RoleBasedWorkflow";
import UserStatsSummary from "@/components/requests/UserStatsSummary";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const RequestsPage = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const { isRegularUser } = useRoles(userProfile);
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
  
  // Refresh data when component mounts
  useEffect(() => {
    refreshRequests();
  }, []);
  
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

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <RequestsHeader />
      
      {/* Always show UserStatsSummary for all roles */}
      <UserStatsSummary statusCounts={statusCounts} />
      
      <RoleBasedWorkflow 
        userProfile={userProfile}
        statusCounts={statusCounts}
      />
      
      <RequestsSearchFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        activeFilter={activeFilter}
        searchTerm={searchTerm}
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
