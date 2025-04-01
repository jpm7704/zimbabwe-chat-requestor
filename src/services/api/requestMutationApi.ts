import { supabase } from "@/integrations/supabase/client";
import { Request, RequestType, RequestStatus } from "@/types";

type RequestParams = {
  title: string;
  description: string;
  type: RequestType;
};

type RequestResult = {
  data: Request | null;
  error: Error | null;
};

/**
 * Creates a new request.
 * @param {RequestParams} params - The parameters for creating the request.
 * @returns {Promise<RequestResult>} - The result of the request creation.
 */
export const createRequest = async (params: RequestParams): Promise<RequestResult> => {
  try {
    // Get the current user session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("No user session found");
    }

    // Create a unique ticket number
    const ticketNumber = `REQ-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Insert the new request into the database
    const { data, error } = await supabase
      .from('requests')
      .insert([
        {
          user_id: session.session.user.id,
          title: params.title,
          description: params.description,
          ticket_number: ticketNumber,
          type: params.type,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as Request, error: null };
  } catch (error: any) {
    console.error("Error creating request:", error);
    return { data: null, error: error };
  }
};

/**
 * Updates an existing request.
 * @param {string} id - The ID of the request to update.
 * @param {Partial<Request>} updates - The updates to apply to the request.
 * @returns {Promise<RequestResult>} - The result of the request update.
 */
export const updateRequest = async (
  id: string,
  updates: Partial<Request>
): Promise<RequestResult> => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as Request, error: null };
  } catch (error: any) {
    console.error("Error updating request:", error);
    return { data: null, error: error };
  }
};

/**
 * Deletes a request.
 * @param {string} id - The ID of the request to delete.
 * @returns {Promise<void>} - A promise that resolves when the request is deleted.
 * @throws {Error} - If there is an error deleting the request.
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

type StatusUpdateParams = {
  requestId: string;
  status: RequestStatus;
  notes?: string;
};

type StatusUpdateResult = {
  data: any | null;
  error: Error | null;
};

/**
 * Adds a status update to a request.
 * @param {StatusUpdateParams} params - The parameters for adding the status update.
 * @returns {Promise<StatusUpdateResult>} - The result of the status update.
 */
export const addStatusUpdate = async (
  params: StatusUpdateParams
): Promise<StatusUpdateResult> => {
  try {
    // Get the current user session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("No user session found");
    }

    // Insert the new status update into the database
    const { data, error } = await supabase
      .from('status_updates')
      .insert([
        {
          request_id: params.requestId,
          status: params.status,
          notes: params.notes,
          updated_by: session.session.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update the request status
    await updateRequest(params.requestId, { status: params.status });

    return { data: data, error: null };
  } catch (error: any) {
    console.error("Error adding status update:", error);
    return { data: null, error: error };
  }
};

type MessageParams = {
  requestId: string;
  content: string;
};

type MessageResult = {
  data: any | null;
  error: Error | null;
};

/**
 * Adds a message to a request.
 * @param {MessageParams} params - The parameters for adding the message.
 * @returns {Promise<MessageResult>} - The result of the message.
 */
export const addMessage = async (
  params: MessageParams
): Promise<MessageResult> => {
  try {
    // Get the current user session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error("No user session found");
    }

    // Insert the new message into the database
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          request_id: params.requestId,
          sender_id: session.session.user.id,
          content: params.content,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data, error: null };
  } catch (error: any) {
    console.error("Error adding message:", error);
    return { data: null, error: error };
  }
};

type AttachmentParams = {
  requestId: string;
  messageId?: string;
  name: string;
  type: string;
  size: number;
  url: string;
};

type AttachmentResult = {
  data: any | null;
  error: Error | null;
};

/**
 * Adds an attachment to a request.
 * @param {AttachmentParams} params - The parameters for adding the attachment.
 * @returns {Promise<AttachmentResult>} - The result of the attachment.
 */
export const addAttachment = async (
  params: AttachmentParams
): Promise<AttachmentResult> => {
  try {
    // Insert the new attachment into the database
    const { data, error } = await supabase
      .from('attachments')
      .insert([
        {
          request_id: params.requestId,
          message_id: params.messageId,
          name: params.name,
          type: params.type,
          size: params.size,
          url: params.url,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data, error: null };
  } catch (error: any) {
    console.error("Error adding attachment:", error);
    return { data: null, error: error };
  }
};

type NoteParams = {
  requestId: string;
  note: string;
};

type NoteResult = {
  data: any | null;
  error: Error | null;
};

/**
 * Adds a note to a request.
 */
export const addNote = async (requestId: string, note: string) => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .update({ notes: note })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data, error: null };
  } catch (error: any) {
    console.error("Error adding note:", error);
    return { data: null, error: error };
  }
};

export const createEntryPoint = async (params: RequestParams): Promise<RequestResult> => {
  // Implementation
  return { data: null, error: null };
};

// Make sure to export createRequest
export { createRequest };
