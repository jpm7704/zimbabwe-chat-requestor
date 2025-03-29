
import { useState } from "react";
import { useAuthState } from "./useAuthState";
import { useUserProfile, UserProfile } from "./useUserProfile";

export type { UserProfile };

export function useAuth() {
  // Original code that we're temporarily bypassing
  const { isAuthenticated: actualAuth, userId, loading: authLoading, handleLogout: originalLogout } = useAuthState();
  const { userProfile: actualProfile, profileLoading, formatRole } = useUserProfile(userId);

  // State to track if we're in "signed out" mode for testing different roles
  const [devSignedOut, setDevSignedOut] = useState(true); // Start in signed out state
  
  // State to track selected role for testing
  const [selectedRole, setSelectedRole] = useState<string>("user"); // Default to basic user role
  
  // Override authentication state for development
  const isAuthenticated = !devSignedOut; // Authenticated unless manually signed out
  const loading = false; // Never loading
  
  // Mock user profile with configurable role for testing
  const userProfile: UserProfile = {
    id: "mock-user-id",
    first_name: "Development",
    last_name: "User",
    email: "dev@example.com",
    role: selectedRole, // Use selected role
    avatar_url: "",
    region: "All Regions"
  };

  // Complete logout handler that fully resets the state
  const handleLogout = () => {
    // Reset to completely signed out state
    setDevSignedOut(true);
    setSelectedRole("user"); // Reset to default basic role
    
    // Also trigger the actual logout if in real auth mode
    if (actualAuth) {
      originalLogout();
    }
  };

  // Custom login handler for development
  const handleDevLogin = (role: string) => {
    setSelectedRole(role);
    setDevSignedOut(false);
  };

  return {
    isAuthenticated,
    userProfile,
    loading,
    handleLogout,
    formatRole,
    // Development helpers
    handleDevLogin,
    devSignedOut,
    selectedRole,
    setSelectedRole
  };
}
