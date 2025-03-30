
import { Request } from "@/types";
import RequestCard from "@/components/requests/RequestCard";
import RequestsLoadingState from "@/components/requests/RequestsLoadingState";
import EmptyRequestsState from "@/components/requests/EmptyRequestsState";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RequestsListProps {
  requests: Request[];
  loading: boolean;
  searchTerm?: string;
  error?: Error | null;
}

const RequestsList = ({ requests, loading, searchTerm, error }: RequestsListProps) => {
  if (loading) {
    return <RequestsLoadingState />;
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading requests</AlertTitle>
        <AlertDescription>
          {error.message || "Failed to load requests. Please try again later."}
          {error.message?.includes("policy") && (
            <div className="mt-2 text-sm">
              This appears to be a database configuration issue. Please contact your administrator.
            </div>
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
