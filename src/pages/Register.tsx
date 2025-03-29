
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, devSignedOut } = useAuth();
  
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const [checkingFirstTimeSetup, setCheckingFirstTimeSetup] = useState(true);

  useEffect(() => {
    const checkForAdmins = async () => {
      try {
        const { data, error, count } = await supabase
          .from('user_profiles')
          .select('id', { count: 'exact' })
          .eq('role', 'director');

        if (error) throw error;
        
        setIsFirstTimeSetup(count === 0);
      } catch (error) {
        console.error("Error checking for admin accounts:", error);
      } finally {
        setCheckingFirstTimeSetup(false);
      }
    };

    checkForAdmins();
  }, []);

  // Only redirect if authenticated and not in dev mode
  useEffect(() => {
    if (isAuthenticated && !devSignedOut) {
      navigate('/requests');
    }
  }, [isAuthenticated, navigate, devSignedOut]);

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
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Register to access the BGF Zimbabwe support portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {devSignedOut ? (
              <div className="text-center p-4">
                <p className="mb-4">Development mode is active. Registration is bypassed.</p>
                <Button 
                  onClick={() => navigate("/login")}
                  className="w-full"
                >
                  Go to Development Login
                </Button>
              </div>
            ) : (
              <RegisterForm 
                isFirstTimeSetup={isFirstTimeSetup}
                checkingFirstTimeSetup={checkingFirstTimeSetup}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-primary flex items-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Already have an account? Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
