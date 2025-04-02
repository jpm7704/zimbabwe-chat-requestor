
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import {
  BarChart3,
  ClipboardCheck,
  FileText,
  HelpCircle,
  Home,
  Settings,
  Shield,
  UserCheck,
  UserCog,
  Users
} from "lucide-react";

interface RoleMenuProps {
  variant?: "sidebar" | "mobile";
  onItemClick?: () => void;
}

const RoleMenu = ({ variant = "sidebar", onItemClick }: RoleMenuProps) => {
  const { userProfile } = useAuth();
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
  
  const linkClasses = variant === "sidebar" 
    ? "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
    : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground";
  
  const activeLinkClasses = variant === "sidebar"
    ? "bg-accent text-foreground"
    : "bg-accent text-foreground";
  
  // Helper function to handle click events on links
  const handleLinkClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <nav className="space-y-1">
      {/* Dashboard - shown to all users */}
      <Link 
        to="/dashboard" 
        className={`${linkClasses} ${window.location.pathname === '/dashboard' ? activeLinkClasses : ''}`}
        onClick={handleLinkClick}
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      
      {/* Regular User-specific links */}
      {isRegularUser() && (
        <>
          <Link 
            to="/requests" 
            className={`${linkClasses} ${window.location.pathname === '/requests' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Requests</span>
          </Link>
          
          <Link 
            to="/enquiry" 
            className={`${linkClasses} ${window.location.pathname === '/enquiry' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Enquiry</span>
          </Link>
        </>
      )}
      
      {/* Field Staff Links */}
      {(isFieldOfficer() || isProjectOfficer() || isAssistantProjectOfficer()) && (
        <>
          <Link 
            to="/requests" 
            className={`${linkClasses} ${window.location.pathname === '/requests' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Requests</span>
          </Link>
          
          <Link 
            to="/field-work" 
            className={`${linkClasses} ${window.location.pathname === '/field-work' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <FileText className="h-4 w-4" />
            <span>Field Work</span>
          </Link>
          
          <Link 
            to="/reports" 
            className={`${linkClasses} ${window.location.pathname === '/reports' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </Link>
        </>
      )}
      
      {/* Program Management Links */}
      {isHeadOfPrograms() && (
        <>
          <Link 
            to="/requests" 
            className={`${linkClasses} ${window.location.pathname === '/requests' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Requests</span>
          </Link>
          
          <Link 
            to="/reports" 
            className={`${linkClasses} ${window.location.pathname === '/reports' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </Link>
          
          <Link 
            to="/analytics" 
            className={`${linkClasses} ${window.location.pathname === '/analytics' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
        </>
      )}
      
      {/* Director, CEO, Patron Links */}
      {(isDirector() || isCEO() || isPatron()) && (
        <>
          <Link 
            to="/requests" 
            className={`${linkClasses} ${window.location.pathname === '/requests' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Requests</span>
          </Link>
          
          <Link 
            to="/approvals" 
            className={`${linkClasses} ${window.location.pathname === '/approvals' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <UserCheck className="h-4 w-4" />
            <span>Approvals</span>
          </Link>
          
          <Link 
            to="/reports" 
            className={`${linkClasses} ${window.location.pathname === '/reports' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </Link>
          
          <Link 
            to="/analytics" 
            className={`${linkClasses} ${window.location.pathname === '/analytics' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          
          {/* Only Directors and CEOs can manage users */}
          {(isDirector() || isCEO()) && (
            <Link 
              to="/admin/users" 
              className={`${linkClasses} ${window.location.pathname === '/admin/users' ? activeLinkClasses : ''}`}
              onClick={handleLinkClick}
            >
              <Users className="h-4 w-4" />
              <span>User Management</span>
            </Link>
          )}
        </>
      )}
      
      {/* Admin-only Links */}
      {isAdmin() && (
        <>
          <Link 
            to="/requests" 
            className={`${linkClasses} ${window.location.pathname === '/requests' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Requests</span>
          </Link>
          
          <Link 
            to="/admin/users" 
            className={`${linkClasses} ${window.location.pathname === '/admin/users' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </Link>
          
          <Link 
            to="/admin/roles" 
            className={`${linkClasses} ${window.location.pathname === '/admin/roles' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <Shield className="h-4 w-4" />
            <span>Role Management</span>
          </Link>
          
          <Link 
            to="/admin/system" 
            className={`${linkClasses} ${window.location.pathname === '/admin/system' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <Settings className="h-4 w-4" />
            <span>System Settings</span>
          </Link>
          
          <Link 
            to="/analytics" 
            className={`${linkClasses} ${window.location.pathname === '/analytics' ? activeLinkClasses : ''}`}
            onClick={handleLinkClick}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
        </>
      )}
      
      {/* My Profile - shown to all users */}
      <Link 
        to="/profile" 
        className={`${linkClasses} ${window.location.pathname === '/profile' ? activeLinkClasses : ''}`}
        onClick={handleLinkClick}
      >
        <UserCog className="h-4 w-4" />
        <span>My Profile</span>
      </Link>
      
      {/* Settings - shown to all users */}
      <Link 
        to="/settings" 
        className={`${linkClasses} ${window.location.pathname === '/settings' ? activeLinkClasses : ''}`}
        onClick={handleLinkClick}
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Link>
    </nav>
  );
};

export default RoleMenu;
