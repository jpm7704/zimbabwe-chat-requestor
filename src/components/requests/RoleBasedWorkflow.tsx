
import { UserProfile } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RegularUserView from "./role-views/RegularUserView";
import FieldOfficerView from "./role-views/FieldOfficerView";
import ProjectOfficerView from "./role-views/ProjectOfficerView";
import ProgrammeManagerView from "./role-views/ProgrammeManagerView";
import ManagementView from "./role-views/ManagementView";
import PatronView from "./role-views/PatronView";
import CEOView from "./role-views/CEOView";

interface RoleBasedWorkflowProps {
  userProfile: UserProfile | null;
  permissions: {
    canApproveRequests: boolean;
    canReviewRequests: boolean;
    canAssignRequests: boolean;
    canAccessAnalytics: boolean;
    canAccessFieldReports: boolean;
  };
  statusCounts: {
    pending: number;
    underReview: number;
    awaitingApproval: number;
    completed: number;
    rejected: number;
  };
}

const RoleBasedWorkflow = ({ userProfile, permissions, statusCounts }: RoleBasedWorkflowProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle role-specific page access and redirects
  useEffect(() => {
    if (!userProfile) return;
    
    const currentPath = location.pathname;
    const userRole = userProfile.role?.toLowerCase() || '';
    
    // Redirect from inappropriate pages based on role
    if (currentPath === '/field-work' && !['field_officer', 'project_officer', 'regional_project_officer'].includes(userRole)) {
      // Redirect non-field officers from field work page
      navigate('/dashboard');
      return;
    }
    
    if (currentPath === '/reports' && !permissions.canAccessFieldReports) {
      // Redirect users without report access
      navigate('/dashboard');
      return;
    }
    
    if (currentPath === '/approvals' && !permissions.canApproveRequests) {
      // Redirect users who can't approve requests
      navigate('/dashboard');
      return;
    }
    
    if (currentPath === '/analytics' && !permissions.canAccessAnalytics) {
      // Redirect users without analytics access
      navigate('/dashboard');
      return;
    }
  }, [userProfile, location.pathname, permissions, navigate]);

  if (!userProfile) {
    return null;
  }

  // Render different views based on user role
  switch (userProfile.role?.toLowerCase()) {
    case 'field_officer':
      return <FieldOfficerView userProfile={userProfile} statusCounts={statusCounts} />;
      
    case 'project_officer':
    case 'regional_project_officer':
    case 'assistant_project_officer':
      return <ProjectOfficerView userProfile={userProfile} statusCounts={statusCounts} />;
      
    case 'programme_manager':
    case 'head_of_programs':
    case 'hop':
      return <ProgrammeManagerView userProfile={userProfile} statusCounts={statusCounts} />;
      
    case 'director':
    case 'management':
      return <ManagementView userProfile={userProfile} statusCounts={statusCounts} />;
      
    case 'ceo':
      return <CEOView userProfile={userProfile} statusCounts={statusCounts} />;
      
    case 'patron':
      return <PatronView userProfile={userProfile} statusCounts={statusCounts} />;
      
    case 'user':
    default:
      return <RegularUserView userProfile={userProfile} />;
  }
};

export default RoleBasedWorkflow;
