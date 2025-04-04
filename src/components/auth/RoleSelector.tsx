
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RoleSelectorProps {
  selectedRole: string | null;
  onRoleChange: (role: string) => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  const roles = [
    { id: "user", label: "Regular User" },
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
      <RadioGroup 
        value={selectedRole || "user"} 
        onValueChange={onRoleChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        {roles.map((role) => (
          <div key={role.id} className="flex items-center space-x-2">
            <RadioGroupItem value={role.id} id={role.id} />
            <Label htmlFor={role.id} className="cursor-pointer">{role.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RoleSelector;
