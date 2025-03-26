
// Re-export all mutation-related functions from their respective modules
export { 
  createRequest, 
  getRequestById, 
  assignRequest 
} from './request/createRequest';

export { 
  uploadDocument, 
  getRequestDocuments, 
  deleteDocument 
} from './request/documentsApi';

export { 
  updateRequestStatus, 
  getStatusHistory 
} from './request/statusApi';

export { 
  addNoteToRequest,
  getRequestNotes 
} from './request/notesApi';
