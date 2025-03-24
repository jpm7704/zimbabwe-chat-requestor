
import { useAuth } from "@/hooks/useAuth";
import RoleMenu from "./RoleMenu";

interface NavLinksProps {
  isAuthenticated: boolean;
}

const NavLinks = ({ isAuthenticated }: NavLinksProps) => {
  // Only render the menu if user is authenticated
  if (!isAuthenticated) return null;
  
  return (
    <div className="hidden md:flex items-center gap-1">
      <RoleMenu />
    </div>
  );
};

export default NavLinks;
