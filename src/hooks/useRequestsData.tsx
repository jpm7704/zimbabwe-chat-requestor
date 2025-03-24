
import { useState, useEffect } from "react";
import { Request } from "@/types";
import { getUserRequests, searchRequests } from "@/services/requestService";
import { useToast } from "@/hooks/use-toast";

export const useRequestsData = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getUserRequests();
      setRequests(data);
      setFilteredRequests(data);
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

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredRequests(requests);
      return;
    }

    try {
      setLoading(true);
      const results = await searchRequests(term);
      setFilteredRequests(results);
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
    
    if (filter === "all") {
      setFilteredRequests(requests);
      return;
    }

    const filtered = requests.filter(request => {
      if (filter === "active") {
        return ["submitted", "assigned", "under_review", "manager_review"].includes(request.status);
      }
      if (filter === "completed") {
        return ["completed", "forwarded"].includes(request.status);
      }
      if (filter === "rejected") {
        return request.status === "rejected";
      }
      return false;
    });

    setFilteredRequests(filtered);
  };

  return {
    requests,
    filteredRequests,
    loading,
    activeFilter,
    searchTerm,
    handleSearch,
    handleFilter
  };
};
