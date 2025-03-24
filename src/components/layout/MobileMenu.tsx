
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, FilePlus, Settings, LogIn, LogOut } from "lucide-react";
import { useAuth, UserProfile } from "@/hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
}

const MobileMenu = ({ isOpen, onClose, userProfile, isAuthenticated }: MobileMenuProps) => {
  const { handleLogout, formatRole } = useAuth();

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
        <Button variant="ghost" asChild className="justify-start">
          <Link to="/submit" className="flex items-center gap-2" onClick={onClose}>
            <FilePlus size={18} />
            <span>Submit Request</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link to="/requests" className="flex items-center gap-2" onClick={onClose}>
            <ClipboardList size={18} />
            <span>My Requests</span>
          </Link>
        </Button>
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
