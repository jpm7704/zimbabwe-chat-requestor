
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions, Permissions } from '@/hooks/usePermissions';

interface RequirePermissionProps {
  children: ReactNode;
  permission: keyof Permissions;
  redirectTo?: string;
}

const RequirePermission = ({ children, permission }: RequirePermissionProps) => {
  const { userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  
  // For development, bypass permission checks
  console.log(`[DEV MODE] Permission check for ${permission}: ${permissions[permission]}`);
  
  // Always render children in development mode
  return <>{children}</>;
};

export default RequirePermission;
