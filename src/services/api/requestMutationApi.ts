import { Document as RequestDocument, DocumentType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { createDocumentUploadNotification } from "@/services/notificationService";

/**
 * Upload a document for a request
 */
export const uploadDocument = async (
  requestId: string,
  file: File,
  documentType: DocumentType
): Promise<RequestDocument | null> => {
  try {
    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
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
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive"
      });
      return null;
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
      toast({
        title: "Error saving document reference",
        description: attachmentError.message,
        variant: "destructive"
      });
      return null;
    }
    
    // Get the request ticket number for the notification
    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .select('ticket_number')
      .eq('id', requestId)
      .single();
    
    if (!requestError && requestData) {
      // Create a notification for relevant staff roles
      await createDocumentUploadNotification(
        requestId,
        requestData.ticket_number,
        file.name
      );
    }
    
    return {
      id: attachmentData.id,
      requestId: attachmentData.request_id,
      name: attachmentData.name,
      type: documentType,
      url: attachmentData.url,
      uploadedAt: attachmentData.uploaded_at
    };
  } catch (error: any) {
    console.error("Document upload error:", error);
    toast({
      title: "Upload failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Get all documents for a request
 */
export const getRequestDocuments = async (requestId: string): Promise<RequestDocument[]> => {
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
    // First get the document to find the file path
    const { data: document, error: fetchError } = await supabase
      .from('attachments')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching document:", fetchError);
      return false;
    }
    
    // Extract the storage path from the URL
    const pathMatch = document.url.match(/\/storage\/v1\/object\/public\/requests\/(.+)/);
    if (!pathMatch || !pathMatch[1]) {
      console.error("Could not extract file path from URL");
      return false;
    }
    
    const filePath = decodeURIComponent(pathMatch[1]);
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('requests')
      .remove([filePath]);
    
    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      // Continue anyway to remove the database reference
    }
    
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

/**
 * Add a note to a request
 */
export const addNoteToRequest = async (
  requestId: string,
  content: string,
  isInternal: boolean = false
): Promise<void> => {
  try {
    // Get the current user session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.error("No user session found");
      return;
    }
    
    // Insert the new message into the messages table
    const { error } = await supabase
      .from('messages')
      .insert({
        request_id: requestId,
        sender_id: session.session.user.id,
        content: content,
        is_system_message: false
      });
    
    if (error) {
      console.error("Error adding note to request:", error);
      toast({
        title: "Error",
        description: "Failed to add note to request",
        variant: "destructive"
      });
      throw error;
    }
  } catch (error) {
    console.error("Error in addNoteToRequest:", error);
    toast({
      title: "Error",
      description: "Failed to add note to request",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Get all notes for a request
 */
export const getRequestNotes = async (requestId: string, canSeeInternalNotes: boolean = false): Promise<any[]> => {
  try {
    let query = supabase
      .from('messages')
      .select(`
        id,
        request_id,
        sender_id,
        content,
        is_system_message,
        timestamp
      `)
      .eq('request_id', requestId)
      .order('timestamp', { ascending: true });
    
    if (!canSeeInternalNotes) {
      // Filter out internal notes if the user doesn't have permission to see them
      query = query.eq('is_internal', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching notes:", error);
      throw error;
    }
    
    // Get user profiles for sender IDs
    const senderIds = [...new Set(data.map(item => item.sender_id))];
    const { data: userProfiles } = await supabase
      .from('user_profiles')
      .select('id, name, role')
      .in('id', senderIds);
    
    const profileMap = new Map();
    userProfiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });
    
    // Map the data to the Note interface
    return data.map(item => {
      const authorProfile = profileMap.get(item.sender_id) || { name: 'System', role: 'system' };
      
      return {
        id: item.id,
        requestId: item.request_id,
        authorId: item.sender_id,
        authorName: authorProfile.name || 'System',
        authorRole: authorProfile.role || 'System',
        content: item.content,
        createdAt: item.timestamp,
        isInternal: item.is_system_message
      };
    });
  } catch (error) {
    console.error("Error in getRequestNotes:", error);
    return [];
  }
};

// Export the createRequest function directly
export { createRequest } from '@/services/api/request/createRequest';

// Export other functions from the request folder
export { updateRequestStatus } from '@/services/api/request/statusApi';
