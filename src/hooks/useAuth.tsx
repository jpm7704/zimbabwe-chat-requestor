
import { useAuthState } from "./useAuthState";
import { useUserProfile, UserProfile } from "./useUserProfile";

export type { UserProfile };

export function useAuth() {
  // Original code that we're temporarily bypassing
  const { isAuthenticated: actualAuth, userId, loading: authLoading, handleLogout } = useAuthState();
  const { userProfile: actualProfile, profileLoading, formatRole } = useUserProfile(userId);

  // TEMPORARY: Override authentication state for development
  // Set isAuthenticated to always be true and use a mock user profile
  const isAuthenticated = true; // Always authenticated
  const loading = false; // Never loading
  
  // Mock user profile with director role for maximum permissions
  const userProfile: UserProfile = {
    id: "mock-user-id",
    first_name: "Development",
    last_name: "User",
    email: "dev@example.com",
    role: "director", // Use director role to have maximum permissions
    avatar_url: "",
    region: "All Regions"
  };

  return {
    isAuthenticated,
    userProfile,
    loading,
    handleLogout, // Keep the original logout function
    formatRole
  };
}
