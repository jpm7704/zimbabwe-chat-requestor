
import { useRequestsData } from "@/hooks/useRequestsData";
import { useAuth } from "@/hooks/useAuth";
import RequestsHeader from "@/components/requests/RequestsHeader";
import RequestsSearchFilter from "@/components/requests/RequestsSearchFilter";
import RequestsList from "@/components/requests/RequestsList";
import RoleBasedWorkflow from "@/components/requests/RoleBasedWorkflow";
import UserStatsSummary from "@/components/requests/UserStatsSummary";

const RequestsPage = () => {
  const { userProfile } = useAuth();
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
      <RequestsHeader showNewRequestButton={true} />
      
      {/* Show all statistics to all users */}
      <UserStatsSummary statusCounts={statusCounts} />
      <RoleBasedWorkflow 
        userProfile={userProfile} 
        permissions={{
          canApproveRequests: true,
          canReviewRequests: true,
          canAssignRequests: true,
          canAccessAnalytics: true,
          canAccessFieldReports: true
        }} 
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
