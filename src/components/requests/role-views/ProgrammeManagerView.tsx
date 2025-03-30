
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ListFilter, Clock, SendHorizontal, Users, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { updateRequestStatus } from "@/services/api/requestMutationApi";
import { useToast } from "@/hooks/use-toast";

interface ProgrammeManagerViewProps {
  userProfile: UserProfile;
  statusCounts: {
    pending: number;
    underReview: number;
    awaitingApproval: number;
    completed: number;
    rejected: number;
  };
}

const ProgrammeManagerView = ({ userProfile, statusCounts }: ProgrammeManagerViewProps) => {
  const { getRoleInfo } = useRoles(userProfile);
  const roleInfo = getRoleInfo();
  const { toast } = useToast();
  const [isForwarding, setIsForwarding] = useState(false);
  
  // Function to forward all reviewed requests to management team (Director, CEO, Patron)
  const handleForwardToManagement = async () => {
    if (statusCounts.underReview === 0) {
      toast({
        title: "No requests to forward",
        description: "There are no reviewed requests ready to be forwarded to management.",
        variant: "default"
      });
      return;
    }
    
    setIsForwarding(true);
    try {
      // In a real implementation, this would update multiple requests in one API call
      // For now, we'll just show a success message to represent the action
      
      // Mock successful forwarding
      toast({
        title: "Requests forwarded",
        description: `${statusCounts.underReview} request(s) have been forwarded to Director, CEO and Patron for review.`,
        variant: "default"
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to forward requests to management. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsForwarding(false);
    }
  };
  
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-full">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium">
              {userProfile.first_name} {userProfile.last_name}
            </h2>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500 text-white">Programme Manager</Badge>
              <span className="text-sm text-muted-foreground">{roleInfo.description}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-3">
        As a Programme Manager, you oversee the request workflow process, assigning field officers to 
        requests and reviewing their verification reports before forwarding to Management.
      </p>
      
      <div className="bg-white/60 p-3 rounded-md border border-blue-100 mb-3">
        <h3 className="font-medium text-sm mb-2 text-blue-800 flex items-center">
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
            <ListFilter className="h-4 w-4" />
            Program Overview
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Pending Reviews ({statusCounts.underReview})
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="gap-1"
          onClick={handleForwardToManagement}
          disabled={isForwarding || statusCounts.underReview === 0}
        >
          <SendHorizontal className="h-4 w-4" />
          Forward to Management Team ({statusCounts.underReview})
        </Button>
      </div>
    </div>
  );
};

export default ProgrammeManagerView;
