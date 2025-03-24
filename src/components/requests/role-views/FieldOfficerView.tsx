
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ListFilter, Clock, FileCheck, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";

interface FieldOfficerViewProps {
  userProfile: UserProfile;
  statusCounts: {
    pending: number;
    underReview: number;
    awaitingApproval: number;
    completed: number;
    rejected: number;
  };
}

const FieldOfficerView = ({ userProfile, statusCounts }: FieldOfficerViewProps) => {
  const { getRoleInfo } = useRoles(userProfile);
  const roleInfo = getRoleInfo();
  
  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-100 rounded-full">
            <FileText className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium">
              {userProfile.first_name} {userProfile.last_name}
            </h2>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500 text-white">Field Officer</Badge>
              <span className="text-sm text-muted-foreground">{roleInfo.description}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-3">
        As a Field Officer, you are responsible for conducting due diligence and verification of assistance requests 
        assigned to you by the Programme Manager.
      </p>
      
      <div className="bg-white/60 p-3 rounded-md border border-yellow-100 mb-3">
        <h3 className="font-medium text-sm mb-2 text-yellow-800 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Your Key Responsibilities:
        </h3>
        <ol className="list-decimal ml-6 text-sm text-muted-foreground">
          {roleInfo.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ol>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/field-work" className="flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            My Assigned Requests
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Pending Verifications ({statusCounts.underReview})
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link to="/reports" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 mr-1" />
            Submit Verification Reports
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FieldOfficerView;
