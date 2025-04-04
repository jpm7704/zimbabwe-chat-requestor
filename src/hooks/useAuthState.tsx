
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  // Check for session on initial load and set up auth listener
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        setUserId(currentSession?.user?.id || null);
      }
    );

    // Then check for existing session
    const initSession = async () => {
      setLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        setUserId(currentSession?.user?.id || null);
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Log out function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    isAuthenticated,
    userId,
    loading,
    session,
    handleLogout,
  };
}
