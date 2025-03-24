
import { Document } from "../../types";

// Generate mock document
export const generateMockDocument = (requestId: string, type: string): Document => {
  const id = Math.random().toString(36).substring(2, 10);
  return {
    id,
    requestId,
    name: `${type.replace('_', ' ')}.pdf`,
    type: type as any,
    url: `https://example.com/documents/${id}`,
    uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString()
  };
};
