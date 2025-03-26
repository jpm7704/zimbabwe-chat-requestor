
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StaffRole {
  role_key: string;
  display_name: string;
  description: string;
}

interface StaffRoleSelectorProps {
  isFirstTimeSetup: boolean;
  formData: {
    staffRole: string;
    staffNumber: string;
    region: string;
    adminCode: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    adminCode: string;
    staffRole: string;
    staffNumber: string;
    region: string;
  }>>;
}

const StaffRoleSelector = ({ 
  isFirstTimeSetup, 
  formData, 
  setFormData
}: StaffRoleSelectorProps) => {
  const { toast } = useToast();
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  
  // Fetch staff roles from the database
  useEffect(() => {
    const fetchStaffRoles = async () => {
      setLoadingRoles(true);
      try {
        const { data, error } = await supabase.rpc('get_available_staff_roles');
        if (error) throw error;
        setStaffRoles(data || []);
      } catch (error) {
        console.error("Error fetching staff roles:", error);
        toast({
          title: "Failed to load staff roles",
          description: "Please refresh the page and try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchStaffRoles();
  }, [toast]);

  const handleStaffRoleChange = (value: string) => {
    setFormData(prevState => ({
      ...prevState,
      staffRole: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  // Check if the selected role needs a staff number
  const shouldShowStaffNumber = formData.staffRole === 'director' || 
    formData.staffRole === 'head_of_programs' || 
    formData.staffRole === 'assistant_project_officer' || 
    formData.staffRole === 'regional_project_officer';
  
  // Check if the role is a regional officer (needs region input)
  const isRegionalRole = formData.staffRole === 'regional_project_officer';

  return (
    <>
      {/* Staff role selection */}
      <div className="space-y-2">
        <Label htmlFor="staffRole">Staff Role</Label>
        {loadingRoles ? (
          <div className="flex items-center space-x-2 h-10 border rounded-md px-3">
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading roles...</span>
          </div>
        ) : (
          <Select 
            onValueChange={handleStaffRoleChange}
            value={formData.staffRole}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your staff role" />
            </SelectTrigger>
            <SelectContent>
              {isFirstTimeSetup ? (
                <SelectItem value="director">Director (Management)</SelectItem>
              ) : (
                staffRoles.map((role) => (
                  <SelectItem key={role.role_key} value={role.role_key}>
                    {role.display_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
        <p className="text-xs text-muted-foreground">
          Select your role in the organization
        </p>
      </div>

      {/* Staff Number field - only show for certain roles */}
      {shouldShowStaffNumber && (
        <div className="space-y-2">
          <Label htmlFor="staffNumber">Staff Number</Label>
          <Input
            id="staffNumber"
            name="staffNumber"
            type="number"
            min="1"
            max={formData.staffRole === 'director' ? "5" : 
                 formData.staffRole === 'head_of_programs' ? "1" : 
                 formData.staffRole === 'assistant_project_officer' ? "5" : "4"}
            placeholder={formData.staffRole === 'director' ? "1-5" : 
                        formData.staffRole === 'head_of_programs' ? "1" : 
                        formData.staffRole === 'assistant_project_officer' ? "1-5" : "1-4"}
            value={formData.staffNumber}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            {formData.staffRole === 'director' && "Directors are numbered 1-5"}
            {formData.staffRole === 'head_of_programs' && "Head of Programs position"}
            {formData.staffRole === 'assistant_project_officer' && "Assistant Project Officers are numbered 1-5"}
            {formData.staffRole === 'regional_project_officer' && "Regional Project Officers are numbered 1-4"}
          </p>
        </div>
      )}

      {/* Region field - only show for regional project officers */}
      {isRegionalRole && (
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            name="region"
            type="text"
            placeholder="e.g., Harare, Bulawayo, Matabeleland"
            value={formData.region}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            Enter the region you are responsible for
          </p>
        </div>
      )}
    </>
  );
};

export default StaffRoleSelector;
