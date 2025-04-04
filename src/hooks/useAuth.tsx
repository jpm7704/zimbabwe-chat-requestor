
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
    setSelectedRole
  };
}
