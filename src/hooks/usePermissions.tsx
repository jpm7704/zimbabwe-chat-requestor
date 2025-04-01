
import { useMemo } from "react";
import { UserProfile } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";

// Define and export the Permissions type
export type Permissions = {
  canViewRequests: boolean;
  canCreateRequests: boolean;
  canViewOwnRequests: boolean;
  canApproveRequests: boolean;
  canRejectRequests: boolean;
  canReviewRequests: boolean;
  canAssignRequests: boolean;
  canAccessAnalytics: boolean;
  canAccessFieldReports: boolean;
  canAccessSystemSettings: boolean;
  canAccessAdminPanel?: boolean;
  canManageUsers: boolean;
};

export function usePermissions(userProfile: UserProfile | null): Permissions {
  // Grant all permissions to all roles
  const allPermissions: Permissions = {
    canViewRequests: true,
    canCreateRequests: true,
    canViewOwnRequests: true,
    canApproveRequests: true,
    canRejectRequests: true,
    canReviewRequests: true,
    canAssignRequests: true,
    canAccessAnalytics: true,
    canAccessFieldReports: true,
    canAccessSystemSettings: true,
    canAccessAdminPanel: true,
    canManageUsers: true
  };
  
  return allPermissions;
}
