
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserProfile = {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
  region?: string;
  staff_number?: number;
};

export function useUserProfile(userId: string | null) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch the user profile from the database
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setProfileLoading(false);
        return;
      }
      
      try {
        setProfileLoading(true);
        setProfileError(null);
        
        // Check if we have cached profile data
        const cachedProfile = sessionStorage.getItem(`userProfile:${userId}`);
        if (cachedProfile) {
          console.log("Using cached profile data for user:", userId);
          setUserProfile(JSON.parse(cachedProfile));
          setProfileLoading(false);
          
          // Still fetch fresh data in the background
        }
        
        // Query the user_profiles table
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, name, email, role, avatar_url, region, staff_number')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Map the database fields to our UserProfile type
          const profileData = {
            id: data.id,
            first_name: data.name || '',  // Use 'name' field as 'first_name'
            last_name: '',  // Initialize as empty since it's not in the database yet
            email: data.email,
            role: data.role,
            avatar_url: data.avatar_url,
            region: data.region,
            staff_number: data.staff_number
          };
          
          // Cache the profile data
          sessionStorage.setItem(`userProfile:${userId}`, JSON.stringify(profileData));
          
          // Update state
          setUserProfile(profileData);
        } else {
          console.warn("No user profile found for user:", userId);
          // Clear cached data if no profile found
          sessionStorage.removeItem(`userProfile:${userId}`);
        }
      } catch (error: any) {
        setProfileError(error);
        console.error("Failed to load user profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  // Update the user profile
  const updateUserProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!userProfile?.id) return { error: new Error("No user profile found") };
    
    try {
      setProfileLoading(true);
      
      // Format the data for the database - mapping first_name to name
      const formattedData = {
        name: updatedProfile.first_name || userProfile.first_name,  // Map first_name to name field in DB
        email: updatedProfile.email || userProfile.email,
        region: updatedProfile.region || userProfile.region,
        avatar_url: updatedProfile.avatar_url || userProfile.avatar_url,
        role: updatedProfile.role || userProfile.role
      };
      
      const { error } = await supabase
        .from('user_profiles')
        .update(formattedData)
        .eq('id', userProfile.id);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      const updatedUserProfile = {
        ...userProfile,
        ...updatedProfile
      };
      
      setUserProfile(updatedUserProfile);
      
      // Update cached data
      sessionStorage.setItem(`userProfile:${userProfile.id}`, JSON.stringify(updatedUserProfile));
      
      // Show success toast
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      
      // Show toast error message
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      
      return { error };
    } finally {
      setProfileLoading(false);
    }
  };

  // Update avatar specifically
  const updateAvatar = async (avatarUrl: string) => {
    return await updateUserProfile({ avatar_url: avatarUrl });
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
    updateUserProfile,
    updateAvatar
  };
}
