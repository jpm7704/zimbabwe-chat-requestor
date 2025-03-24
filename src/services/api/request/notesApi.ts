
import { TimelineEvent } from "@/types";
import { delay } from "../baseApi";

/**
 * Add a note to a request
 */
export const addNoteToRequest = async (
  requestId: string,
  content: string,
  isInternal: boolean = false
): Promise<{ note: any, timelineEvent: TimelineEvent }> => {
  await delay(500);
  
  const noteId = Math.random().toString(36).substring(2, 10);
  
  const note = {
    id: noteId,
    requestId,
    authorId: "current_user", // In a real app, this would be the current user's ID
    authorName: "John Doe", // Mock name
    authorRole: "user", // Mock role
    content,
    createdAt: new Date().toISOString(),
    isInternal
  };
  
  const timelineEvent: TimelineEvent = {
    id: Math.random().toString(36).substring(2, 10),
    requestId,
    type: "note_added",
    description: `New note added ${isInternal ? '(Internal)' : ''}`,
    createdAt: new Date().toISOString(),
    createdBy: {
      id: "current_user",
      name: "John Doe",
      role: "user"
    },
    metadata: {
      noteId,
      isInternal
    }
  };
  
  return { note, timelineEvent };
};
