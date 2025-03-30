import { useState, useEffect, useMemo } from "react";
import { Request, RequestStatus, RequestType } from "@/types";
import { getUserRequests, searchRequests } from "@/services/requestService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useRequestsData = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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
      setError(null);
      
      // If the user is not logged in, return empty array
      if (!userProfile) {
        setRequests([]);
        setFilteredRequests([]);
        setLoading(false);
        return;
      }

      // Use a safer approach that doesn't rely on complex RLS policies
      let query = supabase
        .from('requests')
        .select(`
          id,
          ticket_number,
          title,
          description,
          type,
          status,
          created_at,
          updated_at,
          user_id
        `);

      // Filter by user_id if the user is a regular user
      if (userProfile.role === 'user') {
        query = query.eq('user_id', userProfile.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error);
        
        // Special handling for the infinite recursion RLS error
        if (error.code === '42P17') {
          throw new Error("Database policy error. Please contact your administrator to fix the Row Level Security policy on the requests table.");
        }
        
        throw error;
      }

      if (!data) {
        setRequests([]);
        setFilteredRequests([]);
        return;
      }

      // Transform the data to match our Request type
      const transformedRequests: Request[] = data.map(request => ({
        id: request.id,
        ticketNumber: request.ticket_number,
        userId: request.user_id,
        type: request.type as RequestType,
        title: request.title,
        description: request.description,
        status: request.status as RequestStatus,
        createdAt: request.created_at,
        updatedAt: request.updated_at,
        documents: [],
        notes: [],
        timeline: []
      }));

      setRequests(transformedRequests);
      applyFiltersAndSort(transformedRequests, activeFilter, sortConfig.field, sortConfig.direction);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      setError(error);
      
      // Show a more informative toast message
      toast({
        title: "Error loading requests",
        description: error.message || "Failed to load requests. Please try again or contact support if this persists.",
        variant: "destructive",
      });
      
      // Set empty arrays to prevent UI from breaking
      setRequests([]);
      setFilteredRequests([]);
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
      
      // Filter existing requests based on search term
      const results = requests.filter(request => 
        request.ticketNumber.toLowerCase().includes(term.toLowerCase()) ||
        request.title.toLowerCase().includes(term.toLowerCase()) ||
        request.description.toLowerCase().includes(term.toLowerCase())
      );
      
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
    error,
    activeFilter,
    searchTerm,
    handleSearch,
    handleFilter,
    handleSort,
    refreshRequests: fetchRequests
  };
};
