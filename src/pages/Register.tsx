
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import UserTypeSelector from "@/components/auth/UserTypeSelector";
import StaffRoleSelector from "@/components/auth/StaffRoleSelector";
import { Checkbox } from "@/components/ui/checkbox";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    staffRole: "",
    staffNumber: "",
    region: "",
    adminCode: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("user");
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const [checkingFirstTimeSetup, setCheckingFirstTimeSetup] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Check if this is the first time setup (no users in the system)
  useEffect(() => {
    const checkFirstTimeSetup = async () => {
      try {
        const { count, error } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          setIsFirstTimeSetup(count === 0);
        }
      } catch (err) {
        console.error("Error checking for first-time setup:", err);
      } finally {
        setCheckingFirstTimeSetup(false);
      }
    };
    
    checkFirstTimeSetup();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast({
        title: "Password mismatch",
        description: "Please ensure both passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions");
      toast({
        title: "Terms agreement required",
        description: "You must agree to the terms and conditions to create an account.",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === "staff" && !formData.staffRole) {
      setError("Please select a staff role");
      toast({
        title: "Role selection required",
        description: "Please select your staff role to continue.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Determine user role based on tab and selection
      let userRole = "user";
      let staffNumber = null;
      let region = null;
      
      if (activeTab === "staff") {
        userRole = formData.staffRole || "field_officer";
        staffNumber = formData.staffNumber ? parseInt(formData.staffNumber) : null;
        region = formData.region || null;
      }
      
      console.log("Registering with role:", userRole);
      
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            name: `${formData.firstName} ${formData.lastName}`, // Also store as name for compatibility
            role: userRole, // Store the selected role
            staff_number: staffNumber,
            region: region
          }
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
        variant: "default"
      });
      
      navigate("/login");
      
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTypeSelector activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {activeTab === "staff" && (
                <StaffRoleSelector
                  isFirstTimeSetup={isFirstTimeSetup}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || (activeTab === "staff" && !formData.staffRole)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  activeTab === "staff" ? "Create Staff Account" : "Create User Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
