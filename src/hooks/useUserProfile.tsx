
import { useState, useEffect } from "react";

export type UserProfile = {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
  region?: string;
};

export function useUserProfile(userId: string | null) {
  // Create a mock profile for development
  const mockProfile: UserProfile = {
    id: userId || "temp-user-id",
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    role: "director", // Default role
    avatar_url: "",
    region: "Central"
  };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(mockProfile);
  const [profileLoading, setProfileLoading] = useState(false);

  // Format role for display
  const formatRole = (role: string) => {
    if (!role) return '';
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Add role switcher for development
  useEffect(() => {
    // Check if we have a role in localStorage
    const savedRole = localStorage.getItem('dev_role');
    if (savedRole) {
      setUserProfile(prev => prev ? {...prev, role: savedRole} : null);
    }
  }, []);

  return {
    userProfile,
    profileLoading,
    formatRole
  };
}
