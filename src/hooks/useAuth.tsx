
import { useAuthState } from "./useAuthState";
import { useUserProfile, UserProfile } from "./useUserProfile";
import { useState } from "react";

export type { UserProfile };

export function useAuth() {
  const { isAuthenticated, userId, loading, handleLogout, session } = useAuthState();
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
  const combinedLoading = loading || profileLoading;

  // Helper function to get the route for the selected role
  const getRoleHomePage = () => {
    if (!userProfile || !userProfile.role) return '/dashboard';
    
    const role = userProfile.role.toLowerCase();
    
    switch (role) {
      case 'field_officer':
        return '/field-work';
      case 'project_officer':
      case 'assistant_project_officer':
        return '/requests';
      case 'head_of_programs':
      case 'programme_manager':
      case 'hop':
        return '/analytics';
      case 'director':
      case 'ceo':
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
    loading: combinedLoading,
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
