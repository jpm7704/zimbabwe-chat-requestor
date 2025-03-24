
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const [checkingFirstTimeSetup, setCheckingFirstTimeSetup] = useState(true);

  // Check if this is first-time setup (no admin accounts exist)
  useEffect(() => {
    const checkForAdmins = async () => {
      try {
        const { data, error, count } = await supabase
          .from('user_profiles')
          .select('id', { count: 'exact' })
          .eq('role', 'management');

        if (error) throw error;
        
        // If there are no management users, this is first-time setup
        setIsFirstTimeSetup(count === 0);
      } catch (error) {
        console.error("Error checking for admin accounts:", error);
      } finally {
        setCheckingFirstTimeSetup(false);
      }
    };

    checkForAdmins();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/requests');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Register to access the BGF Zimbabwe support portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm 
              isFirstTimeSetup={isFirstTimeSetup}
              checkingFirstTimeSetup={checkingFirstTimeSetup}
            />
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
