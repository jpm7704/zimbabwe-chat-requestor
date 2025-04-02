
import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { usePermissions } from "@/hooks/usePermissions";
import FallbackView from "@/components/requests/role-views/FallbackView";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RoleBasedLayoutProps {
  children: ReactNode;
  adminOnly?: boolean;
  fieldOfficerView?: ReactNode;
  projectOfficerView?: ReactNode;
  programManagerView?: ReactNode;
  managementView?: ReactNode;
  regularUserView?: ReactNode;
}

const RoleBasedLayout = ({
  children,
  adminOnly = false,
  fieldOfficerView,
  projectOfficerView,
  programManagerView,
  managementView,
  regularUserView
}: RoleBasedLayoutProps) => {
  const { userProfile } = useAuth();
  const {
    isAdmin,
    isFieldOfficer,
    isProjectOfficer,
    isHeadOfPrograms,
    isDirector,
    isCEO,
    isPatron,
    isRegularUser
  } = useRoles(userProfile);
  const permissions = usePermissions(userProfile);
  
  // Show admin-only warning if page is restricted
  if (adminOnly && !isAdmin()) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Restricted</AlertTitle>
        <AlertDescription>
          This page is available only to administrators. Please contact your system administrator if you need access.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Role-specific views
  if (isFieldOfficer() && fieldOfficerView) {
    return <>{fieldOfficerView}</>;
  }
  
  if (isProjectOfficer() && projectOfficerView) {
    return <>{projectOfficerView}</>;
  }
  
  if (isHeadOfPrograms() && programManagerView) {
    return <>{programManagerView}</>;
  }
  
  if ((isDirector() || isCEO() || isPatron()) && managementView) {
    return <>{managementView}</>;
  }
  
  if (isRegularUser() && regularUserView) {
    return <>{regularUserView}</>;
  }
  
  // If no specific view is provided for the user's role, use the default children
  return <>{children}</>;
};

export default RoleBasedLayout;
