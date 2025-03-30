
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
  
  // Check if the user has the required permission
  const hasPermission = permissions[permission];
  
  // Log permission check for debugging
  console.log(`Permission check for ${permission}: ${hasPermission}`, {
    userRole: userProfile?.role,
    permissionValue: permissions[permission],
    isDevelopment
  });
  
  useEffect(() => {
    // In development mode, always allow access
    if (isDevelopment) return;

    // If user doesn't have permission, redirect and show a toast
    if (!hasPermission) {
      toast({
        title: "Access Restricted",
        description: `You don't have permission to access this page.`,
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [hasPermission, navigate, redirectTo, toast, permission, isDevelopment]);
  
  // In development mode, always render children
  if (isDevelopment) return <>{children}</>;
  
  // Only render children if the user has permission
  return hasPermission ? <>{children}</> : null;
};

export default RequirePermission;
