
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import RoleMenu from "./RoleMenu";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export function AppSidebar() {
  const { userProfile, handleLogout, formatRole, loading } = useAuth();

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center h-14 px-4">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/a6e9fa53-7698-4f06-bf5e-8103cd940032.png" 
                alt="Bridging Gaps Foundation Logo" 
                className="h-12 w-auto" 
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* User Profile */}
          {userProfile && (
            <SidebarGroup>
              <SidebarGroupLabel>Profile</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-2">
                  <div className="font-medium">{userProfile.first_name} {userProfile.last_name}</div>
                  <div className="text-sm text-muted-foreground">{formatRole(userProfile.role || '')}</div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Navigation Menu */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 py-2">
                <RoleMenu variant="sidebar" />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="p-4">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
};

export default AppSidebar;
