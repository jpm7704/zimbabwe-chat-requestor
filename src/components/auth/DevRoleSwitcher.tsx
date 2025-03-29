
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const DevRoleSwitcher = () => {
  const { handleDevLogin, devSignedOut, selectedRole } = useAuth();
  const [role, setRole] = useState(selectedRole);
  
  // Update local state when selected role changes
  useEffect(() => {
    setRole(selectedRole);
  }, [selectedRole]);
  
  const roleOptions = [
    { value: "user", label: "Regular User" },
    { value: "field_officer", label: "Field Officer" },
    { value: "project_officer", label: "Project Officer" },
    { value: "assistant_project_officer", label: "Assistant Project Officer" },
    { value: "head_of_programs", label: "Head of Programs" },
    { value: "director", label: "Director" },
    { value: "ceo", label: "CEO" },
    { value: "patron", label: "Patron" },
  ];

  const handleRoleChange = (newRole: string) => {
    console.log("Role change requested:", newRole); // Debug log
    setRole(newRole);
  };

  const handleLogin = () => {
    console.log("Login with role:", role); // Debug log
    handleDevLogin(role);
  };

  // Alternative dropdown implementation to avoid z-index issues
  return (
    <div className="fixed bottom-4 right-4 p-3 bg-slate-100 border border-slate-200 rounded-md shadow-md z-[1000] flex flex-col gap-2">
      <p className="text-xs font-medium text-slate-500">Development Mode</p>
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-[180px] justify-between">
              {roleOptions.find(option => option.value === role)?.label || "Select Role"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] bg-white">
            {roleOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => handleRoleChange(option.value)}
                className="cursor-pointer"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={handleLogin} size="sm" disabled={!devSignedOut && role === selectedRole}>
          {devSignedOut ? "Login" : "Switch"}
        </Button>
      </div>
      
      {!devSignedOut && (
        <p className="text-xs text-slate-500 mt-1">Current role: <span className="font-bold">{roleOptions.find(option => option.value === selectedRole)?.label || selectedRole}</span></p>
      )}
    </div>
  );
};

export default DevRoleSwitcher;
