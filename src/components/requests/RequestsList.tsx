
import { Request } from "@/types";
import RequestCard from "@/components/requests/RequestCard";
import RequestsLoadingState from "@/components/requests/RequestsLoadingState";
import EmptyRequestsState from "@/components/requests/EmptyRequestsState";
import { AlertCircle, Settings, Database, RefreshCw } from "lucide-react";
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
  
  // In development, don't show database policy errors - app will still function
  const isDatabasePolicyError = error && (
    error.message?.includes('policy') || 
    error.message?.includes('infinite recursion')
  );
  
  // Only show error UI for non-database policy errors
  if (error && !isDatabasePolicyError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading requests</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{error.message || "Failed to load requests. Please try again later."}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Try again
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1" 
              onClick={() => navigate("/")}
            >
              Return to home
            </Button>
          </div>
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
