
import { Request, RequestStatus, RequestType, Note } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Get a request by ID
 */
export const getRequestById = async (requestId: string): Promise<Request | null> => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        user:user_profiles!user_id(name, email, role),
        field_officer:user_profiles!field_officer_id(name, email, role),
        program_manager:user_profiles!program_manager_id(name, email, role)
      `)
      .eq('id', requestId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      ticketNumber: data.ticket_number,
      userId: data.user_id,
      type: data.type as RequestType,
      title: data.title,
      description: data.description,
      status: data.status as RequestStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      fieldOfficer: data.field_officer,
      programManager: data.program_manager,
      notes: data.notes ? [data.notes] as Note[] : [],
      documents: [],
      timeline: []
    };
  } catch (error) {
    console.error("Error fetching request:", error);
    return null;
  }
};

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
