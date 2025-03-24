
import { UserProfile } from "@/hooks/useAuth";
import { Permissions } from "@/hooks/usePermissions";
import { useRoles } from "@/hooks/useRoles";
import FieldOfficerView from "./role-views/FieldOfficerView";
import ProgrammeManagerView from "./role-views/ProgrammeManagerView";
import ManagementView from "./role-views/ManagementView";
import RegularUserView from "./role-views/RegularUserView";
import FallbackView from "./role-views/FallbackView";

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
  const { isAdmin, isProgrammeManager, isFieldOfficer, isRegularUser } = useRoles(userProfile);
  
  if (!userProfile) return null;
  
  // Field Officer View
  if (isFieldOfficer()) {
    return <FieldOfficerView userProfile={userProfile} statusCounts={statusCounts} />;
  } 
  
  // Programme Manager View
  else if (isProgrammeManager()) {
    return <ProgrammeManagerView userProfile={userProfile} statusCounts={statusCounts} />;
  } 
  
  // Management View
  else if (isAdmin()) {
    return <ManagementView userProfile={userProfile} statusCounts={statusCounts} />;
  } 
  
  // Regular User View
  else if (isRegularUser()) {
    return <RegularUserView userProfile={userProfile} />;
  }
  
  // Fallback for any undefined role
  else {
    return <FallbackView userProfile={userProfile} />;
  }
};

export default RoleBasedWorkflow;
