
// Re-export all request-related services from their respective modules
export { 
  getRequestTypes,
  getRequestTypeInfo
} from './api/requestTypesApi';

export {
  getUserRequests,
  getRequestById,
  searchRequests
} from './api/requestFetchApi';

export {
  createRequest,
  uploadDocument,
  updateRequestStatus,
  addNoteToRequest
} from './api/requestMutationApi';

// Re-export mock data generators for backward compatibility
export { 
  generateMockRequests, 
  getMockRequest,
  requestTypes 
} from "./mockData";
