
import { Document as RequestDocument } from "@/types";
import { delay } from "../baseApi";

/**
 * Upload a document for a request
 */
export const uploadDocument = async (
  requestId: string,
  file: File,
  documentType: string
): Promise<RequestDocument> => {
  await delay(1500);
  
  // In a real app, this would upload to a server
  const documentId = Math.random().toString(36).substring(2, 10);
  
  return {
    id: documentId,
    requestId,
    name: file.name,
    type: documentType as any,
    url: URL.createObjectURL(file), // In a real app, this would be a server URL
    uploadedAt: new Date().toISOString()
  };
};
