
import { Request, RequestStatus, RequestType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { isValidUUID } from "./baseApi";

/**
 * Get all requests for the current user
 */
export const getUserRequests = async (): Promise<Request[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      console.error("No user is logged in");
      return [];
    }

    const userId = session.session.user.id;
    const { data, error } = await supabase
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
      `)
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }

    // Map the Supabase data to our Request type format
    const requests: Request[] = data.map(request => ({
      id: request.id,
      ticketNumber: request.ticket_number,
      userId: request.user_id,
      type: request.type as RequestType,
      title: request.title,
      description: request.description,
      status: request.status as RequestStatus,
      createdAt: request.created_at,
      updatedAt: request.updated_at,
      documents: [],  // We'll fetch these separately if needed
      notes: [],      // We'll fetch these separately if needed
      timeline: []    // We'll fetch these separately if needed
    }));

    return requests;
  } catch (error) {
    console.error("Error in getUserRequests:", error);
    return [];
  }
};

/**
 * Get a specific request by ID
 */
export const getRequestById = async (requestId: string): Promise<Request | null> => {
  try {
    // Check if requestId is a valid UUID
    if (!isValidUUID(requestId)) {
      console.error("Invalid UUID format:", requestId);
      return null;
    }

    const { data, error } = await supabase
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
      `)
      .eq('id', requestId)
      .single();

    if (error) {
      console.error("Error fetching request:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Map the Supabase data to our Request type format
    const request: Request = {
      id: data.id,
      ticketNumber: data.ticket_number,
      userId: data.user_id,
      type: data.type as RequestType,
      title: data.title,
      description: data.description,
      status: data.status as RequestStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      documents: [],  // We'll fetch these separately if needed
      notes: [],      // We'll fetch these separately if needed
      timeline: []    // We'll fetch these separately if needed
    };

    return request;
  } catch (error) {
    console.error("Error in getRequestById:", error);
    return null;
  }
};

/**
 * Search requests by ticket number or content
 */
export const searchRequests = async (searchTerm: string): Promise<Request[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      console.error("No user is logged in");
      return [];
    }

    const userId = session.session.user.id;
    
    // If no search term, return all requests for the user
    if (!searchTerm.trim()) {
      return await getUserRequests();
    }

    const normalizedTerm = searchTerm.toLowerCase().trim();
    
    // Search for requests matching the term
    const { data, error } = await supabase
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
      `)
      .eq('user_id', userId)
      .or(`ticket_number.ilike.%${normalizedTerm}%,title.ilike.%${normalizedTerm}%,description.ilike.%${normalizedTerm}%`);

    if (error) {
      console.error("Error searching requests:", error);
      throw error;
    }

    // Map the Supabase data to our Request type format
    const requests: Request[] = data.map(request => ({
      id: request.id,
      ticketNumber: request.ticket_number,
      userId: request.user_id,
      type: request.type as RequestType,
      title: request.title,
      description: request.description,
      status: request.status as RequestStatus,
      createdAt: request.created_at,
      updatedAt: request.updated_at,
      documents: [],  // We'll fetch these separately if needed
      notes: [],      // We'll fetch these separately if needed
      timeline: []    // We'll fetch these separately if needed
    }));

    return requests;
  } catch (error) {
    console.error("Error in searchRequests:", error);
    return [];
  }
};
