
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const StaffVerification = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Auto redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      toast({
        title: "Development Mode",
        description: "Staff verification is bypassed."
      });
      navigate('/dashboard');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Development Mode</CardTitle>
            <CardDescription className="text-center">
              Staff verification is disabled. You'll be auto-redirected...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 text-center">
              <p className="mb-4">Verification is bypassed in development mode.</p>
              <p className="text-sm text-muted-foreground">Use the Role Switcher in the bottom right corner to change user roles.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffVerification;
