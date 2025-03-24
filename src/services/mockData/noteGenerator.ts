
import { Note } from "../../types";

export const generateMockNote = (requestId: string): Note => {
  const id = Math.random().toString(36).substring(2, 10);
  const authorRoles = ["user", "field_officer", "programme_manager", "management"];
  const authorRole = authorRoles[Math.floor(Math.random() * authorRoles.length)];
  
  return {
    id,
    requestId,
    authorId: Math.random().toString(36).substring(2, 10),
    authorName: `${authorRole === 'user' ? 'John Doe' : authorRole.replace('_', ' ')}`,
    authorRole,
    content: "Additional information provided for this request. Please review and provide feedback.",
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString(),
    isInternal: authorRole !== "user"
  };
};
