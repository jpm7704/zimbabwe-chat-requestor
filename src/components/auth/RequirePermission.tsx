
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
  
  // Special case for admin panel
  const isAdminPage = permission === 'canAccessAdminPanel';
  const hasPermission = isAdminPage ? userProfile?.role === 'admin' : permissions[permission];
  
  // Log permission check for debugging
  console.log(`Permission check for ${permission}: ${hasPermission}`, {
    userRole: userProfile?.role,
    permissionValue: permissions[permission],
    isDevelopment,
    isAdminPage
  });
  
  useEffect(() => {
    // Always allow access in development mode
    if (isDevelopment) return;

    // Only redirect if not in development and the user doesn't have permission
    if (!hasPermission) {
      toast({
        title: "Access Restricted",
        description: `You don't have permission to access this page.`,
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [hasPermission, navigate, redirectTo, toast, permission, isDevelopment]);
  
  // In development, ALWAYS render children regardless of permission
  // In production, child will render but useEffect will redirect if needed
  return <>{children}</>;
};

export default RequirePermission;
