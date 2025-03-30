
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ListFilter, Clock, CheckSquare, FileText, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";

interface ManagementViewProps {
  userProfile: UserProfile;
  statusCounts: {
    pending: number;
    underReview: number;
    awaitingApproval: number;
    completed: number;
    rejected: number;
  };
}

const ManagementView = ({ userProfile, statusCounts }: ManagementViewProps) => {
  const { getRoleInfo } = useRoles(userProfile);
  const roleInfo = getRoleInfo();
  
  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-full">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium">
              {userProfile.first_name} {userProfile.last_name}
            </h2>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">Senior Management</Badge>
              <span className="text-sm text-muted-foreground">{roleInfo.description}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-3">
        As a Senior Management member, you have the authority to make final decisions on 
        verified and reviewed assistance requests, ensuring resource allocation aligns with organizational priorities.
      </p>
      
      <div className="bg-white/60 p-3 rounded-md border border-green-100 mb-3">
        <h3 className="font-medium text-sm mb-2 text-green-800 flex items-center">
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
        {userProfile.role === 'director' && (
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              Administration
            </Link>
          </Button>
        )}
        <Button variant="default" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Awaiting Approval ({statusCounts.awaitingApproval})
        </Button>
        <Button variant="outline" size="sm">
          <CheckSquare className="mr-2 h-4 w-4" />
          Approved Requests ({statusCounts.completed})
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4 mr-1" />
            View Reports & Analytics
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ManagementView;
