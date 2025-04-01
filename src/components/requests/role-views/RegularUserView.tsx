
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, HelpCircle, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";

interface RegularUserViewProps {
  userProfile: UserProfile;
}

const RegularUserView = ({ userProfile }: RegularUserViewProps) => {
  const { getRoleInfo } = useRoles(userProfile);
  const roleInfo = getRoleInfo();
  
  return (
    <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium">
              {userProfile.first_name} {userProfile.last_name}
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20">Beneficiary</Badge>
              <span className="text-sm text-muted-foreground">{roleInfo.description}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-3">
        As a beneficiary, you can submit assistance requests which will be processed through our verification 
        and approval workflow to ensure timely and appropriate support.
      </p>
      
      <div className="bg-white/60 p-3 rounded-md border border-primary/10 mb-3">
        <h3 className="font-medium text-sm mb-2 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Request Process Flow:
        </h3>
        <ol className="list-decimal ml-6 text-sm text-muted-foreground">
          {roleInfo.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ol>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-3">
        <Button size="sm" variant="secondary" asChild>
          <Link to="/enquiry" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            New Enquiry
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/requests" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            My Requests
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RegularUserView;
