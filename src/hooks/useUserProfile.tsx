
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
        
        console.log("Fetching profile for user ID:", userId);
        
        // First, try to get from session storage for quicker loading
        const cachedProfile = sessionStorage.getItem(`userProfile:${userId}`);
        if (cachedProfile) {
          const parsedProfile = JSON.parse(cachedProfile);
          setUserProfile(parsedProfile);
          console.log("Using cached profile:", parsedProfile);
        }
        
        // Then still try to fetch fresh data (but don't block UI)
        try {
          // Try direct query first (avoid RLS if possible)
          const { data: userData, error: authError } = await supabase.auth.getUser();
          if (authError) throw authError;
          
          if (userData && userData.user) {
            // Try fetching profile directly as a fallback (bypassing RLS)
            const { data: directData, error: directError } = await supabase
              .from('user_profiles')
              .select('id, name, email, role, avatar_url, region, staff_number')
              .eq('id', userId)
              .maybeSingle();
            
            if (directError) {
              console.warn("Direct profile query error:", directError);
              // If this fails, create a fallback profile based on auth data
              const fallbackProfile: UserProfile = {
                id: userData.user.id,
                first_name: userData.user.user_metadata?.name || "User",
                email: userData.user.email || "",
                role: userData.user.user_metadata?.role || "user"
              };
              
              // Cache the fallback profile
              sessionStorage.setItem(`userProfile:${userId}`, JSON.stringify(fallbackProfile));
              
              // Only update state if we don't already have a profile
              if (!userProfile) {
                setUserProfile(fallbackProfile);
              }
              
              console.log("Created fallback profile from auth data:", fallbackProfile);
            } else if (directData) {
              // Map the database fields to our UserProfile type
              const profileData = {
                id: directData.id,
                first_name: directData.name || '',  // Use 'name' field as 'first_name'
                last_name: '',  // Initialize as empty since it's not in the database yet
                email: directData.email,
                role: directData.role,
                avatar_url: directData.avatar_url,
                region: directData.region,
                staff_number: directData.staff_number
              };
              
              // Cache the profile data
              sessionStorage.setItem(`userProfile:${userId}`, JSON.stringify(profileData));
              
              // Update state
              setUserProfile(profileData);
              console.log("Fetched user profile successfully:", profileData);
            }
          }
        } catch (fetchError) {
          console.error("Error in profile fetch:", fetchError);
          // Don't set error state here to avoid blocking UI
          // We'll use cached or fallback profile instead
        }
      } catch (error: any) {
        setProfileError(error);
        console.error("Failed to load user profile:", error);
        
        // Create a default profile as fallback
        if (userId) {
          const fallbackProfile = {
            id: userId,
            first_name: "User",
            email: "",
            role: "user"
          };
          setUserProfile(fallbackProfile);
          console.log("Using fallback profile due to error:", fallbackProfile);
        }
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
      
      // First try to update
      let { error } = await supabase
        .from('user_profiles')
        .update(formattedData)
        .eq('id', userProfile.id);
      
      // If update fails due to no existing row, try to insert instead
      if (error && error.code === '23502') { // "null value in column violates not-null constraint"
        console.log("Profile doesn't exist yet, creating new profile...");
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: userProfile.id,
            ...formattedData
          });
          
        if (insertError) throw insertError;
      } else if (error) {
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
