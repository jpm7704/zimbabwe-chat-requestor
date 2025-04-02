
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface UserStatsSummaryProps {
  statusCounts: {
    pending: number;
    underReview: number;
    awaitingApproval: number;
    completed: number;
    rejected: number;
  };
}

const UserStatsSummary = ({ statusCounts }: UserStatsSummaryProps) => {
  const { userProfile } = useAuth();
  
  // Determine if this is a management role for custom labels
  const isManagementRole = () => {
    if (!userProfile || !userProfile.role) return false;
    
    const managementRoles = [
      'head_of_department', 
      'head_of_programs', 
      'hop', 
      'programme_manager',
      'director',
      'management',
      'ceo',
      'patron'
    ];
    
    return managementRoles.includes(userProfile.role.toLowerCase());
  };

  // Get role-appropriate labels
  const getPendingLabel = () => {
    return isManagementRole() ? "Awaiting Review" : "Pending";
  };
  
  const getSubtitleText = () => {
    return isManagementRole() ? "Requests to process" : "Requests being processed";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            {getPendingLabel()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{statusCounts.pending + statusCounts.underReview}</div>
          <p className="text-sm text-muted-foreground">{getSubtitleText()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
            Approved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{statusCounts.completed}</div>
          <p className="text-sm text-muted-foreground">Successfully completed</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            Rejected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{statusCounts.rejected}</div>
          <p className="text-sm text-muted-foreground">Requests not approved</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsSummary;
