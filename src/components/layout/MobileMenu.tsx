
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LogIn, 
  LogOut
} from "lucide-react";
import { useAuth, UserProfile } from "@/hooks/useAuth";
import RoleMenu from "./RoleMenu";

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
    <div className="md:hidden glass dark:glass-dark animate-fade-in p-4 mx-4 mt-2 rounded-2xl">
      <div className="flex flex-col space-y-3">
        {isAuthenticated && userProfile && (
          <div className="p-3 border border-border rounded-xl mb-2">
            <div className="font-medium">{userProfile?.first_name} {userProfile?.last_name}</div>
            <div className="text-sm text-muted-foreground">{formatRole(userProfile?.role || '')}</div>
          </div>
        )}

        {/* Use the RoleMenu component for role-based navigation */}
        {isAuthenticated && (
          <RoleMenu variant="sidebar" onItemClick={onClose} />
        )}

        <div className="pt-2 border-t border-border">
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="w-full rounded-full"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                asChild
                className="w-full justify-start rounded-full"
              >
                <Link to="/login" onClick={onClose}>
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button 
                asChild
                className="w-full rounded-full"
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
