
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, UserPlus } from "lucide-react";

const StaffManagement = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();

  // Redirect if user doesn't have permission to view this page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!permissions.canManageStaff) {
      navigate('/');
    }
  }, [isAuthenticated, permissions, navigate]);

  // Sample staff data
  const staffMembers = [
    {
      id: "USR-001",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Field Officer",
      region: "Harare",
      status: "Active"
    },
    {
      id: "USR-002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Programme Manager",
      region: "Bulawayo",
      status: "Active"
    },
    {
      id: "USR-003",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Field Officer",
      region: "Mutare",
      status: "Active"
    },
    {
      id: "USR-004",
      name: "Alice Williams",
      email: "alice.williams@example.com",
      role: "Field Officer",
      region: "Gweru",
      status: "Active"
    },
    {
      id: "USR-005",
      name: "David Chen",
      email: "david.chen@example.com",
      role: "Programme Manager",
      region: "Masvingo",
      status: "On Leave"
    }
  ];

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage staff accounts and permissions
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
            <CardDescription>Overview of all staff members</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.id}</TableCell>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.region}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        staff.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {staff.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
              <CardDescription>Current staff role distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Field Officers</span>
                  <span className="font-bold">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Programme Managers</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Management</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Administrative Staff</span>
                  <span className="font-bold">7</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center font-bold">
                  <span>Total Staff</span>
                  <span>33</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff Actions</CardTitle>
              <CardDescription>Manage staff roles and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create New Role
              </Button>
              <Button className="w-full" variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Manage Permissions
              </Button>
              <Button className="w-full" variant="outline">
                Generate Staff Directory Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
