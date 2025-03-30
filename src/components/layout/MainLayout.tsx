
import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
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
  const isHomePage = location.pathname === "/";
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show loading state while auth is determining
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // For public pages like home, render the regular layout with footer
  if (isHomePage) {
    return (
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-col min-h-screen flex-1">
          <main className="flex-grow px-4 container mx-auto max-w-5xl">
            {children}
          </main>
          <Footer />
        </div>
        <ThemeToggle />
        <DevRoleSwitcher />
      </div>
    );
  }

  // For login/register pages, don't redirect if not authenticated
  if (!isAuthenticated && (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/staff-verification")) {
    return (
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-col min-h-screen flex-1">
          <main className="flex-grow px-4 container mx-auto max-w-5xl">
            {children}
          </main>
        </div>
        <ThemeToggle />
        <DevRoleSwitcher />
      </div>
    );
  }
  
  // If user is authenticated, render the sidebar layout
  if (isAuthenticated) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex flex-col min-h-screen flex-1">
            <main className="flex-grow pt-24 px-4 container mx-auto max-w-5xl">
              {children}
            </main>
          </div>
          <ThemeToggle />
          <DevRoleSwitcher />
        </div>
      </SidebarProvider>
    );
  }
  
  // For other non-authenticated routes that aren't the home page, redirect to login
  return <Navigate to="/login" replace />;
};

export default MainLayout;
