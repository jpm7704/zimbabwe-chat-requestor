
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    setRole(newRole);
  };

  const handleLogin = () => {
    handleDevLogin(role);
  };

  return (
    <div className="fixed bottom-4 right-4 p-3 bg-slate-100 border border-slate-200 rounded-md shadow-md z-50 flex flex-col gap-2">
      <p className="text-xs font-medium text-slate-500">Development Mode</p>
      <div className="flex gap-2 items-center">
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button onClick={handleLogin} size="sm" disabled={!devSignedOut && role === selectedRole}>
          {devSignedOut ? "Login" : "Switch"}
        </Button>
      </div>
      
      {!devSignedOut && (
        <p className="text-xs text-slate-500 mt-1">Current role: <span className="font-bold">{selectedRole}</span></p>
      )}
    </div>
  );
};

export default DevRoleSwitcher;
