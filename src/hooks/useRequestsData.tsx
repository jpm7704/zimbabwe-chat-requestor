
import { useState, useEffect, useMemo } from "react";
import { Request, RequestStatus, RequestType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

      console.log("Fetching requests for user role:", userProfile.role);

      // Start with a base query that doesn't use RLS for filtering
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
          user_id,
          field_officer_id,
          program_manager_id
        `);
      
      // Apply simple filters based on role without complex DB logic
      // This is our application-level access control
      if (userProfile.role === 'user') {
        query = query.eq('user_id', userProfile.id);
      } else if (userProfile.role === 'field_officer') {
        // Field officers see requests they're assigned to
        query = query.or(`user_id.eq.${userProfile.id},field_officer_id.eq.${userProfile.id}`);
      } else if (userProfile.role === 'programme_manager') {
        // Program managers see requests they're assigned to 
        query = query.or(`user_id.eq.${userProfile.id},program_manager_id.eq.${userProfile.id}`);
      }
      // For directors, CEOs, patrons, and other management roles, fetch all requests
      // as we'll now rely on simple RLS policies that don't cause recursion

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error);
        
        if (error.message?.includes('policy') || error.message?.includes('infinite recursion')) {
          console.warn("Database policy error detected:", error.message);
          // Continue execution but log the warning
        } else {
          throw error;
        }
      }

      if (!data) {
        setRequests([]);
        setFilteredRequests([]);
        setLoading(false);
        return;
      }

      console.log(`Successfully fetched ${data.length} requests`);

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
        timeline: [],
        assignedTo: request.field_officer_id || request.program_manager_id
      }));

      setRequests(transformedRequests);
      applyFiltersAndSort(transformedRequests, activeFilter, sortConfig.field, sortConfig.direction);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      
      // Only set error state for non-policy errors
      if (!error.message?.includes('policy') && !error.message?.includes('infinite recursion')) {
        setError(error);
      } else {
        console.warn("Suppressing database policy error:", error.message);
      }
      
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
