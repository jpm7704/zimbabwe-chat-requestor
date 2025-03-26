
import { Document as RequestDocument, DocumentType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";

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
