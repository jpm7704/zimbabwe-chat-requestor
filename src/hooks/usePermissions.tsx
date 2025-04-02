
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
  const { isAdmin } = useRoles(userProfile);
  
  const permissions = useMemo(() => {
    const role = userProfile?.role?.toLowerCase() || 'user';
    
    // If user is admin, they have all permissions
    if (isAdmin()) {
      return {
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
    }
    
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
    
    // Role-specific permissions with improved organization
    switch (role) {
      // Program Management Roles
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
          canCreateRequests: false  // Prevent program managers from creating requests
        };
      
      // Field Operations Roles  
      case 'project_officer':
      case 'regional_project_officer':
        return {
          ...defaultPermissions,
          canReviewRequests: true,
          canAssignRequests: true,
          canAccessFieldReports: true,
          canAccessAnalytics: true
        };
        
      case 'assistant_project_officer':
        return {
          ...defaultPermissions,
          canReviewRequests: true,
          canAssignRequests: false,  // Assistant officers cannot assign requests
          canAccessFieldReports: true,
          canAccessAnalytics: false
        };
      
      case 'field_officer':
        return {
          ...defaultPermissions,
          canReviewRequests: false,
          canAssignRequests: false,
          canAccessFieldReports: true,
          canAccessAnalytics: false
        };
        
      // Management Roles
      case 'director':
      case 'management':
        return {
          ...defaultPermissions,
          canApproveRequests: true,
          canRejectRequests: true,
          canReviewRequests: true,
          canAssignRequests: false,  // Directors don't assign requests directly
          canAccessAnalytics: true,
          canAccessFieldReports: true,
          canAccessSystemSettings: false,  // Restrict system settings to admin only
          canManageUsers: true
        };
        
      case 'ceo':
        return {
          ...defaultPermissions,
          canApproveRequests: true,
          canRejectRequests: true,
          canReviewRequests: true,
          canAssignRequests: false,
          canAccessAnalytics: true,
          canAccessFieldReports: true,
          canAccessSystemSettings: false,  // Restrict system settings to admin only
          canManageUsers: true
        };
        
      case 'patron':
        return {
          ...defaultPermissions,
          canApproveRequests: true,
          canRejectRequests: true,
          canAccessAnalytics: true,
          canAccessFieldReports: true,
          canAccessSystemSettings: false,  // Restrict system settings to admin only
          canManageUsers: false
        };
        
      // Regular User Role
      case 'user':
      default:
        return defaultPermissions;
    }
  }, [userProfile?.role, isAdmin]);
  
  return permissions;
}
