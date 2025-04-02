import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
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
  const permissions = usePermissions(userProfile);
  const { isAdmin, isDirector } = useRoles(userProfile);
  
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

  // Only show admin-specific pages to actual admins
  const showAdminPages = isAdmin();
  
  // Only show role management to admins (not directors or other management roles)
  const showRoleManagement = isAdmin();
  
  // Only show system settings to admins
  const showSystemSettings = isAdmin();
    
  return (
    <nav className="space-y-1">
      <Link 
        to="/dashboard" 
        className={`${linkClasses} ${window.location.pathname === '/dashboard' ? activeLinkClasses : ''}`}
        onClick={handleLinkClick}
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      
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
      
      <Link 
        to="/profile" 
        className={`${linkClasses} ${window.location.pathname === '/profile' ? activeLinkClasses : ''}`}
        onClick={handleLinkClick}
      >
        <UserCog className="h-4 w-4" />
        <span>My Profile</span>
      </Link>
      
      {permissions.canAccessFieldReports && (
        <Link 
          to="/field-work" 
          className={`${linkClasses} ${window.location.pathname === '/field-work' ? activeLinkClasses : ''}`}
          onClick={handleLinkClick}
        >
          <FileText className="h-4 w-4" />
          <span>Field Work</span>
        </Link>
      )}
      
      {permissions.canAccessFieldReports && (
        <Link 
          to="/reports" 
          className={`${linkClasses} ${window.location.pathname === '/reports' ? activeLinkClasses : ''}`}
          onClick={handleLinkClick}
        >
          <FileText className="h-4 w-4" />
          <span>Reports</span>
        </Link>
      )}
      
      {permissions.canAccessAnalytics && (
        <Link 
          to="/analytics" 
          className={`${linkClasses} ${window.location.pathname === '/analytics' ? activeLinkClasses : ''}`}
          onClick={handleLinkClick}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analytics</span>
        </Link>
      )}
      
      {permissions.canApproveRequests && (
        <Link 
          to="/approvals" 
          className={`${linkClasses} ${window.location.pathname === '/approvals' ? activeLinkClasses : ''}`}
          onClick={handleLinkClick}
        >
          <UserCheck className="h-4 w-4" />
          <span>Approvals</span>
        </Link>
      )}
      
      {/* Restrict user management to admins or directors */}
      {permissions.canManageUsers && (
        <Link 
          to="/admin/users" 
          className={`${linkClasses} ${window.location.pathname === '/admin/users' ? activeLinkClasses : ''}`}
          onClick={handleLinkClick}
        >
          <Users className="h-4 w-4" />
          <span>User Management</span>
        </Link>
      )}
      
      {/* Restrict role management to admins only */}
      {showRoleManagement && (
        <Link 
          to="/admin/roles" 
          className={`${linkClasses} ${window.location.pathname === '/admin/roles' ? activeLinkClasses : ''}`}
          onClick={handleLinkClick}
        >
          <Shield className="h-4 w-4" />
          <span>Role Management</span>
        </Link>
      )}
      
      {/* Restrict system settings to admins only */}
      {showSystemSettings && (
        <Link 
          to="/admin/system" 
          className={`${linkClasses} ${window.location.pathname === '/admin/system' ? activeLinkClasses : ''}`}
          onClick={handleLinkClick}
        >
          <Settings className="h-4 w-4" />
          <span>System Settings</span>
        </Link>
      )}
      
      {/* Keep regular settings for all users */}
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
