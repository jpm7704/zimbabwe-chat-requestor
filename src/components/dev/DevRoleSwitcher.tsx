
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

const DevRoleSwitcher = () => {
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('dev_role') || 'director');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const roles = [
    { value: 'user', label: 'Regular User' },
    { value: 'field_officer', label: 'Field Officer' },
    { value: 'project_officer', label: 'Project Officer' },
    { value: 'assistant_project_officer', label: 'Assistant Project Officer' },
    { value: 'head_of_programs', label: 'Head of Programs' },
    { value: 'director', label: 'Director' },
    { value: 'ceo', label: 'CEO' },
    { value: 'patron', label: 'Patron' },
    { value: 'admin', label: 'Administrator' },
  ];

  const handleRoleChange = (role: string) => {
    try {
      // Store previous role and path for comparison
      const previousRole = currentRole;
      const currentPath = location.pathname;
      
      // Set new role in localStorage
      localStorage.setItem('dev_role', role);
      setCurrentRole(role);
      
      // Dispatch a custom event for components to react to
      window.dispatchEvent(new Event('dev-role-changed'));
      
      // Show toast notification
      toast({
        title: "Role Changed",
        description: `You are now viewing the app as: ${roles.find(r => r.value === role)?.label || role}`,
      });
      
      // Determine if we should redirect based on role-specific pages
      const shouldRedirect = 
        // If switching to/from field officer and on field-work page
        ((previousRole === 'field_officer' && role !== 'field_officer' && currentPath === '/field-work') ||
        // If switching to/from approval roles and on approvals page
        ((['director', 'ceo', 'patron'].includes(previousRole) && !['director', 'ceo', 'patron'].includes(role) && currentPath === '/approvals')) ||
        // If switching to/from roles with analytics access and on analytics page
        ((['director', 'head_of_programs', 'assistant_project_officer'].includes(previousRole) && 
          !['director', 'head_of_programs', 'assistant_project_officer'].includes(role) && 
          currentPath === '/analytics')));
      
      // If we should redirect or if we're on a restricted page, go to dashboard
      if (shouldRedirect) {
        navigate('/dashboard');
      } else {
        // Force refresh the page to ensure all components update
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error("Error changing role:", error);
      toast({
        title: "Error Changing Role",
        description: "There was a problem changing your role. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Users size={16} />
            Dev Role: {currentRole}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {roles.map((role) => (
            <DropdownMenuItem
              key={role.value}
              onClick={() => handleRoleChange(role.value)}
              className={currentRole === role.value ? "bg-primary/10" : ""}
            >
              {role.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DevRoleSwitcher;
