
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminRegistrationFieldsProps {
  isFirstTimeSetup: boolean;
  formData: {
    adminCode: string;
    staffRole: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  staffRoleOptions: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    adminCode: string;
    staffRole: string;
  }>>;
  setSelectedStaffType: React.Dispatch<React.SetStateAction<string | null>>;
}

const AdminRegistrationFields = ({ 
  isFirstTimeSetup, 
  formData, 
  handleChange, 
  staffRoleOptions,
  setFormData,
  setSelectedStaffType
}: AdminRegistrationFieldsProps) => {
  return (
    <>
      {/* First-time setup notice */}
      {isFirstTimeSetup && (
        <div className="p-3 rounded-md bg-blue-100 text-blue-800 text-sm mb-4">
          First-time setup detected. You will be registered as the initial administrator.
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
          <Select 
            onValueChange={(value) => {
              setFormData({...formData, staffRole: value});
              setSelectedStaffType(value);
            }}
            value={formData.staffRole}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your staff role" />
            </SelectTrigger>
            <SelectContent>
              {isFirstTimeSetup && (
                <SelectItem value="management">Director (Management)</SelectItem>
              )}
              {!isFirstTimeSetup && Object.entries(staffRoleOptions).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select your role in the organization
          </p>
        </div>
      )}
    </>
  );
};

export default AdminRegistrationFields;
