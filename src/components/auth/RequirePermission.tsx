
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
  
  // Special case for admin panel
  const isAdminPage = permission === 'canAccessAdminPanel';
  
  // In development mode, admin role should bypass all permission checks
  const isDevAdmin = isDevelopment && (devRole === 'admin' || userProfile?.role === 'admin');
  
  // Determine if user has permission - admins in dev mode always have permission
  const hasPermission = isDevAdmin ? true : 
    isAdminPage ? userProfile?.role === 'admin' : permissions[permission];
  
  // Log permission check for debugging
  console.log(`Permission check for ${permission}: ${hasPermission}`, {
    userRole: userProfile?.role,
    devRole,
    permissionValue: permissions[permission],
    isDevelopment,
    isAdminPage,
    isDevAdmin
  });
  
  useEffect(() => {
    // Always allow access in development mode for admin role
    if (isDevAdmin) return;

    // Only redirect if not in development as admin and the user doesn't have permission
    if (!hasPermission) {
      toast({
        title: "Access Restricted",
        description: `You don't have permission to access this page.`,
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [hasPermission, navigate, redirectTo, toast, permission, isDevelopment, isDevAdmin]);
  
  // In development with admin role, or if user has permission, render children
  return <>{children}</>;
};

export default RequirePermission;
