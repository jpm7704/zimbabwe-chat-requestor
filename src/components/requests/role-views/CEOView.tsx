
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight, Users, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";

interface CEOViewProps {
  userProfile: UserProfile;
  statusCounts: {
    pending: number;
    underReview: number;
    awaitingApproval: number;
    completed: number;
    rejected: number;
  };
}

const CEOView = ({ userProfile, statusCounts }: CEOViewProps) => {
  const { getRoleInfo } = useRoles(userProfile);
  const roleInfo = getRoleInfo();
  
  return (
    <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-full">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium">
              {userProfile.first_name} {userProfile.last_name}
            </h2>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500 text-white">Chief Executive Officer</Badge>
              <span className="text-sm text-muted-foreground">{roleInfo.description}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-3">
        As the CEO, you review and approve requests that have been verified by the Head of Programs. 
        Your approval is part of the leadership team's final decision-making process.
      </p>
      
      <div className="bg-white/60 p-3 rounded-md border border-purple-100 mb-3">
        <h3 className="font-medium text-sm mb-2 text-purple-800 flex items-center">
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
          <Link to="/analytics" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Program Overview
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/approvals" className="flex items-center gap-2">
            <Clock className="mr-2 h-4 w-4" />
            Pending Approvals ({statusCounts.awaitingApproval})
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link to="/approvals" className="flex items-center gap-2">
            <CheckCircle className="mr-2 h-4 w-4" />
            Review Requests
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CEOView;
