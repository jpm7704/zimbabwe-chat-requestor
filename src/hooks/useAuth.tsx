
import { useAuthState } from "./useAuthState";
import { useUserProfile, UserProfile } from "./useUserProfile";
import { useState } from "react";

export type { UserProfile };

export function useAuth() {
  const { isAuthenticated, userId, loading: authLoading, handleLogout, session } = useAuthState();
  const { 
    userProfile, 
    profileLoading, 
    formatRole, 
    updateUserProfile,
    updateAvatar 
  } = useUserProfile(userId);
  
  // For role selection during login
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Combine loading states from both hooks
  const loading = authLoading || profileLoading;

  // Helper function to get the route for the selected role
  const getRoleHomePage = () => {
    // Use the profile role
    if (!userProfile || !userProfile.role) return '/dashboard';
    
    return getRouteForRole(userProfile.role.toLowerCase());
  };
  
  // Extract the role-based routing logic to a separate function
  const getRouteForRole = (role: string) => {
    switch (role) {
      case 'field_officer':
        return '/field-work';
      case 'project_officer':
      case 'assistant_project_officer':
      case 'regional_project_officer':
        return '/requests';
      case 'head_of_programs':
      case 'programme_manager':
      case 'hop':
        return '/analytics';
      case 'director':
      case 'management':
        return '/approvals';
      case 'ceo':
        return '/approvals';
      case 'patron':
        return '/approvals';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  return {
    isAuthenticated,
    userProfile,
    loading,
    handleLogout,
    formatRole,
    updateUserProfile,
    updateAvatar,
    userId,
    session,
    selectedRole,
    setSelectedRole,
    getRoleHomePage
  };
}
