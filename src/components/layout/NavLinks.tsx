
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  FilePlus, 
  Settings, 
  Users, 
  BarChart3, 
  Clipboard, 
  FileSpreadsheet,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

interface NavLinksProps {
  isAuthenticated: boolean;
}

const NavLinks = ({ isAuthenticated }: NavLinksProps) => {
  const { userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  const location = useLocation();
  
  // Function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden md:flex items-center gap-1">
      {/* Base links for all users */}
      {(!permissions.canReviewRequests || userProfile?.role === 'user') && (
        <Button 
          variant={isActive('/submit') ? "default" : "ghost"} 
          asChild
        >
          <Link to="/submit" className="flex items-center gap-2">
            <FilePlus size={18} />
            <span>Submit Request</span>
          </Link>
        </Button>
      )}
      
      {isAuthenticated && (
        <Button 
          variant={isActive('/requests') ? "default" : "ghost"} 
          asChild
        >
          <Link to="/requests" className="flex items-center gap-2">
            <ClipboardList size={18} />
            <span>My Requests</span>
          </Link>
        </Button>
      )}

      {/* Role-specific links */}
      {permissions.canReviewRequests && (
        <Button 
          variant={isActive('/field-work') ? "default" : "ghost"} 
          asChild
        >
          <Link to="/field-work" className="flex items-center gap-2">
            <Clipboard size={18} />
            <span>Field Work</span>
          </Link>
        </Button>
      )}
      
      {permissions.canAccessAnalytics && (
        <Button 
          variant={isActive('/analytics') ? "default" : "ghost"} 
          asChild
        >
          <Link to="/analytics" className="flex items-center gap-2">
            <BarChart3 size={18} />
            <span>Analytics</span>
          </Link>
        </Button>
      )}
      
      {permissions.canAccessFieldReports && (
        <Button 
          variant={isActive('/reports') ? "default" : "ghost"} 
          asChild
        >
          <Link to="/reports" className="flex items-center gap-2">
            <FileSpreadsheet size={18} />
            <span>Reports</span>
          </Link>
        </Button>
      )}
      
      {permissions.canManageStaff && (
        <Button 
          variant={isActive('/staff') ? "default" : "ghost"} 
          asChild
        >
          <Link to="/staff" className="flex items-center gap-2">
            <Users size={18} />
            <span>Staff</span>
          </Link>
        </Button>
      )}
      
      {permissions.canAccessAdminPanel && (
        <Button 
          variant={isActive('/admin') ? "default" : "ghost"} 
          asChild
        >
          <Link to="/admin" className="flex items-center gap-2">
            <ShieldCheck size={18} />
            <span>Admin</span>
          </Link>
        </Button>
      )}

      {isAuthenticated && (
        <Button 
          variant={isActive('/settings') ? "default" : "ghost"} 
          asChild
        >
          <Link to="/settings" className="flex items-center gap-2">
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </Button>
      )}
    </div>
  );
};

export default NavLinks;
