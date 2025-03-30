
import { UserProfile } from "@/hooks/useAuth";
import { Permissions } from "@/hooks/usePermissions";
import { useRoles } from "@/hooks/useRoles";
import FieldOfficerView from "./role-views/FieldOfficerView";
import ProgrammeManagerView from "./role-views/ProgrammeManagerView";
import ManagementView from "./role-views/ManagementView";
import RegularUserView from "./role-views/RegularUserView";
import FallbackView from "./role-views/FallbackView";
import CEOView from "./role-views/CEOView";
import PatronView from "./role-views/PatronView";
import ProjectOfficerView from "./role-views/ProjectOfficerView";

interface RoleBasedWorkflowProps {
  userProfile: UserProfile | null;
  permissions: Permissions;
  statusCounts: {
    pending: number;
    underReview: number;
    awaitingApproval: number;
    completed: number;
    rejected: number;
  };
}

const RoleBasedWorkflow = ({ userProfile, permissions, statusCounts }: RoleBasedWorkflowProps) => {
  const roles = useRoles(userProfile);
  
  if (!userProfile) return null;
  
  // Field Officer View
  if (roles.isFieldOfficer()) {
    return <FieldOfficerView userProfile={userProfile} statusCounts={statusCounts} />;
  } 
  
  // Project Officer View
  else if (roles.isProjectOfficer()) {
    return <ProjectOfficerView userProfile={userProfile} statusCounts={statusCounts} />;
  }
  
  // Assistant Project Officer / HOP View
  else if (roles.isAssistantProjectOfficer() || roles.isHeadOfPrograms()) {
    return <ProgrammeManagerView userProfile={userProfile} statusCounts={statusCounts} />;
  } 
  
  // Director View
  else if (roles.isAdmin()) {
    return <ManagementView userProfile={userProfile} statusCounts={statusCounts} />;
  } 
  
  // CEO View
  else if (roles.isCEO()) {
    return <CEOView userProfile={userProfile} statusCounts={statusCounts} />;
  }
  
  // Patron View
  else if (roles.isPatron()) {
    return <PatronView userProfile={userProfile} statusCounts={statusCounts} />;
  }
  
  // Regular User View
  else if (roles.isRegularUser()) {
    return <RegularUserView userProfile={userProfile} />;
  }
  
  // Fallback for any undefined role
  else {
    return <FallbackView userProfile={userProfile} />;
  }
};

export default RoleBasedWorkflow;
