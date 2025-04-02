
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface EmptyRequestsStateProps {
  searchTerm?: string;
}

const EmptyRequestsState = ({ searchTerm }: EmptyRequestsStateProps) => {
  const { userProfile } = useAuth();
  
  // Determine if this is a management role
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

  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No requests found</h3>
      
      {searchTerm ? (
        <p className="text-muted-foreground mb-6">
          Try a different search term
        </p>
      ) : isManagementRole() ? (
        <p className="text-muted-foreground mb-6">
          There are no requests to review at this time
        </p>
      ) : (
        <p className="text-muted-foreground mb-6">
          You haven't submitted any requests yet
        </p>
      )}
      
      {/* Only show Create New Request button for regular users */}
      {!isManagementRole() && (
        <Button asChild>
          <Link to="/chat">Create New Request</Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyRequestsState;
