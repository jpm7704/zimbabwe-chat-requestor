
import { 
  Request, 
  RequestType, 
  RequestTypeInfo, 
  RequestStatus, 
  Document as RequestDocument,
  TimelineEvent
} from "../types";
import { 
  generateMockRequests, 
  getMockRequest, 
  requestTypes 
} from "./mockData";

// API simulation with a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all request types and their requirements
 */
export const getRequestTypes = async (): Promise<RequestTypeInfo[]> => {
  await delay(500);
  return requestTypes;
};

/**
 * Get a specific request type and its requirements
 */
export const getRequestTypeInfo = async (type: RequestType): Promise<RequestTypeInfo | undefined> => {
  await delay(300);
  return requestTypes.find(t => t.type === type);
};

/**
 * Get all requests for the current user
 */
export const getUserRequests = async (): Promise<Request[]> => {
  await delay(800);
  return generateMockRequests(8);
};

/**
 * Get a specific request by ID
 */
export const getRequestById = async (requestId: string): Promise<Request | null> => {
  await delay(600);
  const request = getMockRequest(requestId);
  return request || null;
};

/**
 * Create a new request
 */
export const createRequest = async (
  requestData: {
    type: RequestType;
    title: string;
    description: string;
  }
): Promise<{ requestId: string, ticketNumber: string }> => {
  await delay(1000);
  
  // Generate a unique ticket number
  const ticketNumber = `BGF-${Math.floor(100000 + Math.random() * 900000)}`;
  const requestId = Math.random().toString(36).substring(2, 10);
  
  return { requestId, ticketNumber };
};

/**
 * Upload a document for a request
 */
export const uploadDocument = async (
  requestId: string,
  file: File,
  documentType: string
): Promise<RequestDocument> => {
  await delay(1500);
  
  // In a real app, this would upload to a server
  const documentId = Math.random().toString(36).substring(2, 10);
  
  return {
    id: documentId,
    requestId,
    name: file.name,
    type: documentType as any,
    url: URL.createObjectURL(file), // In a real app, this would be a server URL
    uploadedAt: new Date().toISOString()
  };
};

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

/**
 * Search requests by ticket number or content
 */
export const searchRequests = async (searchTerm: string): Promise<Request[]> => {
  await delay(800);
  
  const allRequests = generateMockRequests(10);
  
  if (!searchTerm.trim()) {
    return allRequests;
  }
  
  const normalizedTerm = searchTerm.toLowerCase().trim();
  
  return allRequests.filter(request => 
    request.ticketNumber.toLowerCase().includes(normalizedTerm) ||
    request.title.toLowerCase().includes(normalizedTerm) ||
    request.description.toLowerCase().includes(normalizedTerm)
  );
};
