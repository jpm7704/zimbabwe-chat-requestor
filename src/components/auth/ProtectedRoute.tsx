
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login'
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Only redirect after loading is complete and user is not authenticated
    if (!loading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo, toast, loading]);
  
  // Show nothing while checking authentication status
  if (loading) {
    return null;
  }
  
  // Once loading is complete, show children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
