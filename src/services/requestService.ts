
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
import { supabase } from "@/integrations/supabase/client";

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
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      console.error("No user is logged in");
      return [];
    }

    const userId = session.session.user.id;
    const { data, error } = await supabase
      .from('requests')
      .select(`
        id,
        ticket_number,
        title,
        description,
        type,
        status,
        created_at,
        updated_at,
        user_id
      `)
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }

    // Map the Supabase data to our Request type format
    const requests: Request[] = data.map(request => ({
      id: request.id,
      ticketNumber: request.ticket_number,
      userId: request.user_id,
      type: request.type as RequestType,
      title: request.title,
      description: request.description,
      status: request.status as RequestStatus,
      createdAt: request.created_at,
      updatedAt: request.updated_at,
      documents: [],  // We'll fetch these separately if needed
      notes: [],      // We'll fetch these separately if needed
      timeline: []    // We'll fetch these separately if needed
    }));

    return requests;
  } catch (error) {
    console.error("Error in getUserRequests:", error);
    return [];
  }
};

/**
 * Get a specific request by ID
 */
export const getRequestById = async (requestId: string): Promise<Request | null> => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        id,
        ticket_number,
        title,
        description,
        type,
        status,
        created_at,
        updated_at,
        user_id
      `)
      .eq('id', requestId)
      .single();

    if (error) {
      console.error("Error fetching request:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Map the Supabase data to our Request type format
    const request: Request = {
      id: data.id,
      ticketNumber: data.ticket_number,
      userId: data.user_id,
      type: data.type as RequestType,
      title: data.title,
      description: data.description,
      status: data.status as RequestStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      documents: [],  // We'll fetch these separately if needed
      notes: [],      // We'll fetch these separately if needed
      timeline: []    // We'll fetch these separately if needed
    };

    return request;
  } catch (error) {
    console.error("Error in getRequestById:", error);
    return null;
  }
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
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error("No user is logged in");
    }

    const userId = session.session.user.id;

    // Insert the request into the database
    const { data, error } = await supabase
      .from('requests')
      .insert({
        user_id: userId,
        type: requestData.type,
        title: requestData.title,
        description: requestData.description,
        status: 'submitted' as RequestStatus
      })
      .select('id, ticket_number')
      .single();

    if (error) {
      console.error("Error creating request:", error);
      throw error;
    }

    return { 
      requestId: data.id, 
      ticketNumber: data.ticket_number 
    };
  } catch (error) {
    console.error("Error in createRequest:", error);
    throw error;
  }
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
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      console.error("No user is logged in");
      return [];
    }

    const userId = session.session.user.id;
    
    // If no search term, return all requests for the user
    if (!searchTerm.trim()) {
      return await getUserRequests();
    }

    const normalizedTerm = searchTerm.toLowerCase().trim();
    
    // Search for requests matching the term
    const { data, error } = await supabase
      .from('requests')
      .select(`
        id,
        ticket_number,
        title,
        description,
        type,
        status,
        created_at,
        updated_at,
        user_id
      `)
      .eq('user_id', userId)
      .or(`ticket_number.ilike.%${normalizedTerm}%,title.ilike.%${normalizedTerm}%,description.ilike.%${normalizedTerm}%`);

    if (error) {
      console.error("Error searching requests:", error);
      throw error;
    }

    // Map the Supabase data to our Request type format
    const requests: Request[] = data.map(request => ({
      id: request.id,
      ticketNumber: request.ticket_number,
      userId: request.user_id,
      type: request.type as RequestType,
      title: request.title,
      description: request.description,
      status: request.status as RequestStatus,
      createdAt: request.created_at,
      updatedAt: request.updated_at,
      documents: [],  // We'll fetch these separately if needed
      notes: [],      // We'll fetch these separately if needed
      timeline: []    // We'll fetch these separately if needed
    }));

    return requests;
  } catch (error) {
    console.error("Error in searchRequests:", error);
    return [];
  }
};
