
import { Link } from "react-router-dom";
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

  return (
    <div className="hidden md:flex items-center gap-1">
      {/* Base links for all users */}
      <Button variant="ghost" asChild>
        <Link to="/submit" className="flex items-center gap-2">
          <FilePlus size={18} />
          <span>Submit Request</span>
        </Link>
      </Button>
      
      {isAuthenticated && (
        <Button variant="ghost" asChild>
          <Link to="/requests" className="flex items-center gap-2">
            <ClipboardList size={18} />
            <span>My Requests</span>
          </Link>
        </Button>
      )}

      {/* Role-specific links */}
      {permissions.canReviewRequests && (
        <Button variant="ghost" asChild>
          <Link to="/field-work" className="flex items-center gap-2">
            <Clipboard size={18} />
            <span>Field Work</span>
          </Link>
        </Button>
      )}
      
      {permissions.canAccessAnalytics && (
        <Button variant="ghost" asChild>
          <Link to="/analytics" className="flex items-center gap-2">
            <BarChart3 size={18} />
            <span>Analytics</span>
          </Link>
        </Button>
      )}
      
      {permissions.canAccessFieldReports && (
        <Button variant="ghost" asChild>
          <Link to="/reports" className="flex items-center gap-2">
            <FileSpreadsheet size={18} />
            <span>Reports</span>
          </Link>
        </Button>
      )}
      
      {permissions.canManageStaff && (
        <Button variant="ghost" asChild>
          <Link to="/staff" className="flex items-center gap-2">
            <Users size={18} />
            <span>Staff</span>
          </Link>
        </Button>
      )}
      
      {permissions.canAccessAdminPanel && (
        <Button variant="ghost" asChild>
          <Link to="/admin" className="flex items-center gap-2">
            <ShieldCheck size={18} />
            <span>Admin</span>
          </Link>
        </Button>
      )}

      {isAuthenticated && (
        <Button variant="ghost" asChild>
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
