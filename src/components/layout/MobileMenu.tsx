
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  FilePlus, 
  Settings, 
  LogIn, 
  LogOut, 
  Users, 
  BarChart3, 
  Clipboard, 
  FileSpreadsheet,
  ShieldCheck
} from "lucide-react";
import { useAuth, UserProfile } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
}

const MobileMenu = ({ isOpen, onClose, userProfile, isAuthenticated }: MobileMenuProps) => {
  const { handleLogout, formatRole } = useAuth();
  const permissions = usePermissions(userProfile);

  if (!isOpen) return null;

  return (
    <div className="md:hidden glass dark:glass-dark animate-fade-in p-4">
      <div className="flex flex-col space-y-3">
        {isAuthenticated && userProfile && (
          <div className="p-3 border border-border rounded-md mb-2">
            <div className="font-medium">{userProfile?.first_name} {userProfile?.last_name}</div>
            <div className="text-sm text-muted-foreground">{formatRole(userProfile?.role || '')}</div>
          </div>
        )}

        {/* Base links for all users */}
        <Button variant="ghost" asChild className="justify-start">
          <Link to="/submit" className="flex items-center gap-2" onClick={onClose}>
            <FilePlus size={18} />
            <span>Submit Request</span>
          </Link>
        </Button>
        
        {isAuthenticated && (
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/requests" className="flex items-center gap-2" onClick={onClose}>
              <ClipboardList size={18} />
              <span>My Requests</span>
            </Link>
          </Button>
        )}

        {/* Role-specific links */}
        {permissions.canReviewRequests && (
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/field-work" className="flex items-center gap-2" onClick={onClose}>
              <Clipboard size={18} />
              <span>Field Work</span>
            </Link>
          </Button>
        )}
        
        {permissions.canAccessAnalytics && (
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/analytics" className="flex items-center gap-2" onClick={onClose}>
              <BarChart3 size={18} />
              <span>Analytics</span>
            </Link>
          </Button>
        )}
        
        {permissions.canAccessFieldReports && (
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/reports" className="flex items-center gap-2" onClick={onClose}>
              <FileSpreadsheet size={18} />
              <span>Reports</span>
            </Link>
          </Button>
        )}
        
        {permissions.canManageStaff && (
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/staff" className="flex items-center gap-2" onClick={onClose}>
              <Users size={18} />
              <span>Staff</span>
            </Link>
          </Button>
        )}
        
        {permissions.canAccessAdminPanel && (
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/admin" className="flex items-center gap-2" onClick={onClose}>
              <ShieldCheck size={18} />
              <span>Admin</span>
            </Link>
          </Button>
        )}

        {isAuthenticated && (
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/settings" className="flex items-center gap-2" onClick={onClose}>
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </Button>
        )}

        <div className="pt-2 border-t border-border">
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="w-full"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                asChild
                className="w-full justify-start"
              >
                <Link to="/login" onClick={onClose}>
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button 
                asChild
                className="w-full"
              >
                <Link to="/register" onClick={onClose}>
                  Register
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
