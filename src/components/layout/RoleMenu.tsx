
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import {
  BarChart3,
  ClipboardCheck,
  FileText,
  HelpCircle,
  Home,
  Settings,
  UserCheck,
  Users
} from "lucide-react";

interface RoleMenuProps {
  variant?: "sidebar" | "mobile";
}

const RoleMenu = ({ variant = "sidebar" }: RoleMenuProps) => {
  const { userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  
  const linkClasses = variant === "sidebar" 
    ? "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
    : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground";
  
  const activeLinkClasses = variant === "sidebar"
    ? "bg-accent text-foreground"
    : "bg-accent text-foreground";
    
  return (
    <nav className="space-y-1">
      <Link to="/dashboard" className={`${linkClasses} ${window.location.pathname === '/dashboard' ? activeLinkClasses : ''}`}>
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      
      <Link to="/requests" className={`${linkClasses} ${window.location.pathname === '/requests' ? activeLinkClasses : ''}`}>
        <ClipboardCheck className="h-4 w-4" />
        <span>Requests</span>
      </Link>
      
      <Link to="/enquiry" className={`${linkClasses} ${window.location.pathname === '/enquiry' ? activeLinkClasses : ''}`}>
        <HelpCircle className="h-4 w-4" />
        <span>Enquiry</span>
      </Link>
      
      {permissions.canAccessFieldReports && (
        <Link to="/field-work" className={`${linkClasses} ${window.location.pathname === '/field-work' ? activeLinkClasses : ''}`}>
          <FileText className="h-4 w-4" />
          <span>Field Work</span>
        </Link>
      )}
      
      {permissions.canAccessFieldReports && (
        <Link to="/reports" className={`${linkClasses} ${window.location.pathname === '/reports' ? activeLinkClasses : ''}`}>
          <FileText className="h-4 w-4" />
          <span>Reports</span>
        </Link>
      )}
      
      {permissions.canAccessAnalytics && (
        <Link to="/analytics" className={`${linkClasses} ${window.location.pathname === '/analytics' ? activeLinkClasses : ''}`}>
          <BarChart3 className="h-4 w-4" />
          <span>Analytics</span>
        </Link>
      )}
      
      {permissions.canApproveRequests && (
        <Link to="/approvals" className={`${linkClasses} ${window.location.pathname === '/approvals' ? activeLinkClasses : ''}`}>
          <UserCheck className="h-4 w-4" />
          <span>Approvals</span>
        </Link>
      )}
      
      {permissions.canManageStaff && (
        <Link to="/admin/users" className={`${linkClasses} ${window.location.pathname === '/admin/users' ? activeLinkClasses : ''}`}>
          <Users className="h-4 w-4" />
          <span>User Management</span>
        </Link>
      )}
      
      <Link to="/settings" className={`${linkClasses} ${window.location.pathname === '/settings' ? activeLinkClasses : ''}`}>
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Link>
    </nav>
  );
};

export default RoleMenu;
