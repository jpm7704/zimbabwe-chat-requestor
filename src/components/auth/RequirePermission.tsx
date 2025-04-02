
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { useToast } from '@/hooks/use-toast';

interface RequirePermissionProps {
  children: ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
}

const RequirePermission = ({ 
  children, 
  requiredRole,
  redirectTo = '/dashboard'
}: RequirePermissionProps) => {
  const { userProfile } = useAuth();
  const { 
    isAdmin,
    isRegularUser,
    isFieldOfficer,
    isProjectOfficer,
    isAssistantProjectOfficer,
    isHeadOfPrograms,
    isDirector,
    isCEO,
    isPatron
  } = useRoles(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get dev role from localStorage (for development mode role switching)
  const isDevelopment = import.meta.env.DEV;
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  
  // Determine if user has the required role
  const hasRequiredRole = () => {
    // In dev mode with dev role set, bypass checks
    if (isDevelopment && devRole) return true;
    
    // Admin always has access
    if (isAdmin()) return true;
    
    // If no role requirement specified, allow access
    if (!requiredRole) return true;
    
    // Check against array of roles
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => {
        switch(role.toLowerCase()) {
          case 'admin': return isAdmin();
          case 'user': return isRegularUser();
          case 'field_officer': return isFieldOfficer();
          case 'project_officer': return isProjectOfficer();
          case 'assistant_project_officer': return isAssistantProjectOfficer();
          case 'head_of_programs': 
          case 'head_of_department':
          case 'hop':
          case 'programme_manager': return isHeadOfPrograms();
          case 'director': 
          case 'management': return isDirector();
          case 'ceo': return isCEO();
          case 'patron': return isPatron();
          default: return false;
        }
      });
    }
    
    // Check against single role
    switch(requiredRole.toLowerCase()) {
      case 'admin': return isAdmin();
      case 'user': return isRegularUser();
      case 'field_officer': return isFieldOfficer();
      case 'project_officer': return isProjectOfficer();
      case 'assistant_project_officer': return isAssistantProjectOfficer();
      case 'head_of_programs': 
      case 'head_of_department':
      case 'hop':
      case 'programme_manager': return isHeadOfPrograms();
      case 'director': 
      case 'management': return isDirector();
      case 'ceo': return isCEO();
      case 'patron': return isPatron();
      default: return false;
    }
  };
  
  useEffect(() => {
    // Skip permission checks in dev mode
    if (isDevelopment && devRole) return;

    // Only redirect if the user doesn't have the required role
    if (!hasRequiredRole()) {
      toast({
        title: "Access Restricted",
        description: `You don't have the required role to access this page.`,
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [navigate, redirectTo, toast, isDevelopment, devRole]);
  
  // Only render children if user has the required role
  return <>{children}</>;
};

export default RequirePermission;
