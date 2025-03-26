
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface StaffRole {
  role_key: string;
  display_name: string;
  description: string;
}

interface AdminRegistrationFieldsProps {
  isFirstTimeSetup: boolean;
  formData: {
    adminCode: string;
    staffRole: string;
    staffNumber: string;
    region: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  staffRoles: StaffRole[];
  loadingRoles: boolean;
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
  setSelectedStaffType: React.Dispatch<React.SetStateAction<string | null>>;
}

const AdminRegistrationFields = ({ 
  isFirstTimeSetup, 
  formData, 
  handleChange, 
  staffRoles,
  loadingRoles,
  setFormData,
  setSelectedStaffType
}: AdminRegistrationFieldsProps) => {
  return (
    <>
      {/* First-time setup notice */}
      {isFirstTimeSetup && (
        <div className="p-3 rounded-md bg-blue-100 text-blue-800 text-sm mb-4">
          First-time setup detected. You will be registered as the initial Director.
        </div>
      )}
      
      {/* Admin verification code input */}
      {!isFirstTimeSetup && (
        <div className="space-y-2">
          <Label htmlFor="adminCode">Staff Verification Code</Label>
          <Input
            id="adminCode"
            name="adminCode"
            type="text"
            placeholder="Enter staff verification code"
            value={formData.adminCode}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-muted-foreground">
            Please enter the staff verification code provided by the system administrator.
          </p>
        </div>
      )}

      {/* Staff role selection */}
      {(formData.adminCode || isFirstTimeSetup) && (
        <div className="space-y-2">
          <Label htmlFor="staffRole">Staff Role</Label>
          {loadingRoles ? (
            <div className="flex items-center space-x-2 h-10 border rounded-md px-3">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading roles...</span>
            </div>
          ) : (
            <Select 
              onValueChange={(value) => {
                setFormData(prevState => ({
                  ...prevState,
                  staffRole: value
                }));
                setSelectedStaffType(value);
              }}
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
      )}

      {/* Staff Number field - only show for certain roles */}
      {(formData.staffRole === 'director' || 
        formData.staffRole === 'head_of_programs' || 
        formData.staffRole === 'assistant_project_officer' || 
        formData.staffRole === 'regional_project_officer') && (
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
            onChange={handleChange}
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
      {formData.staffRole === 'regional_project_officer' && (
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            name="region"
            type="text"
            placeholder="e.g., Harare, Bulawayo, Matabeleland"
            value={formData.region}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">
            Enter the region you are responsible for
          </p>
        </div>
      )}
    </>
  );
};

export default AdminRegistrationFields;
