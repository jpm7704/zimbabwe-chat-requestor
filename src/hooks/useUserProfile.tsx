
import { useState, useEffect } from "react";
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types";

// Helper function to compute full name
const getFullName = (firstName: string, lastName?: string): string => {
  if (!firstName && !lastName) return 'Unknown User';
  if (!lastName) return firstName;
  if (!firstName) return lastName;
  return `${firstName} ${lastName}`;
};

export function useUserProfile(userId: string | null) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch the user profile from the database
  useEffect(() => {
    // Use a mounted flag to prevent state updates after unmount
    let isMounted = true;

    const fetchProfile = async () => {
      if (!userId) {
        if (isMounted) setProfileLoading(false);
        return;
      }

      try {
        if (isMounted) {
          setProfileLoading(true);
          setProfileError(null);
        }

        console.log("Fetching profile for user ID:", userId);

        // First, try to get from session storage for quicker loading
        const cachedProfile = sessionStorage.getItem(`userProfile:${userId}`);
        if (cachedProfile && isMounted) {
          try {
            const parsedProfile = JSON.parse(cachedProfile);
            setUserProfile(parsedProfile);
            console.log("Using cached profile:", parsedProfile);
          } catch (parseError) {
            console.error("Error parsing cached profile:", parseError);
            // Clear invalid cache
            sessionStorage.removeItem(`userProfile:${userId}`);
          }
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
              .select('id, first_name, last_name, email, role, avatar_url, region, staff_number, created_at, updated_at')
              .eq('id', userId)
              .maybeSingle();

            console.log('Profile query result:', { data: directData, error: directError });

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
              console.log('Raw profile data from database:', directData);

              const profileData = {
                id: directData.id,
                first_name: directData.first_name || '',
                last_name: directData.last_name || '',
                email: directData.email,
                role: directData.role,
                avatar_url: directData.avatar_url,
                region: directData.region,
                staff_number: directData.staff_number
              };

              console.log('Mapped profile data:', profileData);

              // Cache the profile data
              sessionStorage.setItem(`userProfile:${userId}`, JSON.stringify(profileData));

              // Update state if component is still mounted
              if (isMounted) {
                setUserProfile(profileData);
                console.log("Fetched user profile successfully:", profileData);
              }
            }
          }
        } catch (fetchError) {
          console.error("Error in profile fetch:", fetchError);
          // Don't set error state here to avoid blocking UI
          // We'll use cached or fallback profile instead
        }
      } catch (error: any) {
        console.error("Failed to load user profile:", error);

        // Only update state if component is still mounted
        if (isMounted) {
          setProfileError(error);

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

          setProfileLoading(false);
        }
      }
    };

    fetchProfile();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      console.log("Profile hook cleanup - preventing further state updates");
    };
  }, [userId]);

  // Update the user profile
  const updateUserProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!userProfile?.id) {
      console.error("Cannot update profile: No user profile found");
      return { error: new Error("No user profile found") };
    }

    try {
      setProfileLoading(true);

      // Format the data for the database - ensure we're using the correct field names
      const formattedData = {
        first_name: updatedProfile.first_name || userProfile.first_name,
        last_name: updatedProfile.last_name || userProfile.last_name,
        email: updatedProfile.email || userProfile.email,
        region: updatedProfile.region || userProfile.region,
        avatar_url: updatedProfile.avatar_url || userProfile.avatar_url,
        role: updatedProfile.role || userProfile.role,
        staff_number: updatedProfile.staff_number || userProfile.staff_number,
        updated_at: new Date().toISOString() // Add updated timestamp
      };

      console.log('Updating profile with data:', formattedData);
      console.log('User ID for update:', userProfile.id);

      // First try to update
      console.log('Executing Supabase update for user ID:', userProfile.id);
      let { data: updateData, error, status, statusText } = await supabase
        .from('user_profiles')
        .update(formattedData)
        .eq('id', userProfile.id)
        .select();

      console.log('Update response:', { data: updateData, error, status, statusText });

      // If update fails due to no existing row, try to insert instead
      if (error) {
        console.error('Update error:', error);

        // Try to get more information about the error
        const errorDetails = {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        };
        console.error('Error details:', errorDetails);

        if (error.code === '23502' || error.message?.includes("violates not-null constraint")) {
          console.log("Profile doesn't exist yet, creating new profile...");
          const { data: insertData, error: insertError, status: insertStatus } = await supabase
            .from('user_profiles')
            .insert({
              id: userProfile.id,
              ...formattedData
            })
            .select();

          console.log('Insert response:', { data: insertData, error: insertError, status: insertStatus });

          if (insertError) {
            console.error('Insert error:', insertError);
            throw insertError;
          }

          // Use the inserted data if available
          if (insertData && insertData.length > 0) {
            updateData = insertData;
          }
        } else {
          throw error;
        }
      }

      // If we have update data, use it to update the local state
      if (updateData && updateData.length > 0) {
        console.log('Successfully updated profile, received data:', updateData[0]);
      }

      // Update the local state with the response data if available, otherwise use the input data
      const updatedUserProfile = {
        ...userProfile,
        ...(updateData && updateData.length > 0 ? {
          first_name: updateData[0].first_name,
          last_name: updateData[0].last_name,
          email: updateData[0].email,
          region: updateData[0].region,
          avatar_url: updateData[0].avatar_url,
          role: updateData[0].role,
          staff_number: updateData[0].staff_number
        } : updatedProfile)
      };

      console.log('Final updated profile:', updatedUserProfile);

      setUserProfile(updatedUserProfile);

      // Update cached data
      sessionStorage.setItem(`userProfile:${userProfile.id}`, JSON.stringify(updatedUserProfile));

      // Show success toast
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
      });

      return { success: true, data: updatedUserProfile };
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      // Show toast error message
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });

      return { error, message: error.message || "Failed to update profile" };
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
