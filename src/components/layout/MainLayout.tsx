
import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/theme/ThemeToggle";
import DevRoleSwitcher from "@/components/dev/DevRoleSwitcher";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show loading state while auth is determining
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If user is authenticated, render the sidebar layout
  if (isAuthenticated) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex flex-col min-h-screen flex-1">
            <main className="flex-grow">
              {children}
            </main>
          </div>
          <ThemeToggle />
          <DevRoleSwitcher />
        </div>
      </SidebarProvider>
    );
  }
  
  // For non-authenticated routes, redirect to login
  return <Navigate to="/login" replace />;
};

export default MainLayout;
