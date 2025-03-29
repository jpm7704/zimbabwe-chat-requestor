
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
            {/* Footer removed for authenticated users */}
          </div>
          <ThemeToggle />
        </div>
      </SidebarProvider>
    );
  }
  
  // For unauthenticated users, render the regular layout with footer
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex flex-col min-h-screen flex-1">
        <main className="flex-grow pt-24 px-4 container mx-auto max-w-5xl">
          {children}
        </main>
        <Footer />
      </div>
      <ThemeToggle />
    </div>
  );
};

export default MainLayout;
