
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';
import { useRoles } from '@/hooks/useRoles';

interface RequirePermissionProps {
  children: ReactNode;
  permission: keyof ReturnType<typeof usePermissions>;
  redirectTo?: string;
}

const RequirePermission = ({ children, permission, redirectTo = '/dashboard' }: RequirePermissionProps) => {
  const { userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  const { isAdmin, isFieldOfficer } = useRoles(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Get dev role from localStorage (for development mode role switching)
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  
  // In development mode, ALL roles should bypass permission checks
  const isDevMode = isDevelopment && devRole;
  
  // Special case for admin panel
  const isAdminPage = permission === 'canAccessAdminPanel';
  
  // Special case for field reports and field work pages for Field Officers
  const isFieldWorkOrReportsPage = permission === 'canAccessFieldReports';
  const fieldOfficerSpecialAccess = isFieldOfficer() && isFieldWorkOrReportsPage;
  
  // Determine if user has permission - for normal users
  const hasPermission = fieldOfficerSpecialAccess || isDevMode || (isAdminPage ? isAdmin() : permissions[permission]);
  
  // Log permission check for debugging
  console.log(`Permission check for ${String(permission)}: ${hasPermission}`, {
    userRole: userProfile?.role,
    devRole,
    permissionValue: permissions[permission],
    isDevelopment,
    isAdminPage,
    isFieldOfficer: isFieldOfficer(),
    fieldOfficerSpecialAccess
  });
  
  useEffect(() => {
    // Skip all permission checks for dev users or special Field Officer access
    if (isDevMode || fieldOfficerSpecialAccess) return;

    // Only redirect if the user doesn't have permission
    if (!hasPermission) {
      toast({
        title: "Access Restricted",
        description: `You don't have permission to access this page.`,
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [hasPermission, navigate, redirectTo, toast, permission, isDevMode, fieldOfficerSpecialAccess]);
  
  // Only render children if user has permission or is dev mode or field officer with special access
  return <>{children}</>;
};

export default RequirePermission;
