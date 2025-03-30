
import { Request } from "@/types";
import RequestCard from "@/components/requests/RequestCard";
import RequestsLoadingState from "@/components/requests/RequestsLoadingState";
import EmptyRequestsState from "@/components/requests/EmptyRequestsState";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface RequestsListProps {
  requests: Request[];
  loading: boolean;
  searchTerm?: string;
  error?: Error | null;
  onRetry?: () => void;
}

const RequestsList = ({ requests, loading, searchTerm, error, onRetry }: RequestsListProps) => {
  const navigate = useNavigate();
  
  if (loading) {
    return <RequestsLoadingState />;
  }
  
  if (error) {
    const isPolicyError = error.message?.includes("policy");
    const isAuthError = error.message?.includes("auth") || error.message?.includes("authentication");
    
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading requests</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{error.message || "Failed to load requests. Please try again later."}</p>
          
          {isPolicyError && (
            <div className="text-sm">
              <p className="font-medium mb-1">Troubleshooting:</p>
              <p>This appears to be a database configuration issue with Row Level Security policies.</p>
              <p>The system administrator has been notified and is working on a solution.</p>
            </div>
          )}
          
          {isAuthError && (
            <div className="text-sm">
              <p className="font-medium mb-1">Authentication issue:</p>
              <p>You may need to log in again to continue.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => navigate("/login")}
              >
                Go to login
              </Button>
            </div>
          )}
          
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (requests.length === 0) {
    return <EmptyRequestsState searchTerm={searchTerm} />;
  }
  
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  );
};

export default RequestsList;
