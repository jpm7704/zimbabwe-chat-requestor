
import { RequestStatus, TimelineEvent } from "@/types";
import { delay } from "../baseApi";

/**
 * Update a request's status
 */
export const updateRequestStatus = async (
  requestId: string,
  status: RequestStatus,
  note?: string
): Promise<TimelineEvent> => {
  await delay(800);
  
  const timelineEvent: TimelineEvent = {
    id: Math.random().toString(36).substring(2, 10),
    requestId,
    type: "status_change",
    description: `Request status updated to ${status.replace('_', ' ')}`,
    createdAt: new Date().toISOString(),
    createdBy: {
      id: "system",
      name: "System",
      role: "system"
    },
    metadata: {
      oldStatus: "submitted", // Mock previous status
      newStatus: status,
      note
    }
  };
  
  return timelineEvent;
};
