
import { useAuthState } from "./useAuthState";
import { useUserProfile, UserProfile } from "./useUserProfile";

export type { UserProfile };

export function useAuth() {
  const { isAuthenticated, userId, loading, handleLogout } = useAuthState();
  const { 
    userProfile, 
    profileLoading, 
    formatRole, 
    updateUserProfile,
    updateAvatar 
  } = useUserProfile(userId);

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
    userId
  };
}
