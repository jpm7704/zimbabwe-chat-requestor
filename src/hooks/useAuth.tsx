
import { useAuthState } from "./useAuthState";
import { useUserProfile } from "./useUserProfile";
import { useState, useEffect } from "react";
import { UserProfile } from "@/types";

export function useAuth() {
  const { isAuthenticated, userId, loading: authLoading, handleLogout, session, user } = useAuthState();
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

  // Effect to synchronize selected role with profile
  useEffect(() => {
    // When the user profile is loaded, update selected role if not yet set
    if (!selectedRole && userProfile?.role) {
      setSelectedRole(userProfile.role);
      console.log("Setting selected role from profile:", userProfile.role);
    }
  }, [userProfile, selectedRole]);

  // Helper function to get the route for the user's role
  const getRoleHomePage = () => {
    // First check session metadata for role
    const metadataRole = session?.user?.user_metadata?.role;

    // Then check profile role
    const profileRole = userProfile?.role;

    // Use the most authoritative source (profile takes precedence)
    const role = profileRole || metadataRole;

    if (!role) {
      console.warn("No role found, defaulting to dashboard");
      return '/dashboard';
    }

    console.log("Getting home page for role:", role);
    return getRouteForRole(role.toLowerCase());
  };

  // Extract the role-based routing logic to a separate function
  const getRouteForRole = (role: string) => {
    switch (role.toLowerCase()) {
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
    user,
    selectedRole,
    setSelectedRole,
    getRoleHomePage
  };
}
