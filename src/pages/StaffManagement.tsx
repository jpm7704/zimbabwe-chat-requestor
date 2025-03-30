
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, UserPlus, Shield, ShieldCheck, AlertTriangle, InfoIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const StaffManagement = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const permissions = usePermissions(userProfile);
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'policy' | 'fetch' | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

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

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);
        
        // First check if the table exists and is accessible
        const { error: checkError } = await supabase
          .from('user_profiles')
          .select('count')
          .limit(1);
        
        if (checkError) {
          console.error("Error accessing user_profiles table:", checkError);
          
          // Check for specific types of errors
          if (checkError.message?.includes('infinite recursion') || 
              checkError.code === '42P17') { // Infinite recursion in policy
            setErrorType('policy');
            setError("Database policy error detected. The Row Level Security (RLS) policies on the user_profiles table need to be fixed.");
            setUsers([]);
            return;
          }
        }
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('role', { ascending: false });
        
        if (error) {
          setErrorType('fetch');
          throw error;
        }
        
        setUsers(data || []);
        
        // If we successfully queried but got no users, set a specific message
        if (!data || data.length === 0) {
          setError("No users found in the system. You can add staff members to get started.");
        }
        
      } catch (error: any) {
        console.error("Error fetching users:", error);
        setErrorType('fetch');
        setError(error.message || "Failed to load user data. Please check the database connection and policies.");
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (permissions.canManageStaff) {
      fetchUsers();
    }
  }, [permissions.canManageStaff]);

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Role updated",
        description: `User ${selectedUser.first_name || selectedUser.name || ''} ${selectedUser.last_name || ''}'s role has been updated to ${newRole}`,
      });
      
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const openRoleDialog = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setDialogOpen(true);
  };

  // Format role for display
  const formatRole = (role: string) => {
    if (!role) return '';
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'field_officer':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'project_officer':
      case 'assistant_project_officer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'head_of_programs':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'director':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'ceo':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'patron':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Render empty state when no users are found
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No staff members found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        There are currently no users in the system. Add your first staff member to get started.
      </p>
      <Button>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Staff Member
      </Button>
    </div>
  );

  // Render policy error state
  const renderPolicyErrorState = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Database Policy Error</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>{error}</p>
        <div className="bg-muted p-4 rounded-md text-sm">
          <p className="font-medium mb-2">Possible Solution:</p>
          <p>This error occurs when a Row Level Security (RLS) policy creates an infinite recursion by referencing the same table it's protecting.</p>
          <p className="mt-2">To fix this issue:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Create a security definer function that safely queries the user_profiles table</li>
            <li>Update the RLS policy to use this function instead of directly querying the table</li>
          </ol>
        </div>
      </AlertDescription>
    </Alert>
  );

  // Render generic error state
  const renderErrorState = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
  );
  
  // Render development mode notice
  const renderDevModeNotice = () => {
    const isDevelopment = import.meta.env.DEV;
    if (!isDevelopment) return null;
    
    return (
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Development Mode</AlertTitle>
        <AlertDescription>
          You're currently in development mode. All permissions are granted regardless of user role.
        </AlertDescription>
      </Alert>
    );
  };

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

        {renderDevModeNotice()}
        {errorType === 'policy' ? renderPolicyErrorState() : error ? renderErrorState() : null}

        <Card>
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading user data...</div>
            ) : users.length === 0 ? (
              renderEmptyState()
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.first_name || user.name || ''} {user.last_name || ''}
                      </TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                          {formatRole(user.role)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openRoleDialog(user)}
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Role distribution card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
              <CardDescription>Current staff role distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No staff members to display
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Field Officers</span>
                    <span className="font-bold">{users.filter(u => u.role === 'field_officer').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Project Officers</span>
                    <span className="font-bold">{users.filter(u => u.role === 'project_officer').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Assistant Project Officers</span>
                    <span className="font-bold">{users.filter(u => u.role === 'assistant_project_officer').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Head of Programs</span>
                    <span className="font-bold">{users.filter(u => u.role === 'head_of_programs').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Directors</span>
                    <span className="font-bold">{users.filter(u => u.role === 'director').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CEOs</span>
                    <span className="font-bold">{users.filter(u => u.role === 'ceo').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Patrons</span>
                    <span className="font-bold">{users.filter(u => u.role === 'patron').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Regular Users</span>
                    <span className="font-bold">{users.filter(u => u.role === 'user').length}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center font-bold">
                    <span>Total Users</span>
                    <span>{users.length}</span>
                  </div>
                </div>
              )}
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

      {/* Change Role Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.first_name || selectedUser?.name || ''} {selectedUser?.last_name || ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Role</label>
              <div className={`px-3 py-2 rounded-md text-sm ${getRoleBadgeColor(selectedUser?.role || 'user')}`}>
                {formatRole(selectedUser?.role || 'user')}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">New Role</label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Regular User</SelectItem>
                  <SelectItem value="field_officer">Field Officer</SelectItem>
                  <SelectItem value="project_officer">Project Officer</SelectItem>
                  <SelectItem value="assistant_project_officer">Assistant Project Officer</SelectItem>
                  <SelectItem value="head_of_programs">Head of Programs</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="ceo">CEO</SelectItem>
                  <SelectItem value="patron">Patron</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Role Permissions</label>
              <div className="text-sm text-muted-foreground">
                {newRole === 'field_officer' && "Field officers can verify requests and submit assessment reports."}
                {newRole === 'project_officer' && "Project officers can review, assign and approve requests, and access analytics."}
                {newRole === 'assistant_project_officer' && "Assistant project officers coordinate with field staff and prepare reports for management."}
                {newRole === 'head_of_programs' && "Head of programs can review, assign and coordinate program implementation across regions."}
                {newRole === 'director' && "Directors can access all features including staff management and admin panel."}
                {newRole === 'ceo' && "CEOs have executive approval authority and can access all features."}
                {newRole === 'patron' && "Patrons have final endorsement authority and can access all features including admin panel."}
                {newRole === 'user' && "Regular users can submit and track their requests."}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRoleChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
