
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for session on initial load and set up auth listener
  useEffect(() => {
    console.log("Setting up auth state listener and checking for session");

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, "User:", currentSession?.user?.id);
        console.log("Current session exists:", !!currentSession);

        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        setUserId(currentSession?.user?.id || null);
        setUser(currentSession?.user || null);

        // For debugging
        if (currentSession?.user) {
          console.log("User metadata:", currentSession.user.user_metadata);
          console.log("User role from metadata:", currentSession.user.user_metadata?.role);
        } else {
          console.log("No user in current session");
        }
      }
    );

    // Then check for existing session
    const initSession = async () => {
      setLoading(true);
      try {
        console.log("Checking for existing session...");
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }

        const currentSession = data.session;
        console.log("Session exists:", !!currentSession);

        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        setUserId(currentSession?.user?.id || null);
        setUser(currentSession?.user || null);

        if (currentSession) {
          console.log("Retrieved existing session for user:", currentSession?.user?.id);
          // For debugging
          console.log("User metadata:", currentSession.user.user_metadata);
          console.log("User role from metadata:", currentSession.user.user_metadata?.role);
        } else {
          console.log("No existing session found");
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  // Log out function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear any cached profile data
      sessionStorage.clear();
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
    user,
    handleLogout,
  };
}
