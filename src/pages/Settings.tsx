
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Check, Moon, Sun, BellRing, Globe, Lock, User, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { userProfile, loading } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Profile settings
  const [profileForm, setProfileForm] = useState({
    firstName: userProfile?.first_name || "",
    lastName: userProfile?.last_name || "",
    email: userProfile?.email || "",
    region: userProfile?.region || "",
    bio: ""
  });
  
  // Security settings
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Notifications settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    requestUpdates: true,
    systemAnnouncements: true,
    assignmentNotifications: true
  });
  
  // Theme settings
  const [themePreference, setThemePreference] = useState<"light" | "dark" | "system">(
    localStorage.getItem("theme") === "dark" ? "dark" : 
    localStorage.getItem("theme") === "light" ? "light" : "system"
  );
  
  // Regional settings
  const [regionalSettings, setRegionalSettings] = useState({
    timezone: "UTC+2:00",
    language: "English",
    dateFormat: "DD/MM/YYYY"
  });

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle security form changes
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof notificationSettings]
    }));
  };
  
  // Handle theme change
  const handleThemeChange = (value: string) => {
    const theme = value as "light" | "dark" | "system";
    setThemePreference(theme);
    
    // Apply theme
    if (theme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", systemPrefersDark);
      localStorage.removeItem("theme");
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  };
  
  // Save profile changes
  const saveProfileChanges = async () => {
    if (!userProfile?.id) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: profileForm.firstName,
          last_name: profileForm.lastName,
          region: profileForm.region
        })
        .eq('id', userProfile.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Change password
  const changePassword = async () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirmation password must match.",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: securityForm.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully."
      });
      
      // Reset form
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast({
        title: "Password change failed",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Save notification preferences
  const saveNotificationPreferences = () => {
    // In a real app, this would save to the database
    // For now, just show a success toast
    setSaving(true);
    setTimeout(() => {
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved."
      });
      setSaving(false);
    }, 500);
  };
  
  // Save regional preferences
  const saveRegionalPreferences = () => {
    // In a real app, this would save to the database
    setSaving(true);
    setTimeout(() => {
      toast({
        title: "Regional settings updated",
        description: "Your regional preferences have been saved."
      });
      setSaving(false);
    }, 500);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-elegant">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="profile" className="mt-6">
          <div className="mb-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden md:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                <span className="hidden md:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span className="hidden md:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="regional" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Regional</span>
              </TabsTrigger>
              {userProfile?.role === 'director' || userProfile?.role === 'head_of_programs' ? (
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="hidden md:inline">Admin</span>
                </TabsTrigger>
              ) : null}
            </TabsList>
          </div>

          {/* 1. Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and how it appears on your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={profileForm.firstName} 
                      onChange={handleProfileChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    disabled
                    value={profileForm.email}
                    onChange={handleProfileChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Email changes require contacting an administrator
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input 
                    id="region" 
                    name="region" 
                    value={profileForm.region}
                    onChange={handleProfileChange}
                    placeholder="Your working region"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveProfileChanges} disabled={saving}>
                  {saving ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 2. Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword"
                      type="password" 
                      value={securityForm.currentPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      name="newPassword"
                      type="password" 
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password" 
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                </div>
                
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Choose a strong password that you don't use for other accounts.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-factor authentication</p>
                      <p className="text-muted-foreground text-sm">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" disabled>Coming Soon</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={changePassword} disabled={saving}>
                  {saving ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 3. Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-muted-foreground text-sm">
                        Receive email notifications for important updates
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications} 
                      onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Request Updates</Label>
                      <p className="text-muted-foreground text-sm">
                        Get notified when your requests are updated
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.requestUpdates} 
                      onCheckedChange={() => handleNotificationToggle('requestUpdates')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Announcements</Label>
                      <p className="text-muted-foreground text-sm">
                        Receive important system-wide announcements
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.systemAnnouncements} 
                      onCheckedChange={() => handleNotificationToggle('systemAnnouncements')}
                    />
                  </div>
                  
                  {(userProfile?.role !== 'user') && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Assignment Notifications</Label>
                        <p className="text-muted-foreground text-sm">
                          Get notified when you're assigned to a request
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.assignmentNotifications} 
                        onCheckedChange={() => handleNotificationToggle('assignmentNotifications')}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveNotificationPreferences} disabled={saving}>
                  {saving ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 4. Theme Settings */}
          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme Mode</Label>
                  <ToggleGroup 
                    type="single" 
                    value={themePreference}
                    onValueChange={(value) => value && handleThemeChange(value)}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="light" aria-label="Light Mode" className="flex gap-2 items-center">
                      <Sun className="h-4 w-4" />
                      Light
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark" aria-label="Dark Mode" className="flex gap-2 items-center">
                      <Moon className="h-4 w-4" />
                      Dark
                    </ToggleGroupItem>
                    <ToggleGroupItem value="system" aria-label="System Mode" className="flex gap-2 items-center">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      System
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="space-y-4">
                  <Label>Font Size</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="text-sm">Small</Button>
                    <Button variant="outline" className="bg-primary/10">Medium</Button>
                    <Button variant="outline" className="text-lg">Large</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Font size preferences will be saved in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 5. Regional Settings */}
          <TabsContent value="regional">
            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>
                  Configure language, timezone and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={regionalSettings.language}
                    onChange={(e) => setRegionalSettings(prev => ({...prev, language: e.target.value}))}
                  >
                    <option value="English">English (UK)</option>
                    <option value="Shona">Shona</option>
                    <option value="Ndebele">Ndebele</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select 
                    id="timezone" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={regionalSettings.timezone}
                    onChange={(e) => setRegionalSettings(prev => ({...prev, timezone: e.target.value}))}
                  >
                    <option value="UTC+2:00">Africa/Harare (UTC+2:00)</option>
                    <option value="UTC+0:00">UTC (GMT)</option>
                    <option value="UTC+1:00">Central European Time (UTC+1:00)</option>
                    <option value="UTC+3:00">East Africa Time (UTC+3:00)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select 
                    id="dateFormat" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={regionalSettings.dateFormat}
                    onChange={(e) => setRegionalSettings(prev => ({...prev, dateFormat: e.target.value}))}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveRegionalPreferences} disabled={saving}>
                  {saving ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Regional Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 6. Admin/Role-specific Settings */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>
                  Advanced settings for administrators and managers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {userProfile?.role === 'director' || userProfile?.role === 'head_of_programs' ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>System Maintenance Mode</Label>
                          <p className="text-muted-foreground text-sm">
                            Disable user access during system maintenance
                          </p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Staff Signup Approval</Label>
                          <p className="text-muted-foreground text-sm">
                            Require approval for new staff accounts
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Debug Logging</Label>
                          <p className="text-muted-foreground text-sm">
                            Record detailed system logs for troubleshooting
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        Access System Administration Panel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      You don't have access to admin settings.
                      Contact your administrator for more information.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Settings;
