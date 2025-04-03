
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";

interface EmptyRequestsStateProps {
  searchTerm?: string;
}

const EmptyRequestsState = ({ searchTerm }: EmptyRequestsStateProps) => {
  const { userProfile } = useAuth();
  const { isRegularUser } = useRoles(userProfile);
  
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
      ) : isRegularUser() ? (
        <p className="text-muted-foreground mb-6">
          You haven't submitted any requests yet
        </p>
      ) : (
        <p className="text-muted-foreground mb-6">
          There are no requests to review at this time
        </p>
      )}
      
      {/* Only show Create New Request button for regular users */}
      {isRegularUser() && (
        <Button asChild>
          <Link to="/chat">Create New Request</Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyRequestsState;
