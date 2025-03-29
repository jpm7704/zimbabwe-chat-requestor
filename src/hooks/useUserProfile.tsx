
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

  useEffect(() => {
    // If no userId, clear profile and return
    if (!userId) {
      setUserProfile(null);
      setProfileLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUserProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Format role for display
  const formatRole = (role: string) => {
    if (!role) return '';
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return {
    userProfile,
    profileLoading,
    formatRole
  };
}
