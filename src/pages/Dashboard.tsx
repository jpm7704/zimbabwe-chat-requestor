
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useRoles } from "@/hooks/useRoles";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const { userProfile, handleLogout } = useAuth();
  const navigate = useNavigate();
  const { getRoleInfo, isPatron } = useRoles(userProfile);
  const roleInfo = getRoleInfo();

  // Format the user's full name from first_name and last_name
  const fullName = userProfile 
    ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() 
    : 'User';

  // Get user initials for avatar
  const getInitials = () => {
    if (userProfile?.first_name && userProfile?.first_name.length > 0) {
      return userProfile.first_name.charAt(0);
    }
    if (userProfile?.email && userProfile?.email.length > 0) {
      return userProfile.email.charAt(0);
    }
    return 'U';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Welcome, {fullName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userProfile?.avatar_url || undefined} alt={fullName} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                <Badge className={`mt-1 ${roleInfo.badgeClass}`}>{roleInfo.title}</Badge>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="font-medium">Your Role: {roleInfo.title}</h3>
              <p className="text-sm text-muted-foreground">{roleInfo.description}</p>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={() => navigate('/settings')}>
                Manage Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Role Responsibilities Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              {roleInfo.responsibilities.map((responsibility, index) => (
                <li key={index} className="text-sm">{responsibility}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        {/* Quick Actions Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            {/* Only show Request options for non-Patrons */}
            {!isPatron() && (
              <>
                <Button onClick={() => navigate('/submit')} className="justify-start">
                  New Request
                </Button>
                <Button onClick={() => navigate('/requests')} variant="outline" className="justify-start">
                  View Requests
                </Button>
              </>
            )}
            
            {(roleInfo.title === 'Field Officer' || roleInfo.title === 'Project Officer') && (
              <Button onClick={() => navigate('/field-work')} variant="outline" className="justify-start">
                Field Reports
              </Button>
            )}
            
            {(roleInfo.title === 'Director' || roleInfo.title === 'Head of Programs' || roleInfo.title === 'CEO') && (
              <Button onClick={() => navigate('/analytics')} variant="outline" className="justify-start">
                Analytics Dashboard
              </Button>
            )}
            
            {(roleInfo.title === 'Director' || roleInfo.title === 'CEO' || roleInfo.title === 'Patron') && (
              <Button onClick={() => navigate('/approvals')} variant="outline" className="justify-start">
                Pending Approvals
              </Button>
            )}
            
            <Button onClick={handleLogout} variant="outline" className="justify-start text-destructive hover:text-destructive">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
