
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, KeyRound, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    adminCode: ""
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions");
      toast({
        title: "Terms required",
        description: "You must agree to the terms and conditions.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Determine the role based on conditions
      let userRole = "user"; // Default role
      
      // For first-time setup or valid admin code
      if (activeTab === "admin") {
        // First-time setup - allow admin registration without code
        if (isFirstTimeSetup) {
          userRole = "management";
        } 
        // Verify admin code - this is a simplified example
        else if (formData.adminCode === "BGF-ADMIN-2024") {
          userRole = "management";
        } else {
          throw new Error("Invalid admin verification code");
        }
      }
      
      // Register the user with the determined role
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: userRole
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: userRole === "management" ? "Admin account created" : "Account created",
        description: "Your BGF Zimbabwe account has been created. You can now log in."
      });
      
      navigate("/requests");
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to create account.");
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
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
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Register to access the BGF Zimbabwe support portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tab selector for regular or admin registration */}
            <Tabs defaultValue="user" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User size={16} />
                  <span>Regular User</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <KeyRound size={16} />
                  <span>Admin Setup</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm mb-4">
                  {error}
                </div>
              )}

              {/* First-time setup notice */}
              {activeTab === "admin" && isFirstTimeSetup && (
                <div className="p-3 rounded-md bg-blue-100 text-blue-800 text-sm mb-4">
                  First-time setup detected. You will be registered as the initial admin user.
                </div>
              )}
              
              {/* Admin verification code input */}
              {activeTab === "admin" && !isFirstTimeSetup && (
                <div className="space-y-2">
                  <Label htmlFor="adminCode">Admin Verification Code</Label>
                  <Input
                    id="adminCode"
                    name="adminCode"
                    type="text"
                    placeholder="Enter admin code"
                    value={formData.adminCode}
                    onChange={handleChange}
                    required={activeTab === "admin"}
                  />
                  <p className="text-xs text-muted-foreground">
                    Please enter the admin verification code provided by the system administrator.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
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
                <Label htmlFor="confirmPassword">Confirm password</Label>
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
              
              {activeTab === "user" && (
                <div className="text-sm text-muted-foreground">
                  All new accounts are registered as general requesters. To request staff access, please contact the administrator after registration.
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    terms and conditions
                  </Link>
                </label>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || (activeTab === "admin" && !isFirstTimeSetup && !formData.adminCode)}
              >
                {loading ? "Creating account..." : activeTab === "admin" ? "Create Admin Account" : "Create User Account"}
              </Button>
            </form>
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
