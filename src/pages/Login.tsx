
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Mail, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isAuthenticated, 
    devSignedOut, 
    handleDevLogin, 
    selectedRole, 
    setSelectedRole 
  } = useAuth();
  
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available roles for development mode
  const availableRoles = [
    { value: "user", label: "Regular User" },
    { value: "field_officer", label: "Field Officer" },
    { value: "project_officer", label: "Project Officer" },
    { value: "assistant_project_officer", label: "Assistant Project Officer" },
    { value: "head_of_programs", label: "Head of Programs" },
    { value: "director", label: "Director" },
    { value: "ceo", label: "CEO" },
    { value: "patron", label: "Patron" },
  ];

  useEffect(() => {
    const verificationSuccess = searchParams.get('verification_success');
    if (verificationSuccess === 'true') {
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified. You can now log in.",
      });
    }
  }, [searchParams, toast]);

  // Only redirect if authenticated and not in dev mode
  useEffect(() => {
    if (isAuthenticated && !devSignedOut) {
      navigate('/requests');
    }
  }, [isAuthenticated, navigate, devSignedOut]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Development mode login
    if (devSignedOut) {
      handleDevLogin(selectedRole);
      toast({
        title: "Development login",
        description: `Logged in as ${selectedRole} role.`
      });
      navigate("/requests");
      return;
    }
    
    // Regular authentication flow
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back to BGF Zimbabwe support portal."
      });
      
      navigate("/requests");
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMsg = error.message || "Failed to sign in. Please check your credentials.";
      if (error.message.includes("Email not confirmed")) {
        errorMsg = "Please verify your email before logging in. Check your inbox for the verification link.";
      }
      
      setError(errorMsg);
      toast({
        title: "Login failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to resend verification.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: window.location.origin + "/login"
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error: any) {
      console.error("Resend verification error:", error);
      toast({
        title: "Failed to resend",
        description: error.message || "An error occurred while resending verification email.",
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
            <CardTitle className="text-2xl font-bold text-center">
              {devSignedOut ? "Development Mode Login" : "Sign in to your account"}
            </CardTitle>
            <CardDescription className="text-center">
              {devSignedOut 
                ? "Select a role to test different user experiences" 
                : "Enter your credentials to access your BGF Zimbabwe account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm mb-4">
                  {error}
                  {error.includes("verify your email") && (
                    <Button
                      type="button" 
                      variant="link" 
                      className="px-0 py-1 h-auto text-destructive font-semibold"
                      onClick={handleResendVerification}
                      disabled={loading}
                    >
                      Resend verification email
                    </Button>
                  )}
                </div>
              )}

              {/* Development Mode Role Selection */}
              {devSignedOut && (
                <div className="space-y-3">
                  <Label>Select Role</Label>
                  <RadioGroup 
                    value={selectedRole} 
                    onValueChange={setSelectedRole}
                    className="flex flex-col space-y-1"
                  >
                    {availableRoles.map(role => (
                      <div key={role.value} className="flex items-center space-x-2 rounded-md border p-2">
                        <RadioGroupItem value={role.value} id={role.value} />
                        <Label htmlFor={role.value} className="flex-grow cursor-pointer">{role.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button
                    type="submit"
                    className="w-full mt-4 flex items-center justify-center"
                  >
                    <UserCheck size={16} className="mr-2" />
                    Login as {availableRoles.find(r => r.value === selectedRole)?.label || selectedRole}
                  </Button>
                </div>
              )}

              {/* Regular Login Form */}
              {!devSignedOut && (
                <>
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
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </>
              )}
            </form>
            
            {!devSignedOut && (
              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={handleResendVerification}
                  disabled={loading || !formData.email}
                >
                  <Mail size={16} />
                  Resend verification email
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              {devSignedOut ? (
                <span>This is a development mode without actual authentication</span>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Register now <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
