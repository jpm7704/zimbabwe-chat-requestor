
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const StaffVerification = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, isAuthenticated, loading } = useAuth();
  
  const [verificationCode, setVerificationCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Redirect if user is already verified or not logged in
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      
      // If user is already verified as staff, redirect to dashboard
      if (userProfile?.role && userProfile.role !== "user") {
        navigate("/dashboard");
      }
    }
  }, [userProfile, isAuthenticated, loading, navigate]);

  const handleSendVerificationCode = async () => {
    setErrorMessage("");
    
    if (!userProfile?.email) {
      toast({
        title: "Error",
        description: "Your account email is not available",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Call the edge function to send verification email
      const { data, error } = await supabase.functions.invoke("send-verification-code", {
        body: { email: userProfile.email },
      });
      
      if (error) throw error;
      
      setVerificationSent(true);
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code"
      });
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      setErrorMessage(error.message || "Failed to send verification code");
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!verificationCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Verify the code
      const { data, error } = await supabase.functions.invoke("verify-staff-code", {
        body: { 
          code: verificationCode,
          userId: userProfile?.id
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification successful",
        description: "Your staff account has been verified"
      });
      
      // Reload user session to get updated claims
      await supabase.auth.refreshSession();
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Verification error:", error);
      setErrorMessage(error.message || "Invalid verification code");
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
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
              onClick={() => navigate(-1)}
            >
              <div>
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Button>
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Staff Verification</CardTitle>
            <CardDescription className="text-center">
              Verify your staff status to access staff features
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleVerifyCode} className="space-y-4">
              {!verificationSent ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You've registered as a staff member. To complete your registration,
                    please request a verification code that will be sent to your work email address.
                  </p>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleSendVerificationCode}
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send Verification Code"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      placeholder="Enter the 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the verification code sent to your email
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact your administrator.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StaffVerification;
