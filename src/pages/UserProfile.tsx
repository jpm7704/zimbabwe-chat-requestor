
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserProfileForm } from "@/components/forms/UserProfileForm";
import { PasswordResetForm } from "@/components/forms/PasswordResetForm";
import { NotificationPreferencesForm } from "@/components/forms/NotificationPreferencesForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Key, Bell } from "lucide-react";

const UserProfile = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  const handleProfileUpdate = (data: any) => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated"
    });
  };
  
  const handlePasswordChange = (data: any) => {
    toast({
      title: "Password changed",
      description: "Your password has been successfully updated"
    });
  };
  
  const handleNotificationPreferencesUpdate = (data: any) => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been updated"
    });
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userProfile || !userProfile.name) return "U";
    
    const nameParts = userProfile.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    
    return nameParts[0][0];
  };

  return (
    <div className="container px-4 mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={userProfile?.avatar_url || ""} />
              <AvatarFallback className="text-xl">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Change Avatar</Button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{userProfile?.name || "User Profile"}</h1>
            <p className="text-muted-foreground">{userProfile?.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <Badge variant="secondary" className="capitalize">
                {userProfile?.role?.replace("_", " ") || "User"}
              </Badge>
              {userProfile?.region && (
                <Badge variant="outline">
                  {userProfile.region}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <UserProfileForm 
                onSubmit={handleProfileUpdate} 
                initialData={userProfile || {}} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordResetForm 
                onSubmit={handlePasswordChange} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationPreferencesForm 
                onSubmit={handleNotificationPreferencesUpdate}
                initialData={{
                  email: {
                    requestUpdates: true,
                    newMessages: true,
                    systemAnnouncements: true
                  },
                  inApp: {
                    requestUpdates: true,
                    newMessages: true,
                    systemAnnouncements: true
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
