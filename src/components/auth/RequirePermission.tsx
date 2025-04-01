
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
  const { isAdmin } = useRoles(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Get dev role from localStorage (for development mode role switching)
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  
  // In development mode, ALL roles should bypass permission checks
  const isDevMode = isDevelopment && devRole;
  
  // If we're in dev mode, skip all permission checks
  if (isDevMode) {
    console.log('Dev mode: bypassing permission check for', permission);
    return <>{children}</>;
  }
  
  // Special case for admin panel
  const isAdminPage = permission === 'canAccessAdminPanel';
  
  // Determine if user has permission - for normal users
  const hasPermission = isAdminPage ? isAdmin() : permissions[permission];
  
  // Log permission check for debugging
  console.log(`Permission check for ${String(permission)}: ${hasPermission}`, {
    userRole: userProfile?.role,
    devRole,
    permissionValue: permissions[permission],
    isDevelopment,
    isAdminPage
  });
  
  useEffect(() => {
    // Skip all permission checks for dev users
    if (isDevMode) return;

    // Only redirect if the user doesn't have permission
    if (!hasPermission) {
      toast({
        title: "Access Restricted",
        description: `You don't have permission to access this page.`,
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [hasPermission, navigate, redirectTo, toast, permission, isDevMode]);
  
  // Only render children if user has permission or is dev mode
  return <>{children}</>;
};

export default RequirePermission;
