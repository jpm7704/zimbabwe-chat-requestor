
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, Lock, Shield, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RoleManagementForm from "@/components/forms/RoleManagementForm";

// Mock role data - in a real implementation, this would come from Supabase
const mockRoles = [
  { 
    id: '1', 
    name: 'Field Officer', 
    key: 'field_officer', 
    permissions: ['view_requests', 'update_field_data', 'create_reports'],
    users: 6
  },
  { 
    id: '2', 
    name: 'Project Officer', 
    key: 'project_officer', 
    permissions: ['view_requests', 'assign_field_officers', 'approve_reports', 'view_analytics'],
    users: 12
  },
  { 
    id: '3', 
    name: 'Programme Manager', 
    key: 'programme_manager', 
    permissions: ['view_all_requests', 'approve_requests', 'manage_project_officers', 'view_analytics', 'export_data'],
    users: 3
  },
  { 
    id: '4', 
    name: 'Director', 
    key: 'director', 
    permissions: ['view_all', 'approve_all', 'manage_staff', 'system_settings', 'export_data'],
    users: 2
  }
];

const RolesManagement = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter roles based on search term
  const filteredRoles = roles.filter(role => {
    const matchesSearch = searchTerm === '' || 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.key.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleAddRole = (roleData: any) => {
    // In a real implementation, this would call Supabase to add the role
    const newRole = {
      id: Date.now().toString(),
      ...roleData,
      users: 0
    };
    setRoles([...roles, newRole]);
    setDialogOpen(false);
    toast({
      title: "Role added",
      description: `${roleData.name} has been added successfully.`
    });
  };

  const handleEditRole = (id: string) => {
    toast({
      title: "Edit role",
      description: "This functionality would edit the selected role."
    });
  };

  const handleViewPermissions = (role: any) => {
    toast({
      title: `${role.name} Permissions`,
      description: `This role has ${role.permissions.length} permissions: ${role.permissions.join(', ')}`
    });
  };

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Role Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <RoleManagementForm onSuccess={handleAddRole} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Role Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="font-medium">{role.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {role.key}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Badge variant="secondary" className="mr-1">
                          {role.permissions.length}
                        </Badge>
                        permissions
                      </div>
                    </TableCell>
                    <TableCell>{role.users} users</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewPermissions(role)}>
                        <Shield className="h-4 w-4 mr-1" />
                        Permissions
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditRole(role.id)}>
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesManagement;
