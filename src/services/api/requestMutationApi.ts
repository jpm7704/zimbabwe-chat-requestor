
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentType, Note, Request, RequestStatus, RequestType } from "@/types";

type RequestParams = {
  title: string;
  description: string;
  type: string;
  isEnquiry?: boolean;
};

type RequestResult = {
  requestId: string;
  ticketNumber: string;
};

/**
 * Creates a new request.
 */
export const createRequest = async (params: RequestParams): Promise<RequestResult | null> => {
  try {
    // Get the current user session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("No user session found");
    }

    // Insert the new request into the database
    // Note: We omit is_enquiry if not defined to let database use default
    const requestData: any = {
      user_id: session.session.user.id,
      title: params.title,
      description: params.description,
      type: params.type,
      status: 'submitted' as RequestStatus // Default status
    };
    
    // Only add is_enquiry field if it's explicitly set
    if (params.isEnquiry !== undefined) {
      requestData.is_enquiry = params.isEnquiry;
    }

    const { data, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { 
      requestId: data.id, 
      ticketNumber: data.ticket_number 
    };
  } catch (error: any) {
    console.error("Error creating request:", error);
    return null;
  }
};

/**
 * Updates an existing request.
 */
export const updateRequest = async (
  id: string,
  updates: Record<string, any>
): Promise<Request | null> => {
  try {
    // Convert notes if present to match database format
    const dbUpdates = {...updates};
    if (updates.notes && Array.isArray(updates.notes)) {
      // Convert notes array to string or format expected by the database
      dbUpdates.notes = JSON.stringify(updates.notes);
    }

    const { data, error } = await supabase
      .from('requests')
      .update(dbUpdates)
      .eq('id', id)
      .select(`
        id,
        ticket_number,
        user_id,
        title,
        description,
        type,
        status,
        created_at,
        updated_at,
        notes,
        field_officer_id,
        program_manager_id
      `)
      .single();

    if (error) {
      throw error;
    }

    // Convert the data from DB format to our application's Request type
    return {
      id: data.id,
      ticketNumber: data.ticket_number,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      type: data.type as RequestType,
      status: data.status as RequestStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      // Initialize with empty arrays - these would typically be loaded separately
      notes: [], 
      documents: [],
      timeline: []
    };
  } catch (error: any) {
    console.error("Error updating request:", error);
    return null;
  }
};

/**
 * Deletes a request.
 */
export const deleteRequest = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from('requests').delete().eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error("Error deleting request:", error);
    throw error;
  }
};

/**
 * Updates the status of a request
 */
export const updateRequestStatus = async (
  requestId: string,
  status: string, 
  notes?: string
): Promise<void> => {
  try {
    // Get the current user session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("No user session found");
    }

    // Insert the new status update into the database
    const { error: statusError } = await supabase
      .from('status_updates')
      .insert([
        {
          request_id: requestId,
          status: status,
          notes: notes || null,
          updated_by: session.session.user.id,
        },
      ]);

    if (statusError) {
      throw statusError;
    }

    // Update the request status
    const { error: requestError } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', requestId);
      
    if (requestError) {
      throw requestError;
    }
  } catch (error: any) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

/**
 * Adds a note to a request.
 */
export const addNote = async (
  requestId: string,
  content: string,
  isInternal: boolean = false
): Promise<void> => {
  try {
    // Get the current user session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("No user session found");
    }

    // Insert the new message into the database
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          request_id: requestId,
          sender_id: session.session.user.id,
          content: content,
          is_system_message: isInternal
        },
      ]);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error("Error adding note:", error);
    throw error;
  }
};

// Alias for backward compatibility
export const addNoteToRequest = addNote;

/**
 * Upload a document for a request
 */
export const uploadDocument = async (
  requestId: string,
  file: File,
  documentType: DocumentType
): Promise<Document | null> => {
  try {
    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
    const filePath = `${requestId}/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('requests')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }
    
    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('requests')
      .getPublicUrl(filePath);

    // Insert record into attachments table
    const { data: attachmentData, error: attachmentError } = await supabase
      .from('attachments')
      .insert({
        request_id: requestId,
        name: file.name,
        type: documentType,
        size: file.size,
        url: publicUrlData.publicUrl
      })
      .select()
      .single();
    
    if (attachmentError) {
      console.error("Error recording attachment:", attachmentError);
      throw attachmentError;
    }
    
    return {
      id: attachmentData.id,
      requestId: attachmentData.request_id,
      name: attachmentData.name,
      type: documentType,
      url: attachmentData.url,
      uploadedAt: attachmentData.uploaded_at
    };
  } catch (error) {
    console.error("Document upload error:", error);
    return null;
  }
};

/**
 * Get all documents for a request
 */
export const getRequestDocuments = async (requestId: string): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('request_id', requestId);
    
    if (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
    
    return data.map(doc => ({
      id: doc.id,
      requestId: doc.request_id,
      name: doc.name,
      type: doc.type as DocumentType,
      url: doc.url,
      uploadedAt: doc.uploaded_at
    }));
  } catch (error) {
    console.error("Error in getRequestDocuments:", error);
    return [];
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    // Delete database record
    const { error: dbError } = await supabase
      .from('attachments')
      .delete()
      .eq('id', documentId);
    
    if (dbError) {
      console.error("Error deleting attachment record:", dbError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteDocument:", error);
    return false;
  }
};
