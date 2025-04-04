
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoleSelectorProps {
  selectedRole: string | null;
  onRoleChange: (role: string) => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  // Staff roles - excluding "Regular User" as requested
  const roles = [
    { id: "field_officer", label: "Field Officer" },
    { id: "project_officer", label: "Project Officer" },
    { id: "assistant_project_officer", label: "Assistant Project Officer" },
    { id: "head_of_programs", label: "Head of Programs" },
    { id: "director", label: "Director" },
    { id: "ceo", label: "CEO" },
    { id: "patron", label: "Patron" },
    { id: "admin", label: "Administrator" }
  ];

  return (
    <div className="space-y-3">
      <Label>Select your role:</Label>
      <Select 
        value={selectedRole || ""} 
        onValueChange={onRoleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your staff role" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;
