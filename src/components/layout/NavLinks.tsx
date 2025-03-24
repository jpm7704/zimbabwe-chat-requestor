
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, FilePlus, Settings } from "lucide-react";

interface NavLinksProps {
  isAuthenticated: boolean;
}

const NavLinks = ({ isAuthenticated }: NavLinksProps) => {
  return (
    <div className="hidden md:flex items-center gap-1">
      <Button variant="ghost" asChild>
        <Link to="/submit" className="flex items-center gap-2">
          <FilePlus size={18} />
          <span>Submit Request</span>
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/requests" className="flex items-center gap-2">
          <ClipboardList size={18} />
          <span>My Requests</span>
        </Link>
      </Button>
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
