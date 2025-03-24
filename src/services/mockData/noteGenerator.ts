
import { Note } from "../../types";

export const generateMockNote = (requestId: string): Note => {
  const id = Math.random().toString(36).substring(2, 10);
  
  return {
    id,
    requestId,
    authorId: "",
    authorName: "",
    authorRole: "user",
    content: "",
    createdAt: new Date().toISOString(),
    isInternal: false
  };
};
