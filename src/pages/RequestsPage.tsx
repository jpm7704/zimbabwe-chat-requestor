
import { useRequestsData } from "@/hooks/useRequestsData";
import RequestsHeader from "@/components/requests/RequestsHeader";
import RequestsSearchFilter from "@/components/requests/RequestsSearchFilter";
import RequestCard from "@/components/requests/RequestCard";
import RequestsLoadingState from "@/components/requests/RequestsLoadingState";
import EmptyRequestsState from "@/components/requests/EmptyRequestsState";

const RequestsPage = () => {
  const {
    filteredRequests,
    loading,
    activeFilter,
    handleSearch,
    handleFilter
  } = useRequestsData();

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <RequestsHeader />
      
      <RequestsSearchFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        activeFilter={activeFilter}
      />

      <div className="space-y-4">
        {loading ? (
          <RequestsLoadingState />
        ) : filteredRequests.length === 0 ? (
          <EmptyRequestsState />
        ) : (
          filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
