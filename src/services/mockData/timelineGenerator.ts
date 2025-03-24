
import { TimelineEvent } from "../../types";

export const generateTimelineEvent = (requestId: string, type: string, createdAt: string): TimelineEvent => {
  return {
    id: Math.random().toString(36).substring(2, 10),
    requestId,
    type: type as any,
    description: type === "status_change" 
      ? "Request status updated to Under Review" 
      : type === "note_added" 
        ? "New note added to the request" 
        : type === "document_added" 
          ? "New document uploaded" 
          : "Request assigned to field officer",
    createdAt,
    createdBy: {
      id: Math.random().toString(36).substring(2, 10),
      name: "System",
      role: "system"
    }
  };
};
