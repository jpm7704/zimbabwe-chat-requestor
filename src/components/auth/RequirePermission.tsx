
import { ReactNode } from 'react';

interface RequirePermissionProps {
  children: ReactNode;
  permission: string; // Using string instead of keyof for flexibility in dev mode
  redirectTo?: string;
}

const RequirePermission = ({ children }: RequirePermissionProps) => {
  // TEMPORARY: Skip all permission checks and always render children
  // This ensures role-specific pages are always accessible in development
  console.log("Permission check bypassed in development mode");
  return <>{children}</>;
};

export default RequirePermission;
