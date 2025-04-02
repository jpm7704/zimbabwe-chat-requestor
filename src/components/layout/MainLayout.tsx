
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import DevRoleSwitcher from "@/components/dev/DevRoleSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import NotificationCenter from "@/components/notifications/NotificationCenter";

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
      {isDevMode && <DevRoleSwitcher />}
      <SidebarProvider>
        <div className="flex grow w-full">
          <AppSidebar />
          <main className="flex-1">
            <div className="flex justify-end p-4">
              <NotificationCenter />
            </div>
            {children}
          </main>
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
};

export default MainLayout;
