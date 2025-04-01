
import { Request } from "@/types";
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
    
    return {
      id: data.id,
      ticketNumber: data.ticket_number,
      userId: data.user_id,
      user: data.user,
      type: data.type,
      title: data.title,
      description: data.description,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      fieldOfficer: data.field_officer,
      programManager: data.program_manager,
      notes: data.notes
    };
  } catch (error) {
    console.error("Error fetching request:", error);
    return null;
  }
};
