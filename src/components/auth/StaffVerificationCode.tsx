
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StaffVerificationCodeProps {
  adminCode: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFirstTimeSetup: boolean;
}

const StaffVerificationCode = ({ 
  adminCode, 
  handleChange, 
  isFirstTimeSetup 
}: StaffVerificationCodeProps) => {
  if (isFirstTimeSetup) {
    return (
      <div className="p-3 rounded-md bg-blue-100 text-blue-800 text-sm mb-4">
        First-time setup detected. You will be registered as the initial Director.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="adminCode">Staff Verification Code</Label>
      <Input
        id="adminCode"
        name="adminCode"
        type="text"
        placeholder="Enter staff verification code"
        value={adminCode}
        onChange={handleChange}
        required
      />
      <p className="text-xs text-muted-foreground">
        Please enter the staff verification code provided by the system administrator.
      </p>
    </div>
  );
};

export default StaffVerificationCode;
