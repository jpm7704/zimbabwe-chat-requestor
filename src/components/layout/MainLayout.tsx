
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarInset, 
  SidebarRail 
} from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/hooks/useAuth";

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

  return (
    <div className="min-h-screen flex flex-col w-full">
      {isAuthenticated ? <AppSidebar /> : <Navbar />}
      <div className="flex flex-col min-h-screen flex-1">
        {!isAuthenticated && <Navbar />}
        <main className="flex-grow pt-20">
          {isAuthenticated && (
            <SidebarProvider defaultOpen={true}>
              <SidebarRail />
            </SidebarProvider>
          )}
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
