
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

  // Fetch the user profile from the database
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

  // Update the user profile
  const updateUserProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!userProfile?.id) return { error: new Error("No user profile found") };
    
    try {
      setProfileLoading(true);
      
      // Format the data for the database
      const formattedData = {
        name: `${updatedProfile.first_name || userProfile.first_name || ''} ${updatedProfile.last_name || userProfile.last_name || ''}`.trim(),
        email: updatedProfile.email || userProfile.email,
        region: updatedProfile.region || userProfile.region
      };
      
      const { error } = await supabase
        .from('user_profiles')
        .update(formattedData)
        .eq('id', userProfile.id);
      
      if (error) {
        console.error("Error updating profile:", error);
        return { error };
      }
      
      // Update the local state
      setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      return { success: true };
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      return { error };
    } finally {
      setProfileLoading(false);
    }
  };

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
    formatRole,
    updateUserProfile
  };
}
