
import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';

interface RequirePermissionProps {
  children: ReactNode;
  permission: keyof ReturnType<typeof usePermissions>;
  redirectTo?: string;
}

const RequirePermission = ({ children }: RequirePermissionProps) => {
  // Simply render children without checking permissions
  return <>{children}</>;
};

export default RequirePermission;
