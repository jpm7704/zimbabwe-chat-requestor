
import { Request } from "../../types";
import { generateMockDocument } from "./documentGenerator";
import { generateMockNote } from "./noteGenerator";
import { generateTimelineEvent } from "./timelineGenerator";

export const generateMockRequests = (count: number = 0): Request[] => {
  // Return empty array - no sample data
  return [];
};

export const getMockRequest = (requestId: string): Request | undefined => {
  // Return undefined - no sample data
  return undefined;
};
