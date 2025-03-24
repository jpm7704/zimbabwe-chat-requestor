
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  ClipboardList, 
  FilePlus, 
  Clipboard, 
  BarChart3, 
  FileSpreadsheet, 
  Users, 
  ShieldCheck,
  Settings,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useRoles } from "@/hooks/useRoles";

interface RoleMenuProps {
  variant?: "default" | "sidebar";
  onItemClick?: () => void;
}

const RoleMenu = ({ variant = "default", onItemClick }: RoleMenuProps) => {
  const { userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  const roles = useRoles(userProfile);
  const location = useLocation();
  
  // Function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;
  
  // Sidebar styling variations
  const buttonVariant = variant === "sidebar" ? "ghost" : "ghost";
  const buttonClass = variant === "sidebar" 
    ? "justify-start w-full font-normal px-3" 
    : "";
  
  // Common click handler
  const handleClick = () => {
    if (onItemClick) onItemClick();
  };

  return (
    <div className={`flex ${variant === "sidebar" ? "flex-col w-full gap-1" : "items-center gap-1"}`}>
      {/* Dashboard - available to all authenticated users */}
      <Button 
        variant={isActive('/dashboard') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/dashboard" className="flex items-center gap-2" onClick={handleClick}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
      </Button>
      
      {/* Regular User Routes */}
      {(roles.isRegularUser() || !permissions.canReviewRequests) && (
        <>
          <Button 
            variant={isActive('/submit') ? "default" : buttonVariant} 
            className={buttonClass}
            asChild
          >
            <Link to="/submit" className="flex items-center gap-2" onClick={handleClick}>
              <FilePlus size={18} />
              <span>Submit Request</span>
            </Link>
          </Button>
          
          <Button 
            variant={isActive('/requests') ? "default" : buttonVariant} 
            className={buttonClass}
            asChild
          >
            <Link to="/requests" className="flex items-center gap-2" onClick={handleClick}>
              <ClipboardList size={18} />
              <span>My Requests</span>
            </Link>
          </Button>
        </>
      )}

      {/* Field Officer Routes */}
      {permissions.canReviewRequests && (
        <Button 
          variant={isActive('/field-work') ? "default" : buttonVariant} 
          className={buttonClass}
          asChild
        >
          <Link to="/field-work" className="flex items-center gap-2" onClick={handleClick}>
            <Clipboard size={18} />
            <span>Field Work</span>
          </Link>
        </Button>
      )}
      
      {/* Programme Manager Routes */}
      {permissions.canAccessAnalytics && (
        <Button 
          variant={isActive('/analytics') ? "default" : buttonVariant} 
          className={buttonClass}
          asChild
        >
          <Link to="/analytics" className="flex items-center gap-2" onClick={handleClick}>
            <BarChart3 size={18} />
            <span>Analytics</span>
          </Link>
        </Button>
      )}
      
      {/* Report Access Routes */}
      {permissions.canAccessFieldReports && (
        <Button 
          variant={isActive('/reports') ? "default" : buttonVariant} 
          className={buttonClass}
          asChild
        >
          <Link to="/reports" className="flex items-center gap-2" onClick={handleClick}>
            <FileSpreadsheet size={18} />
            <span>Reports</span>
          </Link>
        </Button>
      )}
      
      {/* Management Routes */}
      {permissions.canManageStaff && (
        <Button 
          variant={isActive('/staff') ? "default" : buttonVariant} 
          className={buttonClass}
          asChild
        >
          <Link to="/staff" className="flex items-center gap-2" onClick={handleClick}>
            <Users size={18} />
            <span>Staff</span>
          </Link>
        </Button>
      )}
      
      {/* Admin Routes */}
      {permissions.canAccessAdminPanel && (
        <Button 
          variant={isActive('/admin') ? "default" : buttonVariant} 
          className={buttonClass}
          asChild
        >
          <Link to="/admin" className="flex items-center gap-2" onClick={handleClick}>
            <ShieldCheck size={18} />
            <span>Admin</span>
          </Link>
        </Button>
      )}

      {/* Settings Route - available to all authenticated users */}
      <Button 
        variant={isActive('/settings') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/settings" className="flex items-center gap-2" onClick={handleClick}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </Button>
    </div>
  );
};

export default RoleMenu;
