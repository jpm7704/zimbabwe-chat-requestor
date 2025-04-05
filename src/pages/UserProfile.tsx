
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserProfileForm } from "@/components/forms/UserProfileForm";
import { PasswordResetForm } from "@/components/forms/PasswordResetForm";
import { NotificationPreferencesForm } from "@/components/forms/NotificationPreferencesForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Edit, Key, Bell } from "lucide-react";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfile = () => {
  const { userProfile, updateUserProfile, formatRole, updateAvatar, userId, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  // Debug information
  useEffect(() => {
    console.log("UserProfile page - userId:", userId);
    console.log("UserProfile page - userProfile:", userProfile);
    console.log("UserProfile page - loading:", loading);
  }, [userId, userProfile, loading]);

  const handleProfileUpdate = async (data: any) => {
    console.log('Profile update form data:', data);

    if (!userProfile) {
      console.error('No user profile found for update');
      toast({
        title: "Error",
        description: "Could not update profile: User profile not found",
        variant: "destructive",
      });
      return { error: new Error("User profile not found") };
    }

    console.log('Current user profile:', userProfile);
    console.log('User ID for update:', userId);

    try {
      const profileData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        region: data.region,
        staff_number: data.staffNumber
      };

      console.log('Sending profile update with data:', profileData);

      const result = await updateUserProfile(profileData);
      console.log('Profile update result:', result);

      return result;
    } catch (error) {
      console.error('Error in handleProfileUpdate:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred while updating your profile.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const handlePasswordChange = (data: any) => {
    toast({
      title: "Password changed",
      description: "Your password has been successfully updated"
    });

    return { success: true };
  };

  const handleNotificationPreferencesUpdate = (data: any) => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been updated"
    });

    return { success: true };
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userProfile || (!userProfile.first_name && !userProfile.last_name)) return "U";

    const firstInitial = userProfile.first_name ? userProfile.first_name[0] : '';
    const lastInitial = userProfile.last_name ? userProfile.last_name[0] : '';

    if (firstInitial && lastInitial) {
      return `${firstInitial}${lastInitial}`;
    }

    return firstInitial || lastInitial || "U";
  };

  const getFullName = () => {
    if (!userProfile) return "User Profile";
    return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || "User Profile";
  };

  if (loading) {
    return (
      <div className="container px-4 mx-auto py-8 max-w-5xl">
        <div className="animate-pulse space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="flex flex-wrap gap-2 mt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!userProfile || !userId) {
    return (
      <div className="container px-4 mx-auto py-8 max-w-5xl">
        <div className="flex justify-center items-center h-64">
          <p>No profile data available. Please sign in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          <AvatarUpload
            avatarUrl={userProfile.avatar_url}
            userInitials={getUserInitials()}
            userId={userId}
            onAvatarUpdate={updateAvatar}
          />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{getFullName()}</h1>
            <p className="text-muted-foreground">{userProfile.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <Badge variant="secondary" className="capitalize">
                {formatRole(userProfile.role || '') || "User"}
              </Badge>
              {userProfile.region && (
                <Badge variant="outline">
                  {userProfile.region}
                </Badge>
              )}
              {userProfile.staff_number && (
                <Badge variant="outline">
                  Staff #: {userProfile.staff_number}
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
                initialData={userProfile}
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
