
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserProfileForm } from "@/components/forms/UserProfileForm";
import { PasswordResetForm } from "@/components/forms/PasswordResetForm";
import { NotificationPreferencesForm } from "@/components/forms/NotificationPreferencesForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Clock, FileText, Key, Mail, MapPin, UserRound } from "lucide-react";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
  
  const { userProfile, formatRole } = useAuth();
  const { toast } = useToast();
  
  // Mock user data
  const userActivities = [
    { id: 1, action: "Submitted a new request", target: "Housing assistance", date: "2023-12-01T10:30:00Z" },
    { id: 2, action: "Updated profile information", target: "", date: "2023-11-28T14:15:00Z" },
    { id: 3, action: "Uploaded document", target: "ID verification", date: "2023-11-25T09:45:00Z" },
    { id: 4, action: "Created account", target: "", date: "2023-11-20T11:10:00Z" }
  ];
  
  const userNotificationSettings = {
    email: {
      requestUpdates: true,
      newMessages: true,
      systemAnnouncements: false
    },
    inApp: {
      requestUpdates: true,
      newMessages: true,
      systemAnnouncements: true
    }
  };
  
  const handleProfileUpdate = (data: any) => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated."
    });
    setProfileDialogOpen(false);
  };
  
  const handlePasswordUpdate = (data: any) => {
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed."
    });
    setPasswordDialogOpen(false);
  };
  
  const handleNotificationUpdate = (data: any) => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been saved."
    });
    setNotificationsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userProfile?.avatar_url || ""} alt={`${userProfile?.first_name} ${userProfile?.last_name}`} />
            <AvatarFallback className="text-xl">
              {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{userProfile?.first_name} {userProfile?.last_name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge>{formatRole(userProfile?.role || '')}</Badge>
              {userProfile?.region && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{userProfile?.region}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="ml-auto flex flex-wrap gap-2">
          <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <UserProfileForm 
                onSuccess={handleProfileUpdate} 
                initialData={userProfile || {}} 
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>
              <PasswordResetForm onSuccess={handlePasswordUpdate} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Full Name</h3>
                  <p>{userProfile?.first_name} {userProfile?.last_name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
                  <p>{userProfile?.email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Role</h3>
                  <p>{formatRole(userProfile?.role || '')}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Region</h3>
                  <p>{userProfile?.region || 'Not assigned'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4" />
                      <h4 className="font-medium text-sm text-muted-foreground">Primary Email</h4>
                    </div>
                    <p>{userProfile?.email}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4" />
                      <h4 className="font-medium text-sm text-muted-foreground">Alternative Email</h4>
                    </div>
                    <p className="text-muted-foreground">Not provided</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between flex-wrap gap-4">
              <div className="text-sm text-muted-foreground">
                Last profile update: {new Date().toLocaleDateString()}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setProfileDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <UserRound className="h-4 w-4" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and interactions with the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {userActivities.map((activity) => (
                  <div key={activity.id} className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="md:w-32 text-muted-foreground">
                      {formatDate(activity.date)}
                    </div>
                    <div className="flex-1">
                      <p>
                        <span className="font-medium">{activity.action}</span>
                        {activity.target && <span> - {activity.target}</span>}
                      </p>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" className="h-8 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between flex-wrap gap-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Activity log updated in real time
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Full History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Request updates and status changes</span>
                      <Badge variant={userNotificationSettings.email.requestUpdates ? "default" : "outline"}>
                        {userNotificationSettings.email.requestUpdates ? "On" : "Off"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New messages and comments</span>
                      <Badge variant={userNotificationSettings.email.newMessages ? "default" : "outline"}>
                        {userNotificationSettings.email.newMessages ? "On" : "Off"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>System announcements and news</span>
                      <Badge variant={userNotificationSettings.email.systemAnnouncements ? "default" : "outline"}>
                        {userNotificationSettings.email.systemAnnouncements ? "On" : "Off"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">In-App Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Request updates and status changes</span>
                      <Badge variant={userNotificationSettings.inApp.requestUpdates ? "default" : "outline"}>
                        {userNotificationSettings.inApp.requestUpdates ? "On" : "Off"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New messages and comments</span>
                      <Badge variant={userNotificationSettings.inApp.newMessages ? "default" : "outline"}>
                        {userNotificationSettings.inApp.newMessages ? "On" : "Off"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>System announcements and news</span>
                      <Badge variant={userNotificationSettings.inApp.systemAnnouncements ? "default" : "outline"}>
                        {userNotificationSettings.inApp.systemAnnouncements ? "On" : "Off"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Dialog open={notificationsDialogOpen} onOpenChange={setNotificationsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Edit Notification Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Notification Preferences</DialogTitle>
                  </DialogHeader>
                  <NotificationPreferencesForm 
                    onSuccess={handleNotificationUpdate} 
                    initialData={userNotificationSettings} 
                  />
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
