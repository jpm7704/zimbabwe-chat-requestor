
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  requiredRole?: string | string[];
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login',
  requiredRole
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading, userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (loading) return;
    
    // Handle unauthenticated users
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
      navigate(redirectTo);
      return;
    }
    
    // Role-based access control
    if (requiredRole && userProfile) {
      const userRole = userProfile.role?.toLowerCase() || 'user';
      
      // Check if in development mode with role override
      const isDevelopment = import.meta.env.DEV;
      const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
      
      // Skip role checks in dev mode with dev role set
      if (isDevelopment && devRole) return;
      
      // Handle admin role - admins can access everything
      if (userRole === 'admin') return;
      
      // Check against array of roles
      if (Array.isArray(requiredRole)) {
        if (!requiredRole.some(role => role.toLowerCase() === userRole)) {
          toast({
            title: "Access Restricted",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } 
      // Check against single role
      else if (requiredRole.toLowerCase() !== userRole) {
        toast({
          title: "Access Restricted",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, loading, navigate, redirectTo, toast, requiredRole, userProfile]);
  
  // Show nothing while checking authentication status
  if (loading) {
    return null;
  }
  
  // Once loading is complete, show children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
