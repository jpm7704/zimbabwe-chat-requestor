
import { Link } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { 
  Home, 
  ClipboardList, 
  FileText, 
  Settings
} from "lucide-react";

interface NavLinksProps {
  isAuthenticated: boolean;
}

const NavLinks = ({ isAuthenticated }: NavLinksProps) => {
  // Only render the menu if user is authenticated
  if (!isAuthenticated) return null;
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/dashboard">
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'flex items-center gap-2')}>
                <Home className="h-4 w-4" />
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Requests
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/requests" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                      <div className="mb-2 text-lg font-medium">
                        All Requests
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        View and manage all assistance requests
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/reports" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                      <div className="mb-2 text-lg font-medium">
                        View Reports
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Access analytics and statistics
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/settings">
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'flex items-center gap-2')}>
                <Settings className="h-4 w-4" />
                Settings
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavLinks;
