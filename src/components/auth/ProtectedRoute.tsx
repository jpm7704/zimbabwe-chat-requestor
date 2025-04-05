
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { toast } = useToast();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    console.log("ProtectedRoute effect running");
    console.log("Current path:", location.pathname);
    console.log("Auth state:", { isAuthenticated, loading, userProfile });

    if (loading) {
      console.log("Still loading auth state, waiting...");
      return;
    }

    // Prevent redirect loops
    if (redirected) {
      console.log("Already redirected, preventing loop");
      return;
    }

    // Handle unauthenticated users
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to", redirectTo);
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
      setRedirected(true);
      navigate(redirectTo);
      return;
    }

    // Role-based access control
    if (requiredRole && userProfile) {
      const userRole = userProfile.role?.toLowerCase() || 'user';
      console.log("Checking role access. User role:", userRole, "Required role:", requiredRole);

      // Handle admin role - admins can access everything
      if (userRole === 'admin') {
        console.log("User is admin, allowing access");
        return;
      }

      // Check against array of roles
      if (Array.isArray(requiredRole)) {
        if (!requiredRole.some(role => role.toLowerCase() === userRole)) {
          console.log("User role not in required roles array");
          toast({
            title: "Access Restricted",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          setRedirected(true);
          navigate('/dashboard');
        } else {
          console.log("User role found in required roles array");
        }
      }
      // Check against single role
      else if (requiredRole.toLowerCase() !== userRole) {
        console.log("User role doesn't match required role");
        toast({
          title: "Access Restricted",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        setRedirected(true);
        navigate('/dashboard');
      } else {
        console.log("User role matches required role");
      }
    }
  }, [isAuthenticated, loading, navigate, redirectTo, toast, requiredRole, userProfile, location.pathname, redirected]);

  // Show nothing while checking authentication status
  if (loading) {
    console.log("Rendering loading state (null)");
    return null;
  }

  // Once loading is complete, show children if authenticated
  console.log("Rendering protected content, isAuthenticated:", isAuthenticated);
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
