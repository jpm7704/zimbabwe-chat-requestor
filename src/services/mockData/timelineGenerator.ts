
import { TimelineEvent } from "../../types";

// Clean timeline event generator
export const generateTimelineEvent = (requestId: string, type: string, createdAt: string): TimelineEvent => {
  return {
    id: "",
    requestId,
    type: type as any,
    description: "",
    createdAt,
    createdBy: {
      id: "",
      name: "",
      role: "system"
    }
  };
};
