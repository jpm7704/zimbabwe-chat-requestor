
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setUserProfile(getMockProfile(userId));
        setProfileLoading(false);
        return;
      }
      
      try {
        setProfileLoading(true);
        setProfileError(null);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, name, email, role, avatar_url, region')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          // Fall back to mock profile
          setUserProfile(getMockProfile(userId));
        } else if (data) {
          // Map the database fields to our UserProfile type
          setUserProfile({
            id: data.id,
            first_name: data.name?.split(' ')[0] || '',
            last_name: data.name?.split(' ').slice(1).join(' ') || '',
            email: data.email,
            role: data.role,
            avatar_url: data.avatar_url,
            region: data.region
          });
        }
      } catch (error: any) {
        setProfileError(error);
        console.error("Failed to load user profile:", error);
        
        // Fall back to mock profile
        setUserProfile(getMockProfile(userId));
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  // Add event listener for role changes
  useEffect(() => {
    const handleRoleChange = () => {
      setUserProfile(getMockProfile(userId));
    };

    // Listen for dev role changes
    window.addEventListener('dev-role-changed', handleRoleChange);
    
    // Also listen for localStorage changes
    window.addEventListener('storage', event => {
      if (event.key === 'dev_role') {
        handleRoleChange();
      }
    });

    return () => {
      window.removeEventListener('dev-role-changed', handleRoleChange);
      window.removeEventListener('storage', handleRoleChange);
    };
  }, [userId]);

  // Helper function to get a mock profile
  const getMockProfile = (userId: string | null): UserProfile => {
    // Check if we have a role in localStorage
    const savedRole = localStorage.getItem('dev_role');
    
    return {
      id: userId || "temp-user-id",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      role: savedRole || "director", // Default role
      avatar_url: "",
      region: "Central"
    };
  };

  // Format role for display
  const formatRole = (role?: string) => {
    if (!role) return '';
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return {
    userProfile,
    profileLoading,
    profileError,
    formatRole
  };
}
