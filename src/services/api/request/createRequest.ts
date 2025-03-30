
import { RequestType, RequestStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Create a new request
 */
export const createRequest = async (
  requestData: {
    type: RequestType;
    title: string;
    description: string;
    isEnquiry?: boolean; // Added isEnquiry as an optional parameter
  }
): Promise<{ requestId: string, ticketNumber: string } | null> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error("No user is logged in");
    }

    const userId = session.session.user.id;

    // Insert the request into the database
    // The ticket number will be generated by a database trigger
    const { data, error } = await supabase
      .from('requests')
      .insert({
        user_id: userId,
        type: requestData.type,
        title: requestData.title,
        description: requestData.description,
        status: 'submitted' as RequestStatus,
        ticket_number: 'PENDING', // This will be replaced by the trigger
        is_enquiry: requestData.isEnquiry || false // Store the enquiry flag in the database
      })
      .select('id, ticket_number')
      .single();

    if (error) {
      console.error("Error creating request:", error);
      toast({
        title: "Failed to create request",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    // Create initial status update
    await supabase
      .from('status_updates')
      .insert({
        request_id: data.id,
        status: 'submitted',
        notes: 'Request submitted',
        updated_by: userId
      });

    return { 
      requestId: data.id, 
      ticketNumber: data.ticket_number 
    };
  } catch (error: any) {
    console.error("Error in createRequest:", error);
    toast({
      title: "Failed to create request",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Get a request by ID
 */
export const getRequestById = async (requestId: string) => {
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

/**
 * Assign a request to a staff member
 */
export const assignRequest = async (
  requestId: string,
  fieldOfficerId?: string,
  programManagerId?: string
) => {
  try {
    const updateData: Record<string, any> = {};
    
    if (fieldOfficerId !== undefined) {
      updateData.field_officer_id = fieldOfficerId || null;
    }
    
    if (programManagerId !== undefined) {
      updateData.program_manager_id = programManagerId || null;
    }
    
    if (Object.keys(updateData).length === 0) {
      return true; // Nothing to update
    }
    
    const { error } = await supabase
      .from('requests')
      .update(updateData)
      .eq('id', requestId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error("Error assigning request:", error);
    toast({
      title: "Assignment failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};
