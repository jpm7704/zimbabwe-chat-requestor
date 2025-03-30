import { useRequestsData } from "@/hooks/useRequestsData";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import RequestsHeader from "@/components/requests/RequestsHeader";
import RequestsSearchFilter from "@/components/requests/RequestsSearchFilter";
import RequestsList from "@/components/requests/RequestsList";
import RoleBasedWorkflow from "@/components/requests/RoleBasedWorkflow";
import UserStatsSummary from "@/components/requests/UserStatsSummary";
import { useToast } from "@/hooks/use-toast";
import { Database } from "lucide-react";

const RequestsPage = () => {
  const { userProfile, isAuthenticated } = useAuth();
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

  // Show persistent toast if there's an error with database policies
  useEffect(() => {
    if (error && (error.message?.includes('policy') || error.message?.includes('infinite recursion'))) {
      toast({
        title: "Database Configuration Issue",
        description: "Our administrator is working to fix the database security policies. Some features may be limited temporarily.",
        variant: "destructive",
        duration: 0, // Keep it visible until dismissed
        action: (
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span className="font-mono bg-background/50 px-1 rounded">RLS policy error</span>
            </div>
          </div>
        ),
      });
    }
  }, [error, toast]);

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
