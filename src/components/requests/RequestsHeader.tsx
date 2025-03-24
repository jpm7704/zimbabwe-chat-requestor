
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface RequestsHeaderProps {
  showNewRequestButton?: boolean;
}

const RequestsHeader = ({ showNewRequestButton = true }: RequestsHeaderProps) => {
  const { userProfile, formatRole } = useAuth();
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Requests</h1>
        <p className="text-muted-foreground">
          {userProfile ? (
            <>
              <span className="font-medium">
                {userProfile.first_name} {userProfile.last_name}
              </span> • <span>{formatRole(userProfile.role || '')}</span>
            </>
          ) : (
            'Track and manage your BGF Zimbabwe support requests'
          )}
        </p>
      </div>
      
      {showNewRequestButton && (
        <Button asChild>
          <Link to="/submit?action=new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Link>
        </Button>
      )}
    </div>
  );
};

export default RequestsHeader;
