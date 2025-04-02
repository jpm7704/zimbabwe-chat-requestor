
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
import FallbackView from "./role-views/FallbackView";
import { useRoles } from "@/hooks/useRoles";

interface RoleBasedWorkflowProps {
  userProfile: UserProfile | null;
  statusCounts: {
    pending: number;
    underReview: number;
    awaitingApproval: number;
    completed: number;
    rejected: number;
  };
}

const RoleBasedWorkflow = ({ userProfile, statusCounts }: RoleBasedWorkflowProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isFieldOfficer, 
    isProjectOfficer, 
    isAssistantProjectOfficer,
    isHeadOfPrograms, 
    isDirector, 
    isCEO, 
    isPatron,
    isRegularUser,
    isAdmin
  } = useRoles(userProfile);
  
  // Enforce role-specific access to pages
  useEffect(() => {
    if (!userProfile) return;
    
    const currentPath = location.pathname;
    
    // Get dev role from localStorage (for development mode role switching)
    const isDevelopment = import.meta.env.DEV;
    const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
    
    // Skip role checks in dev mode
    if (isDevelopment && devRole) return;
    
    // Admin has access to all pages
    if (isAdmin()) return;
    
    // Role-based page access
    if (currentPath === '/field-work') {
      if (!isFieldOfficer() && !isProjectOfficer() && !isAssistantProjectOfficer()) {
        navigate('/dashboard');
        return;
      }
    }
    
    if (currentPath === '/reports') {
      if (!isFieldOfficer() && !isProjectOfficer() && !isAssistantProjectOfficer() && 
          !isHeadOfPrograms() && !isDirector() && !isCEO() && !isPatron()) {
        navigate('/dashboard');
        return;
      }
    }
    
    if (currentPath === '/approvals') {
      if (!isDirector() && !isCEO() && !isPatron()) {
        navigate('/dashboard');
        return;
      }
    }
    
    if (currentPath === '/analytics') {
      if (!isHeadOfPrograms() && !isDirector() && !isCEO() && !isPatron()) {
        navigate('/dashboard');
        return;
      }
    }
    
    if (currentPath === '/enquiry' || currentPath === '/submit' || currentPath === '/chat') {
      if (!isRegularUser()) {
        navigate('/dashboard');
        return;
      }
    }
    
    if (currentPath === '/admin/users') {
      if (!isAdmin() && !isDirector() && !isCEO()) {
        navigate('/dashboard');
        return;
      }
    }
    
    if (currentPath === '/admin/roles' || currentPath === '/admin/system') {
      if (!isAdmin()) {
        navigate('/dashboard');
        return;
      }
    }
  }, [userProfile, location.pathname, navigate, 
      isFieldOfficer, isProjectOfficer, isAssistantProjectOfficer,
      isHeadOfPrograms, isDirector, isCEO, isPatron, 
      isRegularUser, isAdmin]);

  if (!userProfile) {
    return null;
  }

  // Render different views based on user role with improved organization
  if (isFieldOfficer()) {
    return <FieldOfficerView userProfile={userProfile} statusCounts={statusCounts} />;
  }
  
  if (isProjectOfficer() || isAssistantProjectOfficer()) {
    return <ProjectOfficerView userProfile={userProfile} statusCounts={statusCounts} />;
  }
  
  if (isHeadOfPrograms()) {
    return <ProgrammeManagerView userProfile={userProfile} statusCounts={statusCounts} />;
  }
  
  if (isDirector()) {
    return <ManagementView userProfile={userProfile} statusCounts={statusCounts} />;
  }
  
  if (isCEO()) {
    return <CEOView userProfile={userProfile} statusCounts={statusCounts} />;
  }
  
  if (isPatron()) {
    return <PatronView userProfile={userProfile} statusCounts={statusCounts} />;
  }
  
  if (isRegularUser()) {
    return <RegularUserView userProfile={userProfile} />;
  }
  
  // Fallback for unrecognized roles
  return <FallbackView userProfile={userProfile} />;
};

export default RoleBasedWorkflow;
