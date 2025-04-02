
import { useMemo } from "react";
import { UserProfile } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";

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
  const { getRoleInfo, isDirector } = useRoles(userProfile);
  const roleInfo = getRoleInfo();
  
  const permissions = useMemo(() => {
    const role = userProfile?.role?.toLowerCase() || 'user';
    
    // Default permissions for any user
    const defaultPermissions: Permissions = {
      canViewRequests: true,
      canCreateRequests: true,
      canViewOwnRequests: true,
      canApproveRequests: false,
      canRejectRequests: false,
      canReviewRequests: false,
      canAssignRequests: false,
      canAccessAnalytics: false,
      canAccessFieldReports: false,
      canAccessSystemSettings: false,
      canManageUsers: false
    };
    
    // Updated role-specific permissions to include HoD
    switch (role) {
      case 'head_of_department':
      case 'head_of_programs':
      case 'hop':
      case 'programme_manager':
        return {
          ...defaultPermissions,
          canReviewRequests: true,
          canAssignRequests: true,
          canAccessAnalytics: true,
          canAccessFieldReports: true,
          canCreateRequests: false  // Prevent HoD from creating new requests
        };
        
      case 'project_officer':
      case 'regional_project_officer':
      case 'assistant_project_officer':
        return {
          ...defaultPermissions,
          canReviewRequests: true,
          canAssignRequests: true,
          canAccessFieldReports: true,
          canAccessAnalytics: role === 'assistant_project_officer'
        };
        
      case 'director':
      case 'management':
        return {
          ...defaultPermissions,
          canApproveRequests: true,
          canRejectRequests: true,
          canReviewRequests: true,
          canAssignRequests: true,
          canAccessAnalytics: true,
          canAccessFieldReports: true,
          canAccessSystemSettings: true,
          canManageUsers: true
        };
        
      case 'ceo':
        return {
          ...defaultPermissions,
          canApproveRequests: true,
          canRejectRequests: true,
          canReviewRequests: true,
          canAssignRequests: true,
          canAccessAnalytics: true,
          canAccessFieldReports: true,
          canAccessSystemSettings: true,
          canManageUsers: true
        };
        
      case 'patron':
        return {
          ...defaultPermissions,
          canApproveRequests: true,
          canRejectRequests: true,
          canAccessAnalytics: true,
          canAccessFieldReports: true
        };
        
      case 'admin':
        return {
          ...defaultPermissions,
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
        
      case 'user':
      default:
        return defaultPermissions;
    }
  }, [userProfile?.role]);
  
  return permissions;
}
