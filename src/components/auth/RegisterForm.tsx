import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Import refactored components
import UserTypeSelector from "./UserTypeSelector";
import PersonalInfoFields from "./PersonalInfoFields";
import PasswordFields from "./PasswordFields";
import StaffRoleSelector from "./StaffRoleSelector";
import UserAgreement from "./UserAgreement";

interface RegisterFormProps {
  isFirstTimeSetup: boolean;
  checkingFirstTimeSetup: boolean;
}

const RegisterForm = ({ isFirstTimeSetup, checkingFirstTimeSetup }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
    staffRole: "", 
    staffNumber: "",
    region: ""
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("user");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  // Function to validate staff email domain
  const validateStaffEmail = (email: string): boolean => {
    // List of allowed company domains for staff
    const allowedDomains = ['bgfzimbabwe.org', 'bgf.org.zw', 'bgf.org', 'bgfzim.org'];
    
    if (!email || !email.includes('@')) return false;
    
    const domain = email.split('@')[1].toLowerCase();
    return allowedDomains.includes(domain);
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

    // Validate staff email domains for admin registrations
    if (activeTab === "admin" && !isFirstTimeSetup) {
      if (!validateStaffEmail(formData.email)) {
        setError("Staff must use company email addresses");
        toast({
          title: "Company email required",
          description: "Staff members must register with an official company email address.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (activeTab === "admin") {
      if (!formData.staffRole) {
        setError("Please select a staff role");
        toast({
          title: "Staff role required",
          description: "Please select your role in the organization.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simplify role determination
      let userRole = activeTab === "admin" ? formData.staffRole : "user";
      let staffNumber = null;
      let region = null;
      
      if (activeTab === "admin") {
        staffNumber = parseInt(formData.staffNumber) || null;
        region = formData.region || null;
      }
      
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: userRole,
            staff_number: staffNumber,
            region: region
          },
          emailRedirectTo: window.location.origin + "/login"
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account before logging in."
      });
      
      navigate("/login");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm mb-4">
          {error}
        </div>
      )}

      {/* User type selector (regular user or staff) */}
      <UserTypeSelector 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Staff role selector for admin registrations */}
      {activeTab === "admin" && (
        <>
          {isFirstTimeSetup ? (
            <div className="p-3 rounded-md bg-blue-100 text-blue-800 text-sm mb-4">
              First-time setup detected. You will be registered as the initial Director.
            </div>
          ) : (
            <StaffRoleSelector
              isFirstTimeSetup={isFirstTimeSetup}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          
          {!isFirstTimeSetup && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              Staff members must register with an official company email address (@bgfzimbabwe.org, @bgf.org.zw, etc).
            </div>
          )}
        </>
      )}

      {/* Personal information fields */}
      <PersonalInfoFields
        firstName={formData.firstName}
        lastName={formData.lastName}
        email={formData.email}
        handleChange={handleChange}
      />
      
      {/* Password fields */}
      <PasswordFields
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        handleChange={handleChange}
      />
      
      {activeTab === "user" && (
        <div className="text-sm text-muted-foreground">
          All new accounts are registered as general requesters. To request staff access, please contact the administrator after registration.
        </div>
      )}
      
      {/* Terms and conditions agreement */}
      <UserAgreement 
        agreedToTerms={agreedToTerms} 
        setAgreedToTerms={setAgreedToTerms} 
      />
      
      {/* Submit button */}
      <Button
        type="submit"
        className="w-full"
        disabled={loading || (activeTab === "admin" && !formData.staffRole)}
      >
        {loading ? "Creating account..." : activeTab === "admin" ? "Create Staff Account" : "Create User Account"}
      </Button>
      
      <div className="text-sm text-center text-muted-foreground mt-4">
        A verification email will be sent to confirm your email address.
      </div>
    </form>
  );
};

export default RegisterForm;
