
// Re-export all request-related services from their respective modules
export { 
  getRequestTypes,
  getRequestTypeInfo
} from './api/requestTypesApi';

export {
  getUserRequests,
  getRequestById,
  searchRequests
} from './api/requestApi';

export {
  createRequest,
  uploadDocument,
  updateRequestStatus,
  addNoteToRequest
} from './api/requestMutationApi';

// Field Work related exports
export interface FieldWorkRequest {
  id: string;
  ticketNumber: string;
  title: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  location?: string;
  assignee?: string;
}

// Function to fetch field work requests
export const fetchFieldWorkRequests = async (): Promise<FieldWorkRequest[]> => {
  try {
    // This will be connected to a real API in the future
    // For now, return an empty array
    return [];
  } catch (error) {
    console.error("Error fetching field work requests:", error);
    throw new Error("Failed to load field work requests");
  }
};
