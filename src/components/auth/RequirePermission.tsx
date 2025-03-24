
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';

interface RequirePermissionProps {
  children: ReactNode;
  permission: keyof Permissions;
}

const RequirePermission = ({ children, permission }: RequirePermissionProps) => {
  const { isAuthenticated, userProfile, loading } = useAuth();
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Wait for auth to initialize
    if (loading) return;
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Check if user has required permission
    if (!permissions[permission]) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, permissions, permission, navigate, loading, toast]);

  // Show nothing while checking permissions
  if (loading || !isAuthenticated || !permissions[permission]) {
    return null;
  }

  return <>{children}</>;
};

export default RequirePermission;
