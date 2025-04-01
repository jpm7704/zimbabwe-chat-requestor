
import { Request } from "../../types";

// Return empty arrays instead of generating mock data
export const generateMockRequests = (count: number = 0): Request[] => {
  return [];
};

export const getMockRequest = (requestId: string): Request | undefined => {
  return undefined;
};
