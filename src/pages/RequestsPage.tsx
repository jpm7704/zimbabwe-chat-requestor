
import { useRequestsData } from "@/hooks/useRequestsData";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import RequestsHeader from "@/components/requests/RequestsHeader";
import RequestsSearchFilter from "@/components/requests/RequestsSearchFilter";
import RequestsList from "@/components/requests/RequestsList";
import RoleBasedWorkflow from "@/components/requests/RoleBasedWorkflow";
import UserStatsSummary from "@/components/requests/UserStatsSummary";
import { useRoles } from "@/hooks/useRoles";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import DevRoleSwitcher from "@/components/auth/DevRoleSwitcher";

const RequestsPage = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const permissions = usePermissions(userProfile);
  const roles = useRoles(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    filteredRequests,
    loading,
    activeFilter,
    searchTerm,
    handleSearch,
    handleFilter,
    handleSort
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

  // Log user role to help with debugging
  useEffect(() => {
    if (userProfile) {
      console.log("Current role:", userProfile.role);
      
      // Notify user of their active role
      toast({
        title: `Signed in as ${roles.getRoleInfo().title}`,
        description: `You are viewing the system as a ${roles.getRoleInfo().description}`,
        duration: 3000
      });
    }
  }, [userProfile, roles, toast]);

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <RequestsHeader 
        showNewRequestButton={!permissions.canReviewRequests || userProfile?.role === 'user'} 
      />
      
      {/* Display user stats summary for regular users */}
      {roles.isRegularUser() && <UserStatsSummary statusCounts={statusCounts} />}
      
      {/* Display the role-specific workflow component */}
      <RoleBasedWorkflow 
        userProfile={userProfile} 
        permissions={permissions} 
        statusCounts={statusCounts} 
      />
      
      {/* Search and filter controls */}
      <RequestsSearchFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        activeFilter={activeFilter}
      />

      {/* List of requests */}
      <RequestsList 
        requests={filteredRequests} 
        loading={loading} 
        searchTerm={searchTerm}
      />
      
      {/* Development role switcher */}
      <DevRoleSwitcher />
    </div>
  );
};

export default RequestsPage;
