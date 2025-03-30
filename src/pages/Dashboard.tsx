
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import RoleBasedWorkflow from "@/components/requests/RoleBasedWorkflow";
import { useRequestsData } from "@/hooks/useRequestsData";
import { useToast } from "@/hooks/use-toast";
import { useRoles } from "@/hooks/useRoles";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Bookmark, Calendar, Clock, FileCheck2, FileQuestion, PieChart, 
  Users, TrendingUp, Building, Settings, Database, Shield, Server, 
  AlertCircle, Check, RefreshCw, FileText, Key, Lock, Bell
} from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Dashboard = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();
  const permissions = usePermissions(userProfile);
  const roles = useRoles(userProfile);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { filteredRequests } = useRequestsData();
  
  const isDevelopment = import.meta.env.DEV;
  const devRole = isDevelopment ? localStorage.getItem('dev_role') : null;
  const isDevAdmin = isDevelopment && devRole === 'admin';
  
  const isAdmin = isDevAdmin || roles.isAdmin();

  // State for dialogs and functionality
  const [showSystemDialog, setShowSystemDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [systemStatus, setSystemStatus] = useState("operational");
  const [lastBackup, setLastBackup] = useState("Today");
  const [currentTab, setCurrentTab] = useState("overview");

  // State for system settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loggingLevel, setLoggingLevel] = useState("info");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  
  // Detailed settings states for each module
  const [systemSettings, setSystemSettings] = useState({
    applicationName: "Beneficiary Processing System",
    defaultLanguage: "English",
    timezone: "UTC+2",
    maintenanceMode: false,
    debugMode: false,
    loggingLevel: "info",
    maxUploadSize: "10MB",
    sessionTimeout: 30,
  });
  
  const [databaseSettings, setDatabaseSettings] = useState({
    backupFrequency: "daily",
    retentionPeriod: "30 days",
    compressionLevel: "medium",
    encryptBackups: true,
    lastBackupSize: "156MB",
    autoCleanup: true,
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: "strong",
    mfaEnabled: true,
    sessionLength: 24,
    ipRestrictions: false,
    failedLoginAttempts: 5,
    autoLockout: true,
  });
  
  const [apiSettings, setApiSettings] = useState({
    rateLimit: 100,
    tokenExpiry: "7 days",
    logRequests: true,
    corsEnabled: true,
    activeIntegrations: 4,
  });
  
  const [userManagement, setUserManagement] = useState({
    totalUsers: 856,
    activeUsers: 743,
    pendingApprovals: 12,
    lockedAccounts: 5,
    newUsers: 24,
  });
  
  const [roleManagement, setRoleManagement] = useState({
    availableRoles: ["User", "Field Officer", "Project Officer", "Assistant Project Officer", 
                     "Head of Programs", "Director", "CEO", "Patron", "Admin"],
    customPermissions: true,
    hierarchyEnforcement: true,
  });
  
  const [staffDirectory, setStaffDirectory] = useState({
    totalStaff: 33,
    departments: ["Field Operations", "Project Management", "Administration", "Executive", "IT"],
    locationFiltering: true,
    exportFormat: "CSV",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate, toast]);

  const systemActivityData = [
    { day: "Mon", requests: 35, users: 20 },
    { day: "Tue", requests: 42, users: 25 },
    { day: "Wed", requests: 58, users: 30 },
    { day: "Thu", requests: 45, users: 28 },
    { day: "Fri", requests: 50, users: 32 },
    { day: "Sat", requests: 38, users: 15 },
    { day: "Sun", requests: 30, users: 12 },
  ];

  const getStatusCounts = () => {
    const counts = {
      pending: filteredRequests.filter(r => r.status === 'submitted').length,
      underReview: filteredRequests.filter(r => ['assigned', 'under_review'].includes(r.status)).length,
      awaitingApproval: filteredRequests.filter(r => r.status === 'manager_review').length,
      completed: filteredRequests.filter(r => ['completed', 'forwarded'].includes(r.status)).length,
      rejected: filteredRequests.filter(r => r.status === 'rejected').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalRequests = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  // Handle system actions
  const handleSystemAction = (action: string) => {
    setSelectedAction(action);
    setCurrentTab("overview");
    setShowSystemDialog(true);
  };

  // Handle user management actions
  const handleUserAction = (action: string) => {
    setSelectedAction(action);
    setCurrentTab("overview");
    setShowUserDialog(true);
  };

  // Complete an action
  const completeAction = () => {
    // Simulate action execution
    toast({
      title: "Action completed",
      description: `${selectedAction} was successfully executed`,
    });
    
    // Update system status based on action
    if (selectedAction === "Database Management") {
      setLastBackup("Just now");
      toast({
        title: "Database backup created",
        description: "A new backup has been created and stored securely.",
      });
    } else if (selectedAction === "System Settings") {
      toast({
        title: "System settings updated",
        description: "Your configuration changes have been saved.",
      });
      
      // Apply maintenance mode if it was set
      if (systemSettings.maintenanceMode) {
        setSystemStatus("maintenance");
        toast({
          title: "Maintenance mode activated",
          description: "The system is now in maintenance mode. Some features may be limited.",
        });
      } else if (systemStatus === "maintenance") {
        setSystemStatus("operational");
        toast({
          title: "Maintenance mode deactivated",
          description: "The system is now fully operational.",
        });
      }
    } else if (selectedAction === "Security Settings") {
      toast({
        title: "Security audit completed",
        description: "Security settings have been updated and an audit log has been created.",
      });
    } else if (selectedAction === "API Configuration") {
      toast({
        title: "API configuration updated",
        description: "API settings have been successfully updated.",
      });
    } else if (selectedAction === "User Management") {
      toast({
        title: "User management",
        description: "User management actions have been processed.",
      });
    } else if (selectedAction === "Role Management") {
      toast({
        title: "Role configuration updated",
        description: "Role settings have been successfully updated.",
      });
    } else if (selectedAction === "Staff Directory") {
      toast({
        title: "Staff directory accessed",
        description: "Staff directory information has been processed.",
      });
    } else if (selectedAction === "Permission Settings") {
      toast({
        title: "Permissions updated",
        description: "Permission settings have been updated successfully.",
      });
    }
    
    // Close dialogs
    setShowSystemDialog(false);
    setShowUserDialog(false);
  };

  const performSystemRestart = () => {
    setShowRestartDialog(false);
    
    // Show loading toast
    toast({
      title: "System restarting",
      description: "Please wait while the system restarts...",
    });
    
    // Simulate restart
    setTimeout(() => {
      setSystemStatus("operational");
      toast({
        title: "System restarted",
        description: "The system has been successfully restarted.",
      });
    }, 3000);
  };
  
  // Saving settings from the tabs
  const saveSystemSettingsTab = () => {
    toast({
      title: "System settings saved",
      description: "Your configuration changes have been applied successfully.",
    });
    
    if (systemSettings.maintenanceMode) {
      setSystemStatus("maintenance");
    } else {
      setSystemStatus("operational");
    }
  };
  
  const saveDatabaseSettingsTab = () => {
    setLastBackup("Just now");
    toast({
      title: "Database settings saved",
      description: "Database configuration has been updated successfully.",
    });
  };
  
  const saveSecuritySettingsTab = () => {
    toast({
      title: "Security settings saved",
      description: "Security configuration has been updated successfully.",
    });
  };
  
  const saveApiSettingsTab = () => {
    toast({
      title: "API settings saved",
      description: "API configuration has been updated successfully.",
    });
  };
  
  const saveUserManagementTab = () => {
    toast({
      title: "User management saved",
      description: "User management changes have been applied successfully.",
    });
  };
  
  const saveRoleManagementTab = () => {
    toast({
      title: "Role management saved",
      description: "Role configuration has been updated successfully.",
    });
  };
  
  const saveStaffDirectoryTab = () => {
    toast({
      title: "Staff directory saved",
      description: "Staff directory changes have been applied successfully.",
    });
  };
  
  const savePermissionSettingsTab = () => {
    toast({
      title: "Permission settings saved",
      description: "Permission configuration has been updated successfully.",
    });
  };

  const renderAdminContent = () => {
    if (!isAdmin) return null;
    
    return (
      <>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">System Administration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Registered accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">856</div>
                <p className="text-sm text-muted-foreground">+24 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Staff Users</CardTitle>
                <CardDescription>Internal accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">33</div>
                <p className="text-sm text-muted-foreground">+2 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className={`text-xl font-bold ${systemStatus === "operational" ? "text-green-600" : "text-yellow-600"}`}>
                    {systemStatus === "operational" ? "All Systems Operational" : "Maintenance Mode"}
                  </div>
                  <Badge 
                    variant={systemStatus === "operational" ? "default" : "outline"} 
                    className={systemStatus === "operational" ? "bg-green-500 hover:bg-green-600" : "border-yellow-500 text-yellow-500"}
                  >
                    {systemStatus === "operational" ? "LIVE" : "MAINTENANCE"}
                  </Badge>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-muted-foreground">99.98% uptime</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowRestartDialog(true)}
                    className="text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" /> Restart
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Database Size</CardTitle>
                <CardDescription>Total storage used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">1.2GB</div>
                <div className="mt-2">
                  <Progress value={65} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">65% of allocated space</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>7-day request and user activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={systemActivityData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#8884d8" activeDot={{ r: 8 }} name="Requests" />
                    <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Active Users" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Administration</CardTitle>
                <CardDescription>Manage system configuration and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full flex justify-between items-center" 
                  variant="outline"
                  onClick={() => handleSystemAction("System Settings")}
                >
                  <div className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>System Settings</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Last updated: 2 days ago</span>
                </Button>
                <Button 
                  className="w-full flex justify-between items-center" 
                  variant="outline"
                  onClick={() => handleSystemAction("Database Management")}
                >
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>Database Management</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Last backup: {lastBackup}</span>
                </Button>
                <Button 
                  className="w-full flex justify-between items-center" 
                  variant="outline"
                  onClick={() => handleSystemAction("Security Settings")}
                >
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Security Settings</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Last audit: 5 days ago</span>
                </Button>
                <Button 
                  className="w-full flex justify-between items-center" 
                  variant="outline"
                  onClick={() => handleSystemAction("API Configuration")}
                >
                  <div className="flex items-center">
                    <Server className="mr-2 h-4 w-4" />
                    <span>API Configuration</span>
                  </div>
                  <span className="text-xs text-muted-foreground">4 active integrations</span>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Administration</CardTitle>
                <CardDescription>Manage users and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full flex justify-between items-center" 
                  variant="outline"
                  onClick={() => handleUserAction("User Management")}
                >
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>User Management</span>
                  </div>
                  <span className="text-xs text-muted-foreground">856 total users</span>
                </Button>
                <Button 
                  className="w-full flex justify-between items-center" 
                  variant="outline"
                  onClick={() => handleUserAction("Role Management")}
                >
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Role Management</span>
                  </div>
                  <span className="text-xs text-muted-foreground">5 roles configured</span>
                </Button>
                <Button 
                  className="w-full flex justify-between items-center" 
                  variant="outline"
                  onClick={() => handleUserAction("Staff Directory")}
                >
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Staff Directory</span>
                  </div>
                  <span className="text-xs text-muted-foreground">33 staff members</span>
                </Button>
                <Button 
                  className="w-full flex justify-between items-center" 
                  variant="outline"
                  onClick={() => handleUserAction("Permission Settings")}
                >
                  <div className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Permission Settings</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Last modified: Yesterday</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Action Dialog */}
        <Dialog open={showSystemDialog} onOpenChange={setShowSystemDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedAction}</DialogTitle>
              <DialogDescription>
                {selectedAction === "System Settings" && "Configure core system settings and preferences."}
                {selectedAction === "Database Management" && "Manage database operations, backups, and maintenance."}
                {selectedAction === "Security Settings" && "Configure security policies, access controls, and audit settings."}
                {selectedAction === "API Configuration" && "Manage API endpoints, keys, and integration settings."}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              
              {/* System Settings Content */}
              {selectedAction === "System Settings" && (
                <>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Application Settings</h3>
                        <p className="text-sm text-muted-foreground">Core configuration for the application.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Maintenance Mode:</span>
                          <span className="font-medium">{systemSettings.maintenanceMode ? "Enabled" : "Disabled"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Logging Level:</span>
                          <span className="font-medium capitalize">{systemSettings.loggingLevel}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Session Timeout:</span>
                          <span className="font-medium">{systemSettings.sessionTimeout} minutes</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">System Health</h3>
                        <p className="text-sm text-muted-foreground">Current system status and performance.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Status:</span>
                          <span className={`font-medium ${systemStatus === "operational" ? "text-green-600" : "text-yellow-600"}`}>
                            {systemStatus === "operational" ? "Operational" : "Maintenance Mode"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Memory Usage:</span>
                          <span className="font-medium">42%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>CPU Load:</span>
                          <span className="font-medium">23%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium">Recent Changes</h3>
                      <p className="text-sm text-muted-foreground mb-2">Latest system configuration changes.</p>
                      <div className="text-sm space-y-2">
                        <div className="flex items-start gap-2 p-2 rounded bg-muted/50">
                          <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Logging level updated to 'info'</p>
                            <p className="text-xs text-muted-foreground">Yesterday at 3:42 PM by Admin</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-2 rounded bg-muted/50">
                          <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Email notifications enabled</p>
                            <p className="text-xs text-muted-foreground">3 days ago at 11:15 AM by System</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="appName">Application Name</Label>
                          <Input id="appName" 
                            value={systemSettings.applicationName} 
                            onChange={(e) => setSystemSettings({...systemSettings, applicationName: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="language">Default Language</Label>
                          <Input id="language" 
                            value={systemSettings.defaultLanguage} 
                            onChange={(e) => setSystemSettings({...systemSettings, defaultLanguage: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Input id="timezone" 
                            value={systemSettings.timezone} 
                            onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="maxUpload">Maximum Upload Size</Label>
                          <Input id="maxUpload" 
                            value={systemSettings.maxUploadSize} 
                            onChange={(e) => setSystemSettings({...systemSettings, maxUploadSize: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Input id="sessionTimeout" 
                            type="number"
                            value={systemSettings.sessionTimeout.toString()} 
                            onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="loggingLevel">Logging Level</Label>
                          <select 
                            id="loggingLevel"
                            value={systemSettings.loggingLevel}
                            onChange={(e) => setSystemSettings({...systemSettings, loggingLevel: e.target.value})}
                            className="w-full p-2 border rounded"
                          >
                            <option value="debug">Debug</option>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="maintenance">Maintenance Mode</Label>
                            <p className="text-sm text-muted-foreground">Restrict access to administrative users only</p>
                          </div>
                          <input
                            type="checkbox"
                            id="maintenance"
                            checked={systemSettings.maintenanceMode}
                            onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="debug">Debug Mode</Label>
                            <p className="text-sm text-muted-foreground">Enable detailed error messages and logging</p>
                          </div>
                          <input
                            type="checkbox"
                            id="debug"
                            checked={systemSettings.debugMode}
                            onChange={(e) => setSystemSettings({...systemSettings, debugMode: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button onClick={saveSystemSettingsTab}>Save Settings</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">System Cache</CardTitle>
                          <CardDescription>Clear system caches to refresh data</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Cache cleared",
                              description: "System cache has been successfully cleared.",
                            });
                          }}>
                            Clear Cache
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Temporary Files</CardTitle>
                          <CardDescription>Clean up temporary uploaded files</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Temporary files cleaned",
                              description: "Temporary files have been successfully removed.",
                            });
                          }}>
                            Clean Files
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Configuration Export</CardTitle>
                          <CardDescription>Export all system settings as JSON</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Configuration exported",
                              description: "System configuration has been exported to file.",
                            });
                          }}>
                            Export Config
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">System Report</CardTitle>
                          <CardDescription>Generate diagnostic report for support</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Report generated",
                              description: "System diagnostic report has been created.",
                            });
                          }}>
                            Generate Report
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="border rounded p-4 mt-4">
                      <h3 className="text-sm font-medium">Danger Zone</h3>
                      <p className="text-xs text-muted-foreground mb-3">These actions can cause service disruption.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="destructive" className="w-full" onClick={() => setShowRestartDialog(true)}>
                          Restart System
                        </Button>
                        <Button variant="destructive" className="w-full" onClick={() => {
                          toast({
                            title: "Reset settings",
                            description: "All system settings have been reset to defaults.",
                            variant: "destructive",
                          });
                        }}>
                          Reset All Settings
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logs" className="h-[300px] overflow-y-auto border rounded p-4">
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-green-600">[2023-07-15 08:12:03] [INFO] System settings updated by admin@example.com</p>
                      <p className="text-green-600">[2023-07-15 08:10:22] [INFO] Application started successfully</p>
                      <p className="text-yellow-600">[2023-07-15 08:05:43] [WARNING] High memory usage detected (78%)</p>
                      <p className="text-green-600">[2023-07-14 17:43:12] [INFO] Database backup completed successfully</p>
                      <p className="text-green-600">[2023-07-14 16:30:05] [INFO] Email notifications enabled by admin@example.com</p>
                      <p className="text-red-600">[2023-07-14 15:22:18] [ERROR] Failed to connect to external API service</p>
                      <p className="text-yellow-600">[2023-07-14 14:11:33] [WARNING] Rate limit threshold reached for API requests</p>
                      <p className="text-green-600">[2023-07-14 12:05:10] [INFO] New user registration: user@example.com</p>
                      <p className="text-green-600">[2023-07-14 11:30:22] [INFO] System configuration exported by admin@example.com</p>
                      <p className="text-green-600">[2023-07-14 10:15:48] [INFO] Cache cleared by admin@example.com</p>
                      <p className="text-red-600">[2023-07-14 09:42:11] [ERROR] Database query timed out after 30 seconds</p>
                      <p className="text-green-600">[2023-07-14 09:30:05] [INFO] Scheduled task completed: data aggregation</p>
                      <p className="text-green-600">[2023-07-14 09:00:00] [INFO] Daily system health check: All systems operational</p>
                      <p className="text-yellow-600">[2023-07-14 08:45:22] [WARNING] Disk usage above 70% threshold</p>
                      <p className="text-green-600">[2023-07-14 08:30:14] [INFO] User role updated: staff@example.com to Field Officer</p>
                    </div>
                  </TabsContent>
                </>
              )}
              
              {/* Database Management Content */}
              {selectedAction === "Database Management" && (
                <>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Database Information</h3>
                        <p className="text-sm text-muted-foreground">Current database status and configuration.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Database Type:</span>
                          <span className="font-medium">PostgreSQL 14</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Size:</span>
                          <span className="font-medium">1.2 GB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active Connections:</span>
                          <span className="font-medium">12</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Backup Information</h3>
                        <p className="text-sm text-muted-foreground">Database backup configuration and status.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Last Backup:</span>
                          <span className="font-medium">{lastBackup}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Backup Size:</span>
                          <span className="font-medium">156 MB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Backup Frequency:</span>
                          <span className="font-medium capitalize">{databaseSettings.backupFrequency}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium">Storage Utilization</h3>
                      <p className="text-sm text-muted-foreground mb-2">Database storage usage by type.</p>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>User Data</span>
                            <span>420 MB (35%)</span>
                          </div>
                          <Progress value={35} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Request Data</span>
                            <span>540 MB (45%)</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Attachment Data</span>
                            <span>180 MB (15%)</span>
                          </div>
                          <Progress value={15} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>System Data</span>
                            <span>60 MB (5%)</span>
                          </div>
                          <Progress value={5} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="backupFreq">Backup Frequency</Label>
                          <select 
                            id="backupFreq"
                            value={databaseSettings.backupFrequency}
                            onChange={(e) => setDatabaseSettings({...databaseSettings, backupFrequency: e.target.value})}
                            className="w-full p-2 border rounded"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="retention">Retention Period</Label>
                          <Input id="retention" 
                            value={databaseSettings.retentionPeriod} 
                            onChange={(e) => setDatabaseSettings({...databaseSettings, retentionPeriod: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="compression">Compression Level</Label>
                          <select 
                            id="compression"
                            value={databaseSettings.compressionLevel}
                            onChange={(e) => setDatabaseSettings({...databaseSettings, compressionLevel: e.target.value})}
                            className="w-full p-2 border rounded"
                          >
                            <option value="none">None</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="encryptBackups">Encrypt Backups</Label>
                            <p className="text-sm text-muted-foreground">Enable AES-256 encryption for backups</p>
                          </div>
                          <input
                            type="checkbox"
                            id="encryptBackups"
                            checked={databaseSettings.encryptBackups}
                            onChange={(e) => setDatabaseSettings({...databaseSettings, encryptBackups: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="autoCleanup">Auto Cleanup</Label>
                            <p className="text-sm text-muted-foreground">Automatically remove expired backups</p>
                          </div>
                          <input
                            type="checkbox"
                            id="autoCleanup"
                            checked={databaseSettings.autoCleanup}
                            onChange={(e) => setDatabaseSettings({...databaseSettings, autoCleanup: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button onClick={saveDatabaseSettingsTab}>Save Settings</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Create Backup</CardTitle>
                          <CardDescription>Create an immediate database backup</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            setLastBackup("Just now");
                            toast({
                              title: "Backup created",
                              description: "Database backup has been successfully created.",
                            });
                          }}>
                            Create Backup Now
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Restore Backup</CardTitle>
                          <CardDescription>Restore from a previous backup</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Restore initiated",
                              description: "Database restore process has been started.",
                            });
                          }}>
                            Select Backup to Restore
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Optimize Database</CardTitle>
                          <CardDescription>Run vacuum and analyze operations</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Optimization started",
                              description: "Database optimization process has been initiated.",
                            });
                          }}>
                            Optimize Now
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Export Data</CardTitle>
                          <CardDescription>Export database data to CSV or JSON</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Export started",
                              description: "Database export has been initiated.",
                            });
                          }}>
                            Export Data
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logs" className="h-[300px] overflow-y-auto border rounded p-4">
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-green-600">[2023-07-15 08:00:01] Automatic backup completed successfully (156 MB)</p>
                      <p className="text-green-600">[2023-07-15 00:15:22] Database vacuum completed successfully</p>
                      <p className="text-yellow-600">[2023-07-14 23:42:15] WARNING: Table 'requests' approaching maximum size threshold</p>
                      <p className="text-green-600">[2023-07-14 20:30:44] Index rebuild completed for table 'user_profiles'</p>
                      <p className="text-green-600">[2023-07-14 16:22:03] Manual backup created by admin@example.com (155 MB)</p>
                      <p className="text-red-600">[2023-07-14 15:11:58] ERROR: Query timeout executing analytics report</p>
                      <p className="text-green-600">[2023-07-14 14:05:32] Old backup files deleted per retention policy (7 files freed)</p>
                      <p className="text-green-600">[2023-07-14 12:30:11] Database statistics updated successfully</p>
                      <p className="text-yellow-600">[2023-07-14 10:45:23] WARNING: High disk I/O detected during backup operation</p>
                      <p className="text-green-600">[2023-07-14 08:00:01] Automatic backup completed successfully (154 MB)</p>
                      <p className="text-green-600">[2023-07-13 22:15:33] Database optimization completed (5.2% space recovered)</p>
                      <p className="text-red-600">[2023-07-13 18:22:41] ERROR: Connection pool exhausted (max connections: 100)</p>
                      <p className="text-green-600">[2023-07-13 16:45:19] Data export completed for table 'requests' to CSV</p>
                      <p className="text-green-600">[2023-07-13 14:30:08] Database schema updated with new migration</p>
                      <p className="text-green-600">[2023-07-13 08:00:01] Automatic backup completed successfully (153 MB)</p>
                    </div>
                  </TabsContent>
                </>
              )}
              
              {/* Security Settings Content */}
              {selectedAction === "Security Settings" && (
                <>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Security Overview</h3>
                        <p className="text-sm text-muted-foreground">Current security configuration.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Password Policy:</span>
                          <span className="font-medium capitalize">{securitySettings.passwordPolicy}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Multi-factor Authentication:</span>
                          <span className="font-medium">{securitySettings.mfaEnabled ? "Enabled" : "Disabled"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Session Length:</span>
                          <span className="font-medium">{securitySettings.sessionLength} hours</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Security Alerts</h3>
                        <p className="text-sm text-muted-foreground">Recent security notifications.</p>
                        <div className="text-sm space-y-2 mt-2">
                          <div className="flex items-start gap-2 p-2 rounded bg-muted/50">
                            <Shield className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Security audit completed</p>
                              <p className="text-xs text-muted-foreground">5 days ago</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 p-2 rounded bg-yellow-100">
                            <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-600" />
                            <div>
                              <p className="font-medium">3 failed login attempts detected</p>
                              <p className="text-xs text-muted-foreground">Yesterday at 8:42 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium">Authentication Statistics</h3>
                      <p className="text-sm text-muted-foreground mb-2">Recent authentication activity.</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded p-3">
                          <div className="text-2xl font-bold">324</div>
                          <p className="text-sm text-muted-foreground">Successful logins (7 days)</p>
                        </div>
                        <div className="border rounded p-3">
                          <div className="text-2xl font-bold text-yellow-600">18</div>
                          <p className="text-sm text-muted-foreground">Failed logins (7 days)</p>
                        </div>
                        <div className="border rounded p-3">
                          <div className="text-2xl font-bold text-green-600">94%</div>
                          <p className="text-sm text-muted-foreground">MFA compliance rate</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="passwordPolicy">Password Policy</Label>
                          <select 
                            id="passwordPolicy"
                            value={securitySettings.passwordPolicy}
                            onChange={(e) => setSecuritySettings({...securitySettings, passwordPolicy: e.target.value})}
                            className="w-full p-2 border rounded"
                          >
                            <option value="basic">Basic (8+ characters)</option>
                            <option value="medium">Medium (10+ characters, 1+ number)</option>
                            <option value="strong">Strong (12+ chars, number, special)</option>
                            <option value="very-strong">Very Strong (14+ chars, mixed case, number, special)</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sessionLength">Session Length (hours)</Label>
                          <Input id="sessionLength" 
                            type="number"
                            value={securitySettings.sessionLength.toString()} 
                            onChange={(e) => setSecuritySettings({...securitySettings, sessionLength: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="failedAttempts">Failed Login Attempts Before Lockout</Label>
                          <Input id="failedAttempts" 
                            type="number"
                            value={securitySettings.failedLoginAttempts.toString()} 
                            onChange={(e) => setSecuritySettings({...securitySettings, failedLoginAttempts: parseInt(e.target.value) || 0})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="mfaEnabled">Multi-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">Require MFA for all staff users</p>
                          </div>
                          <input
                            type="checkbox"
                            id="mfaEnabled"
                            checked={securitySettings.mfaEnabled}
                            onChange={(e) => setSecuritySettings({...securitySettings, mfaEnabled: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="ipRestrictions">IP Restrictions</Label>
                            <p className="text-sm text-muted-foreground">Limit admin access to specific IP ranges</p>
                          </div>
                          <input
                            type="checkbox"
                            id="ipRestrictions"
                            checked={securitySettings.ipRestrictions}
                            onChange={(e) => setSecuritySettings({...securitySettings, ipRestrictions: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="autoLockout">Auto Account Lockout</Label>
                            <p className="text-sm text-muted-foreground">Automatically lock accounts after failed attempts</p>
                          </div>
                          <input
                            type="checkbox"
                            id="autoLockout"
                            checked={securitySettings.autoLockout}
                            onChange={(e) => setSecuritySettings({...securitySettings, autoLockout: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button onClick={saveSecuritySettingsTab}>Save Settings</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Security Audit</CardTitle>
                          <CardDescription>Run a comprehensive security audit</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Security audit initiated",
                              description: "A full security audit has been started.",
                            });
                          }}>
                            Run Audit
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Force Password Reset</CardTitle>
                          <CardDescription>Force password reset for all users</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Password reset initiated",
                              description: "All users will be required to reset their passwords.",
                            });
                          }}>
                            Force Reset
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Session Management</CardTitle>
                          <CardDescription>Manage active user sessions</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Sessions cleared",
                              description: "All active sessions have been terminated.",
                            });
                          }}>
                            Terminate All Sessions
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Reset MFA</CardTitle>
                          <CardDescription>Reset MFA for selected users</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "MFA management",
                              description: "MFA reset interface opened.",
                            });
                          }}>
                            Reset MFA Devices
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logs" className="h-[300px] overflow-y-auto border rounded p-4">
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-yellow-600">[2023-07-15 08:42:12] Failed login attempt for user 'john.doe@example.com' from IP 192.168.1.105</p>
                      <p className="text-green-600">[2023-07-15 08:35:22] User 'admin@example.com' logged in successfully</p>
                      <p className="text-green-600">[2023-07-15 08:22:43] MFA enabled for user 'jane.smith@example.com'</p>
                      <p className="text-red-600">[2023-07-15 07:55:11] Multiple failed login attempts detected from IP 203.0.113.42 (blocked for 30 mins)</p>
                      <p className="text-green-600">[2023-07-14 18:30:22] Password changed for user 'support@example.com'</p>
                      <p className="text-green-600">[2023-07-14 17:42:11] Security audit completed: 2 medium severity issues found</p>
                      <p className="text-yellow-600">[2023-07-14 16:15:33] User 'field.officer@example.com' attempted to access unauthorized resource</p>
                      <p className="text-green-600">[2023-07-14 15:20:44] IP restriction policy updated by 'admin@example.com'</p>
                      <p className="text-green-600">[2023-07-14 14:05:12] Session timeout setting updated to 30 minutes</p>
                      <p className="text-red-600">[2023-07-14 12:33:09] Suspicious login pattern detected for user 'test.user@example.com'</p>
                      <p className="text-green-600">[2023-07-14 11:45:22] All user sessions terminated by administrator</p>
                      <p className="text-green-600">[2023-07-14 10:30:55] Password policy updated to 'strong'</p>
                      <p className="text-yellow-600">[2023-07-14 09:22:18] Failed MFA attempt for user 'director@example.com'</p>
                      <p className="text-green-600">[2023-07-14 08:45:33] Admin rights granted to user 'head.programs@example.com'</p>
                      <p className="text-green-600">[2023-07-14 08:15:10] User 'john.doe@example.com' account unlocked after timeout</p>
                    </div>
                  </TabsContent>
                </>
              )}
              
              {/* API Configuration Content */}
              {selectedAction === "API Configuration" && (
                <>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">API Overview</h3>
                        <p className="text-sm text-muted-foreground">Current API configuration and usage.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Active Integrations:</span>
                          <span className="font-medium">{apiSettings.activeIntegrations}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Rate Limit:</span>
                          <span className="font-medium">{apiSettings.rateLimit} requests/minute</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Token Expiry:</span>
                          <span className="font-medium">{apiSettings.tokenExpiry}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">API Usage</h3>
                        <p className="text-sm text-muted-foreground">Recent API usage statistics.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Today's Requests:</span>
                          <span className="font-medium">5,246</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average Response Time:</span>
                          <span className="font-medium">235ms</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Error Rate:</span>
                          <span className="font-medium">0.8%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium">Active Integrations</h3>
                      <p className="text-sm text-muted-foreground mb-2">Currently configured API integrations.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 border-b">
                          <div className="font-medium">SMS Notification Service</div>
                          <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                        </div>
                        <div className="flex justify-between p-2 border-b">
                          <div className="font-medium">Payment Gateway</div>
                          <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                        </div>
                        <div className="flex justify-between p-2 border-b">
                          <div className="font-medium">Geolocation Services</div>
                          <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                        </div>
                        <div className="flex justify-between p-2">
                          <div className="font-medium">Weather Data Service</div>
                          <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="rateLimit">Rate Limit (requests/minute)</Label>
                          <Input id="rateLimit" 
                            type="number"
                            value={apiSettings.rateLimit.toString()} 
                            onChange={(e) => setApiSettings({...apiSettings, rateLimit: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tokenExpiry">Token Expiry</Label>
                          <Input id="tokenExpiry" 
                            value={apiSettings.tokenExpiry} 
                            onChange={(e) => setApiSettings({...apiSettings, tokenExpiry: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="logRequests">Log API Requests</Label>
                            <p className="text-sm text-muted-foreground">Keep detailed logs of all API requests</p>
                          </div>
                          <input
                            type="checkbox"
                            id="logRequests"
                            checked={apiSettings.logRequests}
                            onChange={(e) => setApiSettings({...apiSettings, logRequests: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="corsEnabled">Enable CORS</Label>
                            <p className="text-sm text-muted-foreground">Allow cross-origin resource sharing</p>
                          </div>
                          <input
                            type="checkbox"
                            id="corsEnabled"
                            checked={apiSettings.corsEnabled}
                            onChange={(e) => setApiSettings({...apiSettings, corsEnabled: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Allowed Origins</h3>
                      <Textarea 
                        placeholder="Enter allowed origins (one per line)"
                        className="h-[100px]"
                        defaultValue="https://example.com&#10;https://admin.example.com&#10;https://partner-app.com"
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button onClick={saveApiSettingsTab}>Save Settings</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Generate API Key</CardTitle>
                          <CardDescription>Create a new API access key</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "API key generated",
                              description: "A new API key has been created.",
                            });
                          }}>
                            Generate Key
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Test API Endpoints</CardTitle>
                          <CardDescription>Run diagnostic tests on API endpoints</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "API test completed",
                              description: "All API endpoints are functioning correctly.",
                            });
                          }}>
                            Run Tests
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Manage Webhooks</CardTitle>
                          <CardDescription>Configure and test webhook endpoints</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Webhook management",
                              description: "Webhook management interface opened.",
                            });
                          }}>
                            Configure Webhooks
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">API Documentation</CardTitle>
                          <CardDescription>Generate up-to-date API documentation</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Documentation generated",
                              description: "API documentation has been updated.",
                            });
                          }}>
                            Generate Docs
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logs" className="h-[300px] overflow-y-auto border rounded p-4">
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-green-600">[2023-07-15 08:55:22] GET /api/requests/summary 200 OK 123ms</p>
                      <p className="text-green-600">[2023-07-15 08:54:11] GET /api/users/status 200 OK 87ms</p>
                      <p className="text-green-600">[2023-07-15 08:52:33] POST /api/requests/new 201 Created 245ms</p>
                      <p className="text-red-600">[2023-07-15 08:45:12] GET /api/analytics/monthly 429 Too Many Requests 22ms</p>
                      <p className="text-green-600">[2023-07-15 08:42:55] GET /api/settings 200 OK 56ms</p>
                      <p className="text-yellow-600">[2023-07-15 08:40:22] POST /api/webhooks/payment 202 Accepted 1243ms</p>
                      <p className="text-green-600">[2023-07-15 08:35:19] GET /api/requests/5 200 OK 112ms</p>
                      <p className="text-red-600">[2023-07-15 08:30:44] POST /api/documents/upload 500 Internal Server Error 2233ms</p>
                      <p className="text-green-600">[2023-07-15 08:25:03] GET /api/users/list 200 OK 189ms</p>
                      <p className="text-green-600">[2023-07-15 08:20:56] PUT /api/requests/3/status 200 OK 134ms</p>
                      <p className="text-green-600">[2023-07-15 08:15:22] GET /api/dashboard/stats 200 OK 156ms</p>
                      <p className="text-green-600">[2023-07-15 08:10:43] DELETE /api/documents/12 204 No Content 89ms</p>
                      <p className="text-yellow-600">[2023-07-15 08:05:19] GET /api/settings/security 304 Not Modified 45ms</p>
                      <p className="text-green-600">[2023-07-15 08:00:33] GET /api/health 200 OK 12ms</p>
                      <p className="text-green-600">[2023-07-15 07:55:11] POST /api/auth/login 200 OK 223ms</p>
                    </div>
                  </TabsContent>
                </>
              )}
              
              {/* User Management Content */}
              {selectedAction === "User Management" && (
                <>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">User Statistics</h3>
                        <p className="text-sm text-muted-foreground">Current user account information.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Total Users:</span>
                          <span className="font-medium">{userManagement.totalUsers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active Users:</span>
                          <span className="font-medium">{userManagement.activeUsers} ({Math.round((userManagement.activeUsers / userManagement.totalUsers) * 100)}%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>New This Week:</span>
                          <span className="font-medium">{userManagement.newUsers}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Account Status</h3>
                        <p className="text-sm text-muted-foreground">User account status overview.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Pending Approvals:</span>
                          <span className="font-medium">{userManagement.pendingApprovals}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Locked Accounts:</span>
                          <span className="font-medium">{userManagement.lockedAccounts}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Email Verification Rate:</span>
                          <span className="font-medium">92%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium">User Distribution</h3>
                      <p className="text-sm text-muted-foreground mb-2">Users by role type.</p>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Regular Users</span>
                            <span>785 (91.7%)</span>
                          </div>
                          <Progress value={91.7} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Field Officers</span>
                            <span>25 (2.9%)</span>
                          </div>
                          <Progress value={2.9} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Project Officers</span>
                            <span>32 (3.7%)</span>
                          </div>
                          <Progress value={3.7} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Administration</span>
                            <span>14 (1.7%)</span>
                          </div>
                          <Progress value={1.7} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="userApproval">Registration Approval</Label>
                          <select 
                            id="userApproval"
                            className="w-full p-2 border rounded"
                            defaultValue="manual"
                          >
                            <option value="automatic">Automatic</option>
                            <option value="manual">Manual Approval</option>
                            <option value="verification">Email Verification Only</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="accountLockout">Account Lockout Duration (minutes)</Label>
                          <Input id="accountLockout" 
                            type="number"
                            defaultValue="30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="maxSessions">Maximum Concurrent Sessions</Label>
                          <Input id="maxSessions" 
                            type="number"
                            defaultValue="5"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="requireVerification">Require Email Verification</Label>
                            <p className="text-sm text-muted-foreground">New accounts must verify their email</p>
                          </div>
                          <input
                            type="checkbox"
                            id="requireVerification"
                            defaultChecked={true}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="allowSelfSignup">Allow Self-Registration</Label>
                            <p className="text-sm text-muted-foreground">Allow public registration for new accounts</p>
                          </div>
                          <input
                            type="checkbox"
                            id="allowSelfSignup"
                            defaultChecked={true}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="notifyAdmin">Admin Notifications</Label>
                            <p className="text-sm text-muted-foreground">Notify admins of new registrations</p>
                          </div>
                          <input
                            type="checkbox"
                            id="notifyAdmin"
                            defaultChecked={true}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button onClick={saveUserManagementTab}>Save Settings</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">User Search</CardTitle>
                          <CardDescription>Find and manage specific users</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-2">
                          <Input placeholder="Search by name, email or ID" />
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "User search",
                              description: "User search interface opened.",
                            });
                          }}>
                            Search Users
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Bulk Actions</CardTitle>
                          <CardDescription>Perform actions on multiple users</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <select className="w-full p-2 border rounded mb-2">
                            <option>Select action...</option>
                            <option>Force password reset</option>
                            <option>Export user data</option>
                            <option>Send notification</option>
                            <option>Change user role</option>
                          </select>
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Bulk action",
                              description: "Bulk user action interface opened.",
                            });
                          }}>
                            Apply to Selected
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Account Approvals</CardTitle>
                          <CardDescription>Review pending approval requests</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Approval queue",
                              description: `${userManagement.pendingApprovals} users awaiting approval.`,
                            });
                          }}>
                            View Pending ({userManagement.pendingApprovals})
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Unlock Accounts</CardTitle>
                          <CardDescription>Manage locked user accounts</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Locked accounts",
                              description: `${userManagement.lockedAccounts} accounts currently locked.`,
                            });
                          }}>
                            View Locked ({userManagement.lockedAccounts})
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logs" className="h-[300px] overflow-y-auto border rounded p-4">
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-green-600">[2023-07-15 08:55:12] User 'john.smith@example.com' registered (awaiting verification)</p>
                      <p className="text-green-600">[2023-07-15 08:42:33] Admin updated role for user 'field.officer@example.com' to 'Project Officer'</p>
                      <p className="text-yellow-600">[2023-07-15 08:30:44] User 'jane.doe@example.com' failed login attempt (2/5)</p>
                      <p className="text-green-600">[2023-07-15 08:22:11] User 'james.wilson@example.com' email verified successfully</p>
                      <p className="text-green-600">[2023-07-15 08:15:55] Admin 'admin@example.com' approved 3 new user registrations</p>
                      <p className="text-red-600">[2023-07-15 08:05:22] User 'test.user@example.com' account locked (5 failed attempts)</p>
                      <p className="text-green-600">[2023-07-15 07:58:43] User 'sarah.jones@example.com' password reset complete</p>
                      <p className="text-green-600">[2023-07-14 18:30:15] Admin exported user data for region 'Central'</p>
                      <p className="text-green-600">[2023-07-14 17:55:22] Admin 'director@example.com' created new staff account 'new.officer@example.com'</p>
                      <p className="text-green-600">[2023-07-14 16:42:11] User 'robert.miller@example.com' profile updated</p>
                      <p className="text-green-600">[2023-07-14 15:30:55] User 'test.user@example.com' account unlocked by admin</p>
                      <p className="text-red-600">[2023-07-14 14:22:33] User 'jane.doe@example.com' deleted their account</p>
                      <p className="text-yellow-600">[2023-07-14 13:15:44] Mass notification sent to 58 users in 'Field Officer' role</p>
                      <p className="text-green-600">[2023-07-14 12:30:22] Bulk role update: 5 users changed from 'User' to 'Field Officer'</p>
                      <p className="text-green-600">[2023-07-14 11:45:11] User 'emma.wilson@example.com' changed their email address</p>
                    </div>
                  </TabsContent>
                </>
              )}
              
              {/* Role Management Content */}
              {selectedAction === "Role Management" && (
                <>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Role Overview</h3>
                        <p className="text-sm text-muted-foreground">Current role configuration.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Available Roles:</span>
                          <span className="font-medium">{roleManagement.availableRoles.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Custom Permissions:</span>
                          <span className="font-medium">{roleManagement.customPermissions ? "Enabled" : "Disabled"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Role Hierarchy:</span>
                          <span className="font-medium">{roleManagement.hierarchyEnforcement ? "Enforced" : "Flexible"}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Role Distribution</h3>
                        <p className="text-sm text-muted-foreground">Users assigned to each role.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Regular Users:</span>
                          <span className="font-medium">785</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Staff Members:</span>
                          <span className="font-medium">71</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Administrators:</span>
                          <span className="font-medium">3</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium">Role Listing</h3>
                      <p className="text-sm text-muted-foreground mb-2">All available roles in the system.</p>
                      <div className="space-y-2 text-sm">
                        {roleManagement.availableRoles.map((role, index) => (
                          <div key={index} className="flex justify-between p-2 border-b">
                            <div className="font-medium">{role}</div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                {index === 0 ? 'Default' : index === roleManagement.availableRoles.length - 1 ? 'Highest' : ''}
                              </Badge>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => {
                                toast({
                                  title: `${role} role`,
                                  description: `${role} role details viewed.`,
                                });
                              }}>
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Settings</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="defaultRole">Default Role</Label>
                          <select 
                            id="defaultRole"
                            className="w-full p-2 border rounded"
                            defaultValue="User"
                          >
                            {roleManagement.availableRoles.map((role, index) => (
                              <option key={index} value={role}>{role}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="adminRole">Administrator Role</Label>
                          <select 
                            id="adminRole"
                            className="w-full p-2 border rounded"
                            defaultValue="Admin"
                          >
                            {roleManagement.availableRoles.map((role, index) => (
                              <option key={index} value={role}>{role}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="staffRoles">Staff Roles</Label>
                          <select 
                            id="staffRoles"
                            className="w-full p-2 border rounded"
                            multiple
                            size={4}
                            defaultValue={["Field Officer", "Project Officer", "Assistant Project Officer", "Head of Programs"]}
                          >
                            {roleManagement.availableRoles.map((role, index) => (
                              <option key={index} value={role}>{role}</option>
                            ))}
                          </select>
                          <p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="customPerms">Custom Permissions</Label>
                            <p className="text-sm text-muted-foreground">Enable granular permission control</p>
                          </div>
                          <input
                            type="checkbox"
                            id="customPerms"
                            checked={roleManagement.customPermissions}
                            onChange={(e) => setRoleManagement({...roleManagement, customPermissions: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="hierarchy">Role Hierarchy</Label>
                            <p className="text-sm text-muted-foreground">Enforce role hierarchy for permissions</p>
                          </div>
                          <input
                            type="checkbox"
                            id="hierarchy"
                            checked={roleManagement.hierarchyEnforcement}
                            onChange={(e) => setRoleManagement({...roleManagement, hierarchyEnforcement: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button onClick={saveRoleManagementTab}>Save Settings</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Create New Role</CardTitle>
                          <CardDescription>Define a new system role</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-2">
                          <Input placeholder="Enter role name" />
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Create role",
                              description: "New role creation interface opened.",
                            });
                          }}>
                            Create Role
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Edit Role</CardTitle>
                          <CardDescription>Modify existing role definition</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-2">
                          <select className="w-full p-2 border rounded">
                            {roleManagement.availableRoles.map((role, index) => (
                              <option key={index} value={role}>{role}</option>
                            ))}
                          </select>
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Edit role",
                              description: "Role editing interface opened.",
                            });
                          }}>
                            Edit Selected Role
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Role Assignments</CardTitle>
                          <CardDescription>View users by role</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-2">
                          <select className="w-full p-2 border rounded">
                            {roleManagement.availableRoles.map((role, index) => (
                              <option key={index} value={role}>{role}</option>
                            ))}
                          </select>
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Role assignments",
                              description: "User role assignments viewed.",
                            });
                          }}>
                            View Assignments
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Permission Mapping</CardTitle>
                          <CardDescription>Edit role permission settings</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Permission mapping",
                              description: "Role permission mapping interface opened.",
                            });
                          }}>
                            Edit Permissions
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logs" className="h-[300px] overflow-y-auto border rounded p-4">
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-green-600">[2023-07-15 08:42:33] Admin updated role 'Project Officer' permissions</p>
                      <p className="text-green-600">[2023-07-15 08:15:22] User 'john.smith@example.com' assigned to role 'Field Officer'</p>
                      <p className="text-green-600">[2023-07-15 07:55:11] Admin created new role 'Regional Coordinator'</p>
                      <p className="text-green-600">[2023-07-14 17:30:45] Role 'Assistant Project Officer' permission 'canAccessAnalytics' enabled</p>
                      <p className="text-green-600">[2023-07-14 16:22:33] Admin modified role hierarchy: 'Field Officer' moved below 'Project Officer'</p>
                      <p className="text-yellow-600">[2023-07-14 15:18:10] Permission conflict detected for role 'Project Officer'</p>
                      <p className="text-green-600">[2023-07-14 14:55:22] Bulk role assignment: 3 users assigned to 'Field Officer'</p>
                      <p className="text-green-600">[2023-07-14 14:30:18] Role 'User' default permissions updated</p>
                      <p className="text-red-600">[2023-07-14 13:45:09] Attempt to delete protected role 'Admin' rejected</p>
                      <p className="text-green-600">[2023-07-14 13:15:55] Custom permission group 'Reports Access' created</p>
                      <p className="text-green-600">[2023-07-14 12:42:33] Role 'Head of Programs' granted permission 'canManageStaff'</p>
                      <p className="text-green-600">[2023-07-14 11:55:22] Role 'Admin' assigned to user 'new.admin@example.com'</p>
                      <p className="text-green-600">[2023-07-14 11:30:11] Permission inheritance enabled for all staff roles</p>
                      <p className="text-green-600">[2023-07-14 10:45:55] Role 'Field Officer' permission 'canAccessFieldReports' enabled</p>
                      <p className="text-green-600">[2023-07-14 10:15:22] Default role changed from 'Guest' to 'User'</p>
                    </div>
                  </TabsContent>
                </>
              )}
              
              {/* Staff Directory Content */}
              {selectedAction === "Staff Directory" && (
                <>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Staff Overview</h3>
                        <p className="text-sm text-muted-foreground">Current staff information.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Total Staff Members:</span>
                          <span className="font-medium">{staffDirectory.totalStaff}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Departments:</span>
                          <span className="font-medium">{staffDirectory.departments.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average Tenure:</span>
                          <span className="font-medium">2.4 years</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Staff Distribution</h3>
                        <p className="text-sm text-muted-foreground">Staff by department.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Field Operations:</span>
                          <span className="font-medium">15 (45.5%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Project Management:</span>
                          <span className="font-medium">8 (24.2%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Administration:</span>
                          <span className="font-medium">5 (15.2%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Other Departments:</span>
                          <span className="font-medium">5 (15.2%)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium">Regional Staff Distribution</h3>
                      <p className="text-sm text-muted-foreground mb-2">Staff members by location.</p>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Central Region</span>
                            <span>12 (36.4%)</span>
                          </div>
                          <Progress value={36.4} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Northern Region</span>
                            <span>8 (24.2%)</span>
                          </div>
                          <Progress value={24.2} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Eastern Region</span>
                            <span>7 (21.2%)</span>
                          </div>
                          <Progress value={21.2} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Western Region</span>
                            <span>6 (18.2%)</span>
                          </div>
                          <Progress value={18.2} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="dirFormat">Directory Format</Label>
                          <select 
                            id="dirFormat"
                            className="w-full p-2 border rounded"
                            defaultValue="detailed"
                          >
                            <option value="basic">Basic (Name and Role)</option>
                            <option value="standard">Standard (With Contact Info)</option>
                            <option value="detailed">Detailed (Full Profile)</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sortBy">Default Sort Order</Label>
                          <select 
                            id="sortBy"
                            className="w-full p-2 border rounded"
                            defaultValue="name"
                          >
                            <option value="name">Name</option>
                            <option value="role">Role</option>
                            <option value="department">Department</option>
                            <option value="region">Region</option>
                            <option value="tenure">Tenure</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="exportFormat">Export Format</Label>
                          <select 
                            id="exportFormat"
                            className="w-full p-2 border rounded"
                            value={staffDirectory.exportFormat}
                            onChange={(e) => setStaffDirectory({...staffDirectory, exportFormat: e.target.value})}
                          >
                            <option value="CSV">CSV</option>
                            <option value="PDF">PDF</option>
                            <option value="Excel">Excel</option>
                            <option value="JSON">JSON</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="showContact">Show Contact Information</Label>
                            <p className="text-sm text-muted-foreground">Display staff contact details</p>
                          </div>
                          <input
                            type="checkbox"
                            id="showContact"
                            defaultChecked={true}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="locationFilter">Enable Location Filtering</Label>
                            <p className="text-sm text-muted-foreground">Filter staff by region/location</p>
                          </div>
                          <input
                            type="checkbox"
                            id="locationFilter"
                            checked={staffDirectory.locationFiltering}
                            onChange={(e) => setStaffDirectory({...staffDirectory, locationFiltering: e.target.checked})}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="showPerformance">Include Performance Metrics</Label>
                            <p className="text-sm text-muted-foreground">Show staff performance indicators</p>
                          </div>
                          <input
                            type="checkbox"
                            id="showPerformance"
                            defaultChecked={false}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button onClick={saveStaffDirectoryTab}>Save Settings</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Staff Search</CardTitle>
                          <CardDescription>Find staff members</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-2">
                          <Input placeholder="Search staff directory" />
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Staff search",
                              description: "Staff search interface opened.",
                            });
                          }}>
                            Search Directory
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Filter Staff</CardTitle>
                          <CardDescription>Filter by department or region</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-2">
                          <select className="w-full p-2 border rounded">
                            <option value="">Select Department...</option>
                            {staffDirectory.departments.map((dept, index) => (
                              <option key={index} value={dept}>{dept}</option>
                            ))}
                          </select>
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Staff filtered",
                              description: "Staff directory filtered by department.",
                            });
                          }}>
                            Apply Filter
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Export Directory</CardTitle>
                          <CardDescription>Download staff directory</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Directory exported",
                              description: `Staff directory exported to ${staffDirectory.exportFormat} format.`,
                            });
                          }}>
                            Export Directory
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Staff Reports</CardTitle>
                          <CardDescription>Generate staff analysis reports</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Reports interface",
                              description: "Staff reporting interface opened.",
                            });
                          }}>
                            Generate Reports
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logs" className="h-[300px] overflow-y-auto border rounded p-4">
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-green-600">[2023-07-15 08:42:12] Staff directory exported to CSV by admin@example.com</p>
                      <p className="text-green-600">[2023-07-15 08:22:33] New staff member 'sarah.johnson@example.com' added to Field Operations</p>
                      <p className="text-green-600">[2023-07-15 07:55:44] Staff member 'james.wilson@example.com' transferred to Project Management</p>
                      <p className="text-green-600">[2023-07-14 17:30:11] Staff contact information updated for 3 members</p>
                      <p className="text-green-600">[2023-07-14 16:45:22] Staff member 'robert.davis@example.com' promoted to Project Officer</p>
                      <p className="text-green-600">[2023-07-14 16:15:33] New department 'Community Outreach' added to directory</p>
                      <p className="text-yellow-600">[2023-07-14 15:42:55] Staff record ID conflict detected and resolved</p>
                      <p className="text-green-600">[2023-07-14 15:15:22] Staff photos uploaded for 5 new members</p>
                      <p className="text-green-600">[2023-07-14 14:30:44] Regional teams reorganized: 2 staff members reassigned</p>
                      <p className="text-green-600">[2023-07-14 13:55:11] Staff member 'emily.thomas@example.com' profile completed</p>
                      <p className="text-red-600">[2023-07-14 13:22:33] Staff member 'john.smith@example.com' marked as inactive (left organization)</p>
                      <p className="text-green-600">[2023-07-14 12:45:55] Bulk update: contact information refreshed for all staff</p>
                      <p className="text-green-600">[2023-07-14 11:30:22] Staff performance metrics template updated</p>
                      <p className="text-green-600">[2023-07-14 10:55:11] Directory schema updated to include certification fields</p>
                      <p className="text-green-600">[2023-07-14 10:15:33] Staff utilization report generated by admin@example.com</p>
                    </div>
                  </TabsContent>
                </>
              )}
              
              {/* Permission Settings Content */}
              {selectedAction === "Permission Settings" && (
                <>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Permission Overview</h3>
                        <p className="text-sm text-muted-foreground">Current permission configuration.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Permission Types:</span>
                          <span className="font-medium">8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Custom Permissions:</span>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Permission Groups:</span>
                          <span className="font-medium">5</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">System Access</h3>
                        <p className="text-sm text-muted-foreground">Administrative access configuration.</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Admin Access:</span>
                          <span className="font-medium">3 users</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Data Management:</span>
                          <span className="font-medium">8 users</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Report Generation:</span>
                          <span className="font-medium">12 users</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium">Core Permission Types</h3>
                      <p className="text-sm text-muted-foreground mb-2">Primary permission categories.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 border-b">
                          <div className="font-medium">View Requests</div>
                          <div className="text-muted-foreground">All authenticated users</div>
                        </div>
                        <div className="flex justify-between p-2 border-b">
                          <div className="font-medium">Assign Requests</div>
                          <div className="text-muted-foreground">Project Officers and above</div>
                        </div>
                        <div className="flex justify-between p-2 border-b">
                          <div className="font-medium">Review Requests</div>
                          <div className="text-muted-foreground">Field Officers and above</div>
                        </div>
                        <div className="flex justify-between p-2 border-b">
                          <div className="font-medium">Approve Requests</div>
                          <div className="text-muted-foreground">CEO, Director, and Patron</div>
                        </div>
                        <div className="flex justify-between p-2 border-b">
                          <div className="font-medium">Manage Staff</div>
                          <div className="text-muted-foreground">Head of Programs and above</div>
                        </div>
                        <div className="flex justify-between p-2">
                          <div className="font-medium">Access Admin Panel</div>
                          <div className="text-muted-foreground">Administrators only</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="permModel">Permission Model</Label>
                          <select 
                            id="permModel"
                            className="w-full p-2 border rounded"
                            defaultValue="role-based"
                          >
                            <option value="role-based">Role-Based</option>
                            <option value="attribute-based">Attribute-Based</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="adminAccess">Administrative Access</Label>
                          <select 
                            id="adminAccess"
                            className="w-full p-2 border rounded"
                            defaultValue="restricted"
                          >
                            <option value="open">Open (Any Admin)</option>
                            <option value="restricted">Restricted (Specific Roles)</option>
                            <option value="strict">Strict (Director Only)</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dataAccess">Data Access Strategy</Label>
                          <select 
                            id="dataAccess"
                            className="w-full p-2 border rounded"
                            defaultValue="hierarchical"
                          >
                            <option value="flat">Flat (Equal Access)</option>
                            <option value="hierarchical">Hierarchical</option>
                            <option value="compartmentalized">Compartmentalized</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="inheritPerms">Permission Inheritance</Label>
                            <p className="text-sm text-muted-foreground">Higher roles inherit lower role permissions</p>
                          </div>
                          <input
                            type="checkbox"
                            id="inheritPerms"
                            defaultChecked={true}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="auditPerms">Permission Auditing</Label>
                            <p className="text-sm text-muted-foreground">Log all permission changes</p>
                          </div>
                          <input
                            type="checkbox"
                            id="auditPerms"
                            defaultChecked={true}
                            className="h-4 w-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="temporaryPerms">Temporary Permissions</Label>
                            <p className="text-sm text-muted-foreground">Allow time-limited permission grants</p>
                          </div>
                          <input
                            type="checkbox"
                            id="temporaryPerms"
                            defaultChecked={false}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button onClick={savePermissionSettingsTab}>Save Settings</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Edit Role Permissions</CardTitle>
                          <CardDescription>Configure permissions for roles</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-2">
                          <select className="w-full p-2 border rounded">
                            <option value="">Select Role...</option>
                            {roleManagement.availableRoles.map((role, index) => (
                              <option key={index} value={role}>{role}</option>
                            ))}
                          </select>
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Permission editor",
                              description: "Role permissions editor opened.",
                            });
                          }}>
                            Edit Permissions
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Create Permission Group</CardTitle>
                          <CardDescription>Define a new permission group</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-2">
                          <Input placeholder="Permission group name" />
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Create permission group",
                              description: "Permission group creation interface opened.",
                            });
                          }}>
                            Create Group
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Permission Matrix</CardTitle>
                          <CardDescription>View complete permission mapping</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Permission matrix",
                              description: "Permission matrix view opened.",
                            });
                          }}>
                            View Matrix
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Permission Audit</CardTitle>
                          <CardDescription>Review permission change history</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Button variant="outline" className="w-full" onClick={() => {
                            toast({
                              title: "Permission audit",
                              description: "Permission audit history opened.",
                            });
                          }}>
                            View Audit Log
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logs" className="h-[300px] overflow-y-auto border rounded p-4">
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-green-600">[2023-07-15 08:42:11] Permission 'canManageStaff' granted to role 'Head of Programs'</p>
                      <p className="text-green-600">[2023-07-15 08:15:33] Admin created new permission group 'Analytics Access'</p>
                      <p className="text-green-600">[2023-07-15 07:55:22] Permission inheritance enabled for staff role hierarchy</p>
                      <p className="text-yellow-600">[2023-07-14 17:30:44] Permission conflict detected: 'Project Officer' and 'Assistant Project Officer'</p>
                      <p className="text-green-600">[2023-07-14 16:45:11] Permission 'canAccessAnalytics' granted to role 'Assistant Project Officer'</p>
                      <p className="text-green-600">[2023-07-14 16:15:55] Admin updated permission model to 'Role-Based'</p>
                      <p className="text-green-600">[2023-07-14 15:42:22] Custom permission 'manageExternalPartners' created</p>
                      <p className="text-red-600">[2023-07-14 15:15:33] Unauthorized permission change attempted by user 'project.officer@example.com'</p>
                      <p className="text-green-600">[2023-07-14 14:55:11] Permission audit log exported by admin@example.com</p>
                      <p className="text-green-600">[2023-07-14 14:22:55] Role 'Field Officer' granted permission 'canAccessFieldReports'</p>
                      <p className="text-green-600">[2023-07-14 13:45:22] Admin removed permission 'canApproveRequests' from role 'Project Officer'</p>
                      <p className="text-green-600">[2023-07-14 13:15:44] Permission matrix updated for all roles</p>
                      <p className="text-green-600">[2023-07-14 12:55:11] Temporary permission grant: 'canManageStaff' to user 'project.officer@example.com' (expires in 7 days)</p>
                      <p className="text-yellow-600">[2023-07-14 12:22:33] Duplicate permission definition detected and merged</p>
                      <p className="text-green-600">[2023-07-14 11:45:55] Permission auditing enabled by admin@example.com</p>
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowSystemDialog(false)}>Cancel</Button>
              <Button onClick={completeAction}>Complete Action</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Action Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedAction}</DialogTitle>
              <DialogDescription>
                {selectedAction === "User Management" && "Add, edit, or remove user accounts."}
                {selectedAction === "Role Management" && "Configure user roles and their permissions."}
                {selectedAction === "Staff Directory" && "View and manage staff members and their information."}
                {selectedAction === "Permission Settings" && "Configure detailed permission settings for the application."}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              
              {/* Content tabs for each action dialog will go here */}
              {/* Each action (User Management, Role Management, etc.) will have its own set of tabs */}
              {/* Similar to the structure used for system action dialogs above */}
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowUserDialog(false)}>Cancel</Button>
              <Button onClick={completeAction}>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* System Restart Alert Dialog */}
        <AlertDialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" /> System Restart
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to restart all system services? This will temporarily interrupt access for all users.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={performSystemRestart} className="bg-red-600 hover:bg-red-700">
                Restart
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  const renderRoleSpecificCards = () => {
    if (roles.isCEO() || roles.isPatron()) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-500" />
                Approval Rate
              </CardTitle>
              <CardDescription>Executive decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statusCounts.completed > 0 ? Math.round((statusCounts.completed / (statusCounts.completed + statusCounts.rejected)) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">Requests approved vs rejected</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
                Pending Approval
              </CardTitle>
              <CardDescription>Awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.awaitingApproval}</div>
              <Progress 
                value={statusCounts.awaitingApproval / (totalRequests || 1) * 100} 
                className="h-2 mt-2 bg-muted" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Building className="mr-2 h-5 w-5 text-green-500" />
                Programs
              </CardTitle>
              <CardDescription>Active initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Strategic programs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-yellow-500" />
                Allocation
              </CardTitle>
              <CardDescription>Budget utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">68%</div>
              <p className="text-sm text-muted-foreground">Annual budget deployed</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    else if (roles.isAdmin() || roles.isHeadOfPrograms()) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                Staff Capacity
              </CardTitle>
              <CardDescription>Team workload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">73%</div>
              <p className="text-sm text-muted-foreground">Current staff utilization</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileQuestion className="mr-2 h-5 w-5 text-yellow-500" />
                Awaiting Approval
              </CardTitle>
              <CardDescription>Pending decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.awaitingApproval}</div>
              <p className="text-sm text-muted-foreground">Ready for review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck2 className="mr-2 h-5 w-5 text-green-500" />
                Processed
              </CardTitle>
              <CardDescription>Recently handled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.completed}</div>
              <p className="text-sm text-muted-foreground">Completed requests</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-indigo-500" />
                Response Rate
              </CardTitle>
              <CardDescription>Processing speed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.2 days</div>
              <p className="text-sm text-muted-foreground">Average processing time</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    else if (roles.isProjectOfficer() || roles.isAssistantProjectOfficer()) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
                Assigned
              </CardTitle>
              <CardDescription>Your workload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statusCounts.underReview}
              </div>
              <Progress 
                value={statusCounts.underReview / (totalRequests || 1) * 100} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-500" />
                Field Team
              </CardTitle>
              <CardDescription>Officers reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Active field officers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck2 className="mr-2 h-5 w-5 text-green-500" />
                Processed
              </CardTitle>
              <CardDescription>Your completions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.completed}</div>
              <Progress 
                value={statusCounts.completed / (totalRequests || 1) * 100} 
                className="h-2 mt-2 bg-muted" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-yellow-500" />
                Pending Visits
              </CardTitle>
              <CardDescription>Scheduled field work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.pending}</div>
              <p className="text-sm text-muted-foreground">Site visits needed</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    else if (roles.isFieldOfficer()) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
                My Tasks
              </CardTitle>
              <CardDescription>Assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statusCounts.pending + statusCounts.underReview}
              </div>
              <Progress 
                value={(statusCounts.pending + statusCounts.underReview) / 
                  (totalRequests || 1) * 100} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck2 className="mr-2 h-5 w-5 text-green-500" />
                Verified
              </CardTitle>
              <CardDescription>Assessments completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.completed}</div>
              <Progress 
                value={statusCounts.completed / (totalRequests || 1) * 100} 
                className="h-2 mt-2 bg-muted" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                Response Time
              </CardTitle>
              <CardDescription>Your average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3.1 days</div>
              <p className="text-sm text-muted-foreground">Verification speed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                Next Visit
              </CardTitle>
              <CardDescription>Upcoming schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.pending > 0 ? "Today" : "None"}</div>
              <p className="text-sm text-muted-foreground">Planned verification</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
                Active Requests
              </CardTitle>
              <CardDescription>In progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statusCounts.pending + statusCounts.underReview + statusCounts.awaitingApproval}
              </div>
              <Progress 
                value={(statusCounts.pending + statusCounts.underReview + statusCounts.awaitingApproval) / 
                  (totalRequests || 1) * 100} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck2 className="mr-2 h-5 w-5 text-green-500" />
                Completed
              </CardTitle>
              <CardDescription>Successfully fulfilled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.completed}</div>
              <Progress 
                value={statusCounts.completed / (totalRequests || 1) * 100} 
                className="h-2 mt-2 bg-muted" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                Response Time
              </CardTitle>
              <CardDescription>Average processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.2 days</div>
              <p className="text-sm text-muted-foreground">-0.8 days from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                Next Steps
              </CardTitle>
              <CardDescription>Upcoming activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalRequests > 0 ? 3 : 0}</div>
              <p className="text-sm text-muted-foreground">Tasks requiring attention</p>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.first_name || 'User'}
          </p>
        </div>

        {renderAdminContent()}

        <RoleBasedWorkflow 
          userProfile={userProfile} 
          permissions={permissions} 
          statusCounts={statusCounts} 
        />

        {renderRoleSpecificCards()}
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            {totalRequests > 0 ? (
              <div className="space-y-4">
                {filteredRequests.slice(0, 3).map((request, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 border rounded-md">
                    <Bookmark className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">{request.title || 'Untitled Request'}</div>
                      <div className="text-sm text-muted-foreground">
                        Status updated to <span className="font-medium">{request.status.replace('_', ' ')}</span>
                        {' • '} {new Date(request.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No recent activity to display</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
