
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
    // Only redirect after loading is complete and user is not authenticated
    if (!loading) {
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page.",
          variant: "destructive",
        });
        navigate(redirectTo);
        return;
      }
      
      // Check role requirements if specified
      if (requiredRole && userProfile) {
        const userRole = userProfile.role?.toLowerCase() || 'user';
        const isDevelopment = import.meta.env.DEV;
        const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
        
        // Skip role checks in dev mode with dev role set
        if (isDevelopment && devRole) return;
        
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
