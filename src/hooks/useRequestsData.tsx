
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
      
      // Apply initial filter based on current activeFilter
      const initialFilteredRequests = applyFilter(transformedRequests, activeFilter);
      
      // Apply search if there's a search term
      const searchedRequests = searchTerm 
        ? applySearch(initialFilteredRequests, searchTerm)
        : initialFilteredRequests;
        
      // Apply sort
      applySort(searchedRequests, sortConfig.field, sortConfig.direction);
      
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

  const applyFilter = (requestsToFilter: Request[], filter: string) => {
    if (filter === "all") {
      return [...requestsToFilter];
    }
    
    if (filter === "active") {
      return requestsToFilter.filter(request => 
        ["submitted", "assigned", "under_review", "manager_review"].includes(request.status)
      );
    }
    
    if (filter === "completed") {
      return requestsToFilter.filter(request => 
        ["completed", "forwarded"].includes(request.status)
      );
    }
    
    if (filter === "rejected") {
      return requestsToFilter.filter(request => 
        request.status === "rejected"
      );
    }
    
    // If filter is a specific status
    return requestsToFilter.filter(request => request.status === filter as RequestStatus);
  };
  
  const applySearch = (requestsToFilter: Request[], term: string) => {
    if (!term.trim()) return requestsToFilter;
    
    const normalizedTerm = term.toLowerCase().trim();
    return requestsToFilter.filter(request => 
      request.ticketNumber.toLowerCase().includes(normalizedTerm) ||
      request.title.toLowerCase().includes(normalizedTerm) ||
      request.description.toLowerCase().includes(normalizedTerm)
    );
  };
  
  const applySort = (
    requestsToSort: Request[],
    sortField: keyof Request,
    sortDirection: "asc" | "desc"
  ) => {
    const sorted = [...requestsToSort].sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredRequests(sorted);
  };

  const applyFiltersAndSort = (
    requestsToFilter: Request[],
    filter: string,
    sortField: keyof Request,
    sortDirection: "asc" | "desc"
  ) => {
    // Apply filters
    const filteredByStatus = applyFilter(requestsToFilter, filter);
    
    // Apply search
    const filteredBySearch = applySearch(filteredByStatus, searchTerm);
    
    // Apply sort
    applySort(filteredBySearch, sortField, sortDirection);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSort(requests, activeFilter, sortConfig.field, sortConfig.direction);
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
      requests, 
      activeFilter, 
      newSortConfig.field, 
      newSortConfig.direction
    );
  };

  // Re-apply filters when search term changes
  useEffect(() => {
    if (requests.length > 0) {
      applyFiltersAndSort(requests, activeFilter, sortConfig.field, sortConfig.direction);
    }
  }, [searchTerm, activeFilter]);

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
