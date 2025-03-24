
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, User, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth, UserProfile } from "@/hooks/useAuth";

interface UserProfileDropdownProps {
  userProfile: UserProfile | null;
}

const UserProfileDropdown = ({ userProfile }: UserProfileDropdownProps) => {
  const { handleLogout, formatRole } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User size={16} />
          <span className="max-w-[100px] truncate">
            {userProfile?.first_name || 'User'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{userProfile?.first_name} {userProfile?.last_name}</span>
            <span className="text-xs text-muted-foreground">{formatRole(userProfile?.role || '')}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
