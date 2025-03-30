
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const DevRoleSwitcher = () => {
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('dev_role') || 'director');
  
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
    localStorage.setItem('dev_role', role);
    setCurrentRole(role);
    
    // Reload the page to apply the new role
    window.location.reload();
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
