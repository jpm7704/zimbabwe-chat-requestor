
import { Request } from "@/types";
import RequestCard from "@/components/requests/RequestCard";
import RequestsLoadingState from "@/components/requests/RequestsLoadingState";
import EmptyRequestsState from "@/components/requests/EmptyRequestsState";

interface RequestsListProps {
  requests: Request[];
  loading: boolean;
  searchTerm?: string;
}

const RequestsList = ({ requests, loading, searchTerm }: RequestsListProps) => {
  if (loading) {
    return <RequestsLoadingState />;
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
