
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function useAuthState() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Always return authenticated state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userId, setUserId] = useState<string | null>("temp-user-id");
  const [loading, setLoading] = useState(false);

  // Simulate logout functionality without actual auth
  const handleLogout = async () => {
    try {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    isAuthenticated,
    userId,
    loading,
    handleLogout
  };
}
