
import { Document } from "../../types";

// Clean document generator
export const generateMockDocument = (requestId: string, type: string): Document => {
  return {
    id: "",
    requestId,
    name: "",
    type: type as any,
    url: "",
    uploadedAt: new Date().toISOString()
  };
};
