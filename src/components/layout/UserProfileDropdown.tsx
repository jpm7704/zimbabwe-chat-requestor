import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, User, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth, UserProfile } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface UserProfileDropdownProps {
  userProfile: UserProfile | null;
}

const UserProfileDropdown = ({ userProfile }: UserProfileDropdownProps) => {
  const { handleLogout, formatRole } = useAuth();
  const navigate = useNavigate();
  
  // Function to get role badge color
  const getRoleBadgeColor = (role?: string) => {
    switch(role) {
      case 'field_officer':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'regional_project_officer':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'assistant_project_officer':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'head_of_programs':
        return 'bg-green-500 hover:bg-green-600';
      case 'director':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'ceo':
        return 'bg-red-500 hover:bg-red-600';
      case 'patron':
        return 'bg-indigo-500 hover:bg-indigo-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleSignOut = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User size={16} />
          <span className="max-w-[100px] truncate">
            {userProfile?.first_name || 'User'}
          </span>
          {userProfile?.role && (
            <Badge className={`text-white ${getRoleBadgeColor(userProfile.role)}`}>
              {formatRole(userProfile.role).split(' ')[0]}
            </Badge>
          )}
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
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
