
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Auto redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      toast({
        title: "Development Mode",
        description: "Authentication is disabled for development."
      });
      navigate('/requests');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card>
          <div className="absolute top-4 left-4">
            <Button 
              variant="outline" 
              size="icon" 
              asChild 
              className="rounded-full"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Development Mode</CardTitle>
            <CardDescription className="text-center">
              Authentication is disabled. You'll be auto-redirected...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 text-center">
              <p className="mb-4">Registration is bypassed in development mode.</p>
              <p className="text-sm text-muted-foreground">Use the Role Switcher in the bottom right corner to change user roles.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-primary flex items-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
