
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';

interface RequirePermissionProps {
  children: ReactNode;
  permission: keyof Permissions;
  redirectTo?: string;
}

const RequirePermission = ({ children, permission, redirectTo = '/dashboard' }: RequirePermissionProps) => {
  const { userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Get dev role from localStorage (for development mode role switching)
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  
  // In development mode, admin role should bypass ALL permission checks
  const isDevAdmin = isDevelopment && devRole === 'admin';
  
  // If we're in dev admin mode, skip all permission checks
  if (isDevAdmin) {
    console.log('Dev admin mode: bypassing permission check for', permission);
    return <>{children}</>;
  }
  
  // Special case for admin panel
  const isAdminPage = permission === 'canAccessAdminPanel';
  
  // Determine if user has permission - for normal users
  const hasPermission = isAdminPage ? userProfile?.role === 'admin' : permissions[permission];
  
  // Log permission check for debugging
  console.log(`Permission check for ${String(permission)}: ${hasPermission}`, {
    userRole: userProfile?.role,
    devRole,
    permissionValue: permissions[permission],
    isDevelopment,
    isAdminPage
  });
  
  useEffect(() => {
    // Skip all permission checks for dev admin users
    if (isDevAdmin) return;

    // Only redirect if the user doesn't have permission
    if (!hasPermission) {
      toast({
        title: "Access Restricted",
        description: `You don't have permission to access this page.`,
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [hasPermission, navigate, redirectTo, toast, permission, isDevAdmin]);
  
  // Only render children if user has permission or is dev admin
  return <>{children}</>;
};

export default RequirePermission;
