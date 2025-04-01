
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  ClipboardList, 
  FilePlus, 
  Clipboard, 
  BarChart3, 
  FileSpreadsheet, 
  Settings,
  LayoutDashboard,
  UserCheck,
  Users,
  Shield,
  Database
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
  const { 
    isAdmin,
    isRegularUser,
    isFieldOfficer,
    isProjectOfficer,
    isAssistantProjectOfficer,
    isHeadOfPrograms,
    isDirector,
    isCEO,
    isPatron
  } = useRoles(userProfile);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const buttonVariant = variant === "sidebar" ? "ghost" : "ghost";
  const buttonClass = variant === "sidebar" 
    ? "justify-start w-full font-normal px-3" 
    : "";
  
  const handleClick = () => {
    if (onItemClick) onItemClick();
  };

  // Check if user is admin (either dev admin or regular admin)
  const isDevelopment = import.meta.env.DEV;
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  const isDevAdmin = isDevelopment && devRole === 'admin';
  const isUserAdmin = isDevAdmin || isAdmin();
  
  // Check if user has executive-level role (Director, CEO, Patron)
  const isExecutiveRole = isDirector() || isCEO() || isPatron();

  // Check if the user can access the requests page (any role except regular users)
  const canAccessRequests = permissions.canViewRequests || 
                            isFieldOfficer() || 
                            isProjectOfficer() || 
                            isAssistantProjectOfficer() || 
                            isHeadOfPrograms() || 
                            isExecutiveRole || 
                            isAdmin();

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
      
      {/* Only regular users can submit requests */}
      {isRegularUser() && (
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
      )}
      
      {/* Regular users see "My Requests", staff see "Manage Requests" */}
      <Button 
        variant={isActive('/requests') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/requests" className="flex items-center gap-2" onClick={handleClick}>
          <ClipboardList size={18} />
          <span>{isRegularUser() ? "My Requests" : "Manage Requests"}</span>
        </Link>
      </Button>
      
      {/* Field work for field officers and project officers */}
      {(isFieldOfficer() || isProjectOfficer()) && (
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
      
      {/* Analytics for executives and program managers */}
      {(isExecutiveRole || isHeadOfPrograms() || isAssistantProjectOfficer() || isAdmin()) && (
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
      
      {/* Reports for those with access */}
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
      
      {/* Approvals for executives */}
      {(isExecutiveRole || isAdmin()) && (
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

      {/* Admin sections */}
      {isUserAdmin && (
        <>
          <Button 
            variant={isActive('/users') ? "default" : buttonVariant} 
            className={buttonClass}
            asChild
          >
            <Link to="/users" className="flex items-center gap-2" onClick={handleClick}>
              <Users size={18} />
              <span>Users</span>
            </Link>
          </Button>
          
          <Button 
            variant={isActive('/roles') ? "default" : buttonVariant} 
            className={buttonClass}
            asChild
          >
            <Link to="/roles" className="flex items-center gap-2" onClick={handleClick}>
              <Shield size={18} />
              <span>Roles</span>
            </Link>
          </Button>
          
          <Button 
            variant={isActive('/system') ? "default" : buttonVariant} 
            className={buttonClass}
            asChild
          >
            <Link to="/system" className="flex items-center gap-2" onClick={handleClick}>
              <Database size={18} />
              <span>System</span>
            </Link>
          </Button>
        </>
      )}

      {/* Settings for everyone */}
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
