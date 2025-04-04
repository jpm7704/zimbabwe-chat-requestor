
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

    // Helper function to safely access profile properties
    const mapProfile = (profile: any) => {
      if (!profile || typeof profile !== 'object' || 'error' in profile) {
        return null;
      }
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
      };
    };

    // Convert database format to our app's Request type
    return {
      id: data.id,
      ticket_number: data.ticket_number,
      user_id: data.user_id,
      type: data.type as RequestType,
      title: data.title,
      description: data.description,
      status: data.status as RequestStatus,
      created_at: data.created_at,
      updated_at: data.updated_at,
      field_officer_id: data.field_officer_id,
      program_manager_id: data.program_manager_id,
      fieldOfficer: mapProfile(data.field_officer),
      programManager: mapProfile(data.program_manager),
      notes: [], // These will be loaded separately when needed
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
      ticket_number: request.ticket_number,
      user_id: request.user_id,
      type: request.type as RequestType,
      title: request.title,
      description: request.description,
      status: request.status as RequestStatus,
      created_at: request.created_at,
      updated_at: request.updated_at,
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
      ticket_number: request.ticket_number,
      user_id: request.user_id,
      type: request.type as RequestType,
      title: request.title,
      description: request.description,
      status: request.status as RequestStatus,
      created_at: request.created_at,
      updated_at: request.updated_at,
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
