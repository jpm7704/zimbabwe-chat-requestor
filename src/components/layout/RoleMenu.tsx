import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  ClipboardList, 
  FilePlus, 
  Clipboard, 
  BarChart3, 
  FileSpreadsheet, 
  ShieldCheck,
  Settings,
  LayoutDashboard,
  Check,
  UserCheck
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
  
  const isActive = (path: string) => location.pathname === path;
  
  const buttonVariant = variant === "sidebar" ? "ghost" : "ghost";
  const buttonClass = variant === "sidebar" 
    ? "justify-start w-full font-normal px-3" 
    : "";
  
  const handleClick = () => {
    if (onItemClick) onItemClick();
  };

  return (
    <div className={`flex ${variant === "sidebar" ? "flex-col w-full gap-1" : "items-center gap-1"}`}>
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

      {(roles.isFieldOfficer() || roles.isProjectOfficer()) && (
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
      
      {(roles.isAssistantProjectOfficer() || roles.isHeadOfPrograms() || roles.isAdmin()) && (
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
      
      {(roles.isAdmin() || roles.isCEO() || roles.isPatron()) && (
        <Button 
          variant={isActive('/approvals') ? "default" : buttonVariant} 
          className={buttonClass}
          asChild
        >
          <Link to="/approvals" className="flex items-center gap-2" onClick={handleClick}>
            <UserCheck size={18} />
            <span>Approvals</span>
          </Link>
        </Button>
      )}
      
      {(permissions.canAccessAdminPanel) && (
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
