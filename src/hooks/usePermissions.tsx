
import { UserProfile } from "./useAuth";

// Define role types for better type safety
export type UserRole = 'user' | 'field_officer' | 'project_officer' | 'assistant_project_officer' | 'head_of_programs' | 'director' | 'ceo' | 'patron';

// Define permission sets for different features
export interface Permissions {
  canViewRequests: boolean;
  canAssignRequests: boolean;
  canReviewRequests: boolean;
  canApproveRequests: boolean;
  canManageStaff: boolean;
  canAccessAnalytics: boolean;
  canAccessFieldReports: boolean;
  canAccessAdminPanel: boolean;
}

export function usePermissions(userProfile: UserProfile | null) {
  // Default permissions (unauthenticated user)
  const defaultPermissions: Permissions = {
    canViewRequests: false,
    canAssignRequests: false,
    canReviewRequests: false,
    canApproveRequests: false,
    canManageStaff: false,
    canAccessAnalytics: false,
    canAccessFieldReports: false,
    canAccessAdminPanel: false,
  };

  if (!userProfile || !userProfile.role) {
    return defaultPermissions;
  }

  // Get the user's role
  const userRole = userProfile.role as UserRole;

  // Define permissions based on role
  switch (userRole) {
    case 'field_officer':
      return {
        canViewRequests: true,
        canAssignRequests: false,
        canReviewRequests: true,
        canApproveRequests: false,
        canManageStaff: false,
        canAccessAnalytics: false,
        canAccessFieldReports: true,
        canAccessAdminPanel: false,
      };
    case 'project_officer':
      return {
        canViewRequests: true,
        canAssignRequests: true,
        canReviewRequests: true,
        canApproveRequests: false,
        canManageStaff: false,
        canAccessAnalytics: false,
        canAccessFieldReports: true,
        canAccessAdminPanel: false,
      };
    case 'assistant_project_officer':
      return {
        canViewRequests: true,
        canAssignRequests: true,
        canReviewRequests: true,
        canApproveRequests: false,
        canManageStaff: false,
        canAccessAnalytics: true,
        canAccessFieldReports: true,
        canAccessAdminPanel: false,
      };
    case 'head_of_programs':
      return {
        canViewRequests: true,
        canAssignRequests: true,
        canReviewRequests: true,
        canApproveRequests: false, // Changed to false as HOP no longer makes final decision
        canManageStaff: true,
        canAccessAnalytics: true,
        canAccessFieldReports: true,
        canAccessAdminPanel: false,
      };
    case 'director':
      return {
        canViewRequests: true,
        canAssignRequests: false,
        canReviewRequests: true,
        canApproveRequests: true,
        canManageStaff: true,
        canAccessAnalytics: true,
        canAccessFieldReports: true,
        canAccessAdminPanel: true,
      };
    case 'ceo':
      return {
        canViewRequests: true,
        canAssignRequests: false,
        canReviewRequests: true,
        canApproveRequests: true,
        canManageStaff: false,
        canAccessAnalytics: true,
        canAccessFieldReports: true,
        canAccessAdminPanel: false,
      };
    case 'patron':
      return {
        canViewRequests: true,
        canAssignRequests: false,
        canReviewRequests: true,
        canApproveRequests: true,
        canManageStaff: false,
        canAccessAnalytics: true,
        canAccessFieldReports: true,
        canAccessAdminPanel: false,
      };
    case 'user':
    default:
      return {
        canViewRequests: true,
        canAssignRequests: false,
        canReviewRequests: false,
        canApproveRequests: false,
        canManageStaff: false,
        canAccessAnalytics: false,
        canAccessFieldReports: false,
        canAccessAdminPanel: false,
      };
  }
}
