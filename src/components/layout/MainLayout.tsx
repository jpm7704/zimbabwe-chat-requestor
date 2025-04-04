
import React from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, userProfile, getRoleHomePage } = useAuth();
  const navigate = useNavigate();
  
  // Enable real-time notifications
  useRealtimeNotifications();

  React.useEffect(() => {
    // Redirect unauthenticated users to login
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
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
