
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentType } from "@/types";
import { createNotification } from "@/services/notificationService";

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
    
    // Create notification for document upload
    try {
      // Get request details
      const { data: request } = await supabase
        .from('requests')
        .select('title, ticket_number')
        .eq('id', requestId)
        .single();

      if (request) {
        await createNotification(
          'document_upload',
          'New Document Uploaded',
          `A new document "${file.name}" was uploaded for request ${request.ticket_number}: ${request.title}`,
          ['field_officer', 'programme_manager', 'management'],
          requestId,
          `/requests/${requestId}`
        );
      }
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Don't fail the upload if notification fails
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
