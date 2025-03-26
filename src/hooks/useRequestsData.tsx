
import { useState, useEffect, useMemo } from "react";
import { Request, RequestStatus } from "@/types";
import { getUserRequests, searchRequests } from "@/services/requestService";
import { useToast } from "@/hooks/use-toast";

export const useRequestsData = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    field: keyof Request;
    direction: "asc" | "desc";
  }>({ field: "createdAt", direction: "desc" });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getUserRequests();
      setRequests(data);
      applyFiltersAndSort(data, activeFilter, sortConfig.field, sortConfig.direction);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to load requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (
    requestsToFilter: Request[],
    filter: string,
    sortField: keyof Request,
    sortDirection: "asc" | "desc"
  ) => {
    // First apply filters
    let result = [...requestsToFilter];
    
    if (filter !== "all") {
      if (filter === "active") {
        result = result.filter(request => 
          ["submitted", "assigned", "under_review", "manager_review"].includes(request.status)
        );
      } else if (filter === "completed") {
        result = result.filter(request => 
          ["completed", "forwarded"].includes(request.status)
        );
      } else if (filter === "rejected") {
        result = result.filter(request => 
          request.status === "rejected"
        );
      } else {
        // If filter is a specific status
        result = result.filter(request => request.status === filter as RequestStatus);
      }
    }
    
    // Then sort the filtered results
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredRequests(result);
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      applyFiltersAndSort(requests, activeFilter, sortConfig.field, sortConfig.direction);
      return;
    }

    try {
      setLoading(true);
      const results = await searchRequests(term);
      applyFiltersAndSort(results, activeFilter, sortConfig.field, sortConfig.direction);
    } catch (error) {
      console.error("Error searching requests:", error);
      toast({
        title: "Error",
        description: "Failed to search requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    applyFiltersAndSort(requests, filter, sortConfig.field, sortConfig.direction);
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
    const newSortConfig = {
      field: field as keyof Request,
      direction
    };
    setSortConfig(newSortConfig);
    applyFiltersAndSort(
      filteredRequests, 
      activeFilter, 
      newSortConfig.field, 
      newSortConfig.direction
    );
  };

  return {
    requests,
    filteredRequests,
    loading,
    activeFilter,
    searchTerm,
    handleSearch,
    handleFilter,
    handleSort
  };
};
