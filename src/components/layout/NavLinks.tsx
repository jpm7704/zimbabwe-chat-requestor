
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, ClipboardList, Settings } from "lucide-react";

interface NavLinksProps {
  isAuthenticated: boolean;
}

const NavLinks = ({ isAuthenticated }: NavLinksProps) => {
  return (
    <div className="hidden md:flex items-center gap-1">
      <Button variant="ghost" asChild>
        <Link to="/chat" className="flex items-center gap-2">
          <MessageSquare size={18} />
          <span>Chat</span>
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/requests" className="flex items-center gap-2">
          <ClipboardList size={18} />
          <span>Requests</span>
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
