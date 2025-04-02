
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for roles and permissions
const roles = [
  { id: "1", name: "Admin", description: "Full system access" },
  { id: "2", name: "Project Officer", description: "Manage projects and reports" },
  { id: "3", name: "Field Officer", description: "Field work and data collection" },
  { id: "4", name: "Manager", description: "Oversee operations and approvals" },
];

const permissions = [
  { id: "1", name: "Create Reports", description: "Can create new reports" },
  { id: "2", name: "Edit Reports", description: "Can edit existing reports" },
  { id: "3", name: "Delete Reports", description: "Can delete reports" },
  { id: "4", name: "Approve Requests", description: "Can approve beneficiary requests" },
  { id: "5", name: "Manage Users", description: "Can manage user accounts" },
  { id: "6", name: "View Analytics", description: "Can view analytics data" },
];

interface RoleManagementFormProps {
  onSuccess?: (roleData: any) => void;
}

const RoleManagementForm = ({ onSuccess }: RoleManagementFormProps) => {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    "1": ["1", "2", "3", "4", "5", "6"], // Admin has all permissions
    "2": ["1", "2", "6"], // Project Officer permissions
    "3": ["1", "6"], // Field Officer permissions
    "4": ["1", "2", "4", "6"], // Manager permissions
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handlePermissionToggle = (permissionId: string) => {
    const currentPermissions = rolePermissions[selectedRole.id] || [];
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter((id) => id !== permissionId)
      : [...currentPermissions, permissionId];
    
    setRolePermissions({
      ...rolePermissions,
      [selectedRole.id]: newPermissions,
    });
  };

  const handleSavePermissions = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      if (onSuccess) {
        onSuccess({
          roleId: selectedRole.id,
          roleName: selectedRole.name,
          permissions: rolePermissions[selectedRole.id]
        });
      } else {
        toast({
          title: "Feature coming soon",
          description: "Role permission management will be available in a future update."
        });
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-full sm:w-1/3 space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <User className="h-5 w-5" />
            Roles
          </h3>
          <div className="space-y-2">
            {roles.map((role) => (
              <Card 
                key={role.id} 
                className={`cursor-pointer transition-colors ${
                  selectedRole.id === role.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    {selectedRole.id === role.id && (
                      <Badge>Selected</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-2/3 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions for {selectedRole.name}
            </h3>
            <Button 
              onClick={handleSavePermissions} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
          <Card>
            <CardContent className="p-6 space-y-6">
              {permissions.map((permission) => {
                const isChecked = rolePermissions[selectedRole.id]?.includes(permission.id) || false;
                
                return (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <Checkbox 
                      id={`permission-${permission.id}`}
                      checked={isChecked}
                      onCheckedChange={() => handlePermissionToggle(permission.id)}
                    />
                    <div className="space-y-1">
                      <label 
                        htmlFor={`permission-${permission.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {permission.name}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementForm;
