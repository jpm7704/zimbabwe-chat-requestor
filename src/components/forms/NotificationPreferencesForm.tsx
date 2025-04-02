
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Inbox, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreference {
  requestUpdates: boolean;
  newMessages: boolean;
  systemAnnouncements: boolean;
  [key: string]: boolean;
}

interface NotificationPreferencesData {
  email: NotificationPreference;
  inApp: NotificationPreference;
  [key: string]: NotificationPreference;
}

interface NotificationPreferencesFormProps {
  initialData?: NotificationPreferencesData;
  onSubmit?: (data: NotificationPreferencesData) => void;
}

export const NotificationPreferencesForm = ({ initialData, onSubmit }: NotificationPreferencesFormProps) => {
  const [preferences, setPreferences] = useState<NotificationPreferencesData>(
    initialData || {
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
    }
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleToggle = (channel: string, setting: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [setting]: checked
      }
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(preferences);
      }
      
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved"
      });
      
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="h-5 w-5" />
              <h3 className="text-lg font-medium">Email Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="email-request-updates" className="font-medium">Request Updates</Label>
                  <p className="text-sm text-muted-foreground">Notify when your request status changes</p>
                </div>
                <Switch
                  id="email-request-updates"
                  checked={preferences.email.requestUpdates}
                  onCheckedChange={(checked) => handleToggle("email", "requestUpdates", checked)}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="email-new-messages" className="font-medium">New Messages</Label>
                  <p className="text-sm text-muted-foreground">Email you when you receive new messages</p>
                </div>
                <Switch
                  id="email-new-messages"
                  checked={preferences.email.newMessages}
                  onCheckedChange={(checked) => handleToggle("email", "newMessages", checked)}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="email-system-announcements" className="font-medium">System Announcements</Label>
                  <p className="text-sm text-muted-foreground">Receive important system announcements</p>
                </div>
                <Switch
                  id="email-system-announcements"
                  checked={preferences.email.systemAnnouncements}
                  onCheckedChange={(checked) => handleToggle("email", "systemAnnouncements", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Inbox className="h-5 w-5" />
              <h3 className="text-lg font-medium">In-App Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="app-request-updates" className="font-medium">Request Updates</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for request status changes</p>
                </div>
                <Switch
                  id="app-request-updates"
                  checked={preferences.inApp.requestUpdates}
                  onCheckedChange={(checked) => handleToggle("inApp", "requestUpdates", checked)}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="app-new-messages" className="font-medium">New Messages</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for new messages</p>
                </div>
                <Switch
                  id="app-new-messages"
                  checked={preferences.inApp.newMessages}
                  onCheckedChange={(checked) => handleToggle("inApp", "newMessages", checked)}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="app-system-announcements" className="font-medium">System Announcements</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for system announcements</p>
                </div>
                <Switch
                  id="app-system-announcements"
                  checked={preferences.inApp.systemAnnouncements}
                  onCheckedChange={(checked) => handleToggle("inApp", "systemAnnouncements", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default NotificationPreferencesForm;
