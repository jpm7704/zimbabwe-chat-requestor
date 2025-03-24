
import { User } from "lucide-react";
import { UserProfile } from "@/hooks/useAuth";

interface FallbackViewProps {
  userProfile: UserProfile;
}

const FallbackView = ({ userProfile }: FallbackViewProps) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
      <h2 className="text-lg font-medium mb-2 flex items-center">
        <User className="mr-2 h-5 w-5 text-gray-600" />
        {userProfile.first_name} {userProfile.last_name}
      </h2>
      <p className="text-muted-foreground">
        Please contact support to set up your account role correctly.
      </p>
    </div>
  );
};

export default FallbackView;
