
import { Note } from "../../types";

// Simple empty note generator
export const generateMockNote = (requestId: string): Note => {
  return {
    id: "",
    requestId,
    authorId: "",
    authorName: "",
    authorRole: "user",
    content: "",
    createdAt: new Date().toISOString(),
    isInternal: false
  };
};
