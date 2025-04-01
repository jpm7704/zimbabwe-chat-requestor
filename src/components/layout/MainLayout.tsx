import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AppSidebar from "./AppSidebar";
import Footer from "./Footer";
import DevRoleSwitcher from "@/components/dev/DevRoleSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Enable real-time notifications
  useRealtimeNotifications();
  
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Get dev role from localStorage (for development mode role switching)
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  
  // In development mode, ALL roles should bypass permission checks
  const isDevMode = isDevelopment && devRole;
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {isDevMode && <DevRoleSwitcher />}
      <div className="flex grow">
        <AppSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
