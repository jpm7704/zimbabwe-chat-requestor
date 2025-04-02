
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
  requiredRole?: string | string[];
}

const RequirePermission = ({ 
  children, 
  permission, 
  redirectTo = '/dashboard',
  requiredRole
}: RequirePermissionProps) => {
  const { userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  const { isAdmin } = useRoles(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get dev role from localStorage (for development mode role switching)
  const isDevelopment = import.meta.env.DEV;
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  
  // Determine if user has the required role
  const hasRequiredRole = () => {
    if (!requiredRole || !userProfile?.role) return true; // No role restriction
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userProfile.role);
    }
    
    return userProfile.role === requiredRole;
  };
  
  // Determine if user has permission - with improved logic
  const hasPermission = 
    // Admin always has permission
    isAdmin() || 
    // User has the specific permission
    permissions[permission] || 
    // We're in dev mode
    (isDevelopment && devRole);
  
  // Check both permission and role requirements
  const hasAccess = hasPermission && hasRequiredRole();
  
  useEffect(() => {
    // Skip permission checks in dev mode
    if (isDevelopment && devRole) return;

    // Only redirect if the user doesn't have permission
    if (!hasAccess) {
      toast({
        title: "Access Restricted",
        description: `You don't have the required permission to access this page.`,
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [hasAccess, navigate, redirectTo, toast, isDevelopment, devRole]);
  
  // Only render children if user has permission and the required role
  return <>{children}</>;
};

export default RequirePermission;
