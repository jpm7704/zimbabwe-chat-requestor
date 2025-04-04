import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SystemSettingsForm } from "@/components/forms/SystemSettingsForm";
import { Badge } from "@/components/ui/badge";
import { Check, CloudOff, Database, Mail, RefreshCw, Save, Server, Shield } from "lucide-react";
import ClearDatabaseButton from "@/components/admin/ClearDatabaseButton";
import { Trash2 } from 'lucide-react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();

  const handleSaveSettings = (data: any) => {
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully saved."
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache cleared",
      description: "System cache has been cleared successfully."
    });
  };

  const handleBackupDatabase = () => {
    toast({
      title: "Database backup",
      description: "Database backup process started. You will be notified when complete."
    });
  };

  const handleTestEmail = () => {
    toast({
      title: "Test email sent",
      description: "A test email has been sent to the administrator address."
    });
  };

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Server className="h-4 w-4" />
            System: Online
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            DB Connected
          </Badge>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure application behavior and defaults</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemSettingsForm 
                onSubmit={handleSaveSettings} 
                initialData={{
                  appName: "BGF Application",
                  defaultCurrency: "USD",
                  timezone: "Africa/Harare",
                  dateFormat: "DD-MM-YYYY",
                  defaultLanguage: "en"
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure email sending settings</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemSettingsForm 
                onSubmit={handleSaveSettings} 
                initialData={{
                  smtpServer: "smtp.example.com",
                  smtpPort: "587",
                  smtpUser: "notifications@example.com",
                  fromEmail: "noreply@example.com",
                  adminEmail: "admin@example.com"
                }}
              />
              <div className="mt-6">
                <Button onClick={handleTestEmail} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options for the application</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemSettingsForm 
                onSubmit={handleSaveSettings} 
                initialData={{
                  sessionTimeout: "60",
                  maxLoginAttempts: "5",
                  passwordMinLength: "8",
                  requirePasswordReset: "90",
                  twoFactorAuth: "optional"
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>System maintenance operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw className="h-12 w-12 text-muted-foreground" />
                      <h3 className="font-medium text-lg">Clear System Cache</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Clear all cached data to refresh the system
                      </p>
                      <Button onClick={handleClearCache} className="mt-2">Clear Cache</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-4">
                      <Database className="h-12 w-12 text-muted-foreground" />
                      <h3 className="font-medium text-lg">Backup Database</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Create a backup of the entire database
                      </p>
                      <Button onClick={handleBackupDatabase} className="mt-2">Start Backup</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-destructive/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <CloudOff className="h-12 w-12 text-destructive" />
                    <h3 className="font-medium text-lg">Maintenance Mode</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Put the application in maintenance mode, blocking all user access
                    </p>
                    <div className="flex gap-4">
                      <Button variant="destructive" className="mt-2">
                        Enable Maintenance Mode
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <Trash2 className="h-12 w-12 text-destructive" />
                    <h3 className="font-medium text-lg">Clear All Application Data</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Permanently delete all application data including users, requests, and other records
                    </p>
                    <div className="flex gap-4 mt-2">
                      <ClearDatabaseButton />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
