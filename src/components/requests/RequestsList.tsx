
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
  
  if (error) {
    const isPolicyError = error.message?.includes("policy") || 
                         error.message?.includes("infinite recursion");
    const isAuthError = error.message?.includes("auth") || 
                        error.message?.includes("authentication");
    
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading requests</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{error.message || "Failed to load requests. Please try again later."}</p>
          
          {isPolicyError && (
            <div className="text-sm space-y-2">
              <p className="font-medium mb-1">Database configuration issue:</p>
              <p>We're experiencing a technical issue with our database security policies.</p>
              <div className="flex flex-wrap gap-2 mt-3 bg-background/50 p-3 rounded-md border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Database className="h-3 w-3" />
                  <code className="bg-muted px-1 rounded">infinite recursion detected in policy for relation "requests"</code>
                </div>
                <p className="w-full text-xs text-muted-foreground">
                  This is an administrative issue and our database team has been notified.
                </p>
              </div>
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
