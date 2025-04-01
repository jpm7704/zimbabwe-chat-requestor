
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  ClipboardList, 
  FilePlus, 
  Clipboard, 
  BarChart3, 
  FileSpreadsheet, 
  Settings,
  LayoutDashboard,
  UserCheck,
  Users,
  Shield,
  Database
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface RoleMenuProps {
  variant?: "default" | "sidebar";
  onItemClick?: () => void;
}

const RoleMenu = ({ variant = "default", onItemClick }: RoleMenuProps) => {
  const { userProfile } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const buttonVariant = variant === "sidebar" ? "ghost" : "ghost";
  const buttonClass = variant === "sidebar" 
    ? "justify-start w-full font-normal px-3" 
    : "";
  
  const handleClick = () => {
    if (onItemClick) onItemClick();
  };

  return (
    <div className={`flex ${variant === "sidebar" ? "flex-col w-full gap-1" : "items-center gap-1"}`}>
      <Button 
        variant={isActive('/dashboard') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/dashboard" className="flex items-center gap-2" onClick={handleClick}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
      </Button>
      
      <Button 
        variant={isActive('/submit') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/submit" className="flex items-center gap-2" onClick={handleClick}>
          <FilePlus size={18} />
          <span>Submit Request</span>
        </Link>
      </Button>
      
      <Button 
        variant={isActive('/requests') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/requests" className="flex items-center gap-2" onClick={handleClick}>
          <ClipboardList size={18} />
          <span>My Requests</span>
        </Link>
      </Button>
      
      <Button 
        variant={isActive('/field-work') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/field-work" className="flex items-center gap-2" onClick={handleClick}>
          <Clipboard size={18} />
          <span>Field Work</span>
        </Link>
      </Button>
      
      <Button 
        variant={isActive('/analytics') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/analytics" className="flex items-center gap-2" onClick={handleClick}>
          <BarChart3 size={18} />
          <span>Analytics</span>
        </Link>
      </Button>
      
      <Button 
        variant={isActive('/reports') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/reports" className="flex items-center gap-2" onClick={handleClick}>
          <FileSpreadsheet size={18} />
          <span>Reports</span>
        </Link>
      </Button>
      
      <Button 
        variant={isActive('/approvals') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/approvals" className="flex items-center gap-2" onClick={handleClick}>
          <UserCheck size={18} />
          <span>Approvals</span>
        </Link>
      </Button>

      <Button 
        variant={isActive('/users') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/users" className="flex items-center gap-2" onClick={handleClick}>
          <Users size={18} />
          <span>Users</span>
        </Link>
      </Button>
      
      <Button 
        variant={isActive('/roles') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/roles" className="flex items-center gap-2" onClick={handleClick}>
          <Shield size={18} />
          <span>Roles</span>
        </Link>
      </Button>
      
      <Button 
        variant={isActive('/system') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/system" className="flex items-center gap-2" onClick={handleClick}>
          <Database size={18} />
          <span>System</span>
        </Link>
      </Button>

      <Button 
        variant={isActive('/settings') ? "default" : buttonVariant} 
        className={buttonClass}
        asChild
      >
        <Link to="/settings" className="flex items-center gap-2" onClick={handleClick}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </Button>
    </div>
  );
};

export default RoleMenu;
