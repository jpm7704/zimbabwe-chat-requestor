
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface UserAgreementProps {
  agreedToTerms: boolean;
  setAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserAgreement = ({ agreedToTerms, setAgreedToTerms }: UserAgreementProps) => {
  return (
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
  );
};

export default UserAgreement;
