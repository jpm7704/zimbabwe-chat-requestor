
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyRound, User, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import AdminRegistrationFields from "./AdminRegistrationFields";
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
    staffRole: "" // For specific staff roles
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("user");
  const [selectedStaffType, setSelectedStaffType] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const staffRoleOptions = {
    "head_of_programs": "Head of Programs (HOP)",
    "assistant_project_officer": "Assistant Project Officer",
    "regional_project_officer": "Regional Project Officer",
    "director": "Director",
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
    
    setLoading(true);
    setError(null);
    
    try {
      // Determine the role based on conditions
      let userRole = "user"; // Default role
      
      // For staff registrations
      if (activeTab === "admin") {
        // First-time setup - allow admin registration without code
        if (isFirstTimeSetup) {
          userRole = "management"; // Initial admin
        } 
        // Verify admin code for subsequent admin registrations
        else if (formData.adminCode === "BGF-ADMIN-2024") {
          if (selectedStaffType && formData.staffRole) {
            userRole = formData.staffRole; // Specific staff role
          } else {
            userRole = "management"; // Default admin role
          }
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

      {/* Tab selector for regular or admin registration */}
      <Tabs defaultValue="user" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User size={16} />
            <span>Regular User</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Users size={16} />
            <span>Staff Access</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Admin-specific fields */}
      {activeTab === "admin" && (
        <>
          <AdminRegistrationFields 
            isFirstTimeSetup={isFirstTimeSetup}
            formData={formData}
            handleChange={handleChange}
            staffRoleOptions={staffRoleOptions}
            setFormData={setFormData}
            setSelectedStaffType={setSelectedStaffType}
          />
          {!isFirstTimeSetup && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              Staff members must register with an official company email address (@bgfzimbabwe.org, @bgf.org.zw, etc).
            </div>
          )}
        </>
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
      
      <UserAgreement 
        agreedToTerms={agreedToTerms} 
        setAgreedToTerms={setAgreedToTerms} 
      />
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading || (activeTab === "admin" && !isFirstTimeSetup && !formData.adminCode) || (activeTab === "admin" && formData.adminCode && !formData.staffRole)}
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
