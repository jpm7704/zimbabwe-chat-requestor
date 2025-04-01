
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
          // Fall back to mock profile in development
          if (import.meta.env.DEV) {
            setUserProfile(getMockProfile(userId));
          } else {
            throw error;
          }
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
        
        // Fall back to mock profile in development
        if (import.meta.env.DEV) {
          setUserProfile(getMockProfile(userId));
        }
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  // Add effect to update profile when dev_role changes in localStorage
  useEffect(() => {
    if (import.meta.env.DEV) {
      const handleStorageChange = () => {
        setUserProfile(getMockProfile(userId));
      };

      // Listen for changes to localStorage
      window.addEventListener('storage', handleStorageChange);
      
      // Also check for changes directly (for when the localStorage is updated in the same window)
      const checkInterval = setInterval(() => {
        const currentProfileRole = userProfile?.role;
        const currentDevRole = localStorage.getItem('dev_role');
        
        if (currentProfileRole !== currentDevRole && currentDevRole) {
          setUserProfile(getMockProfile(userId));
        }
      }, 1000);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(checkInterval);
      };
    }
  }, [userId, userProfile]);

  // Helper function to get a mock profile for development
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
