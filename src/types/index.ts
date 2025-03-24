// Request status types
export type RequestStatus = 
  | "submitted" 
  | "assigned" 
  | "under_review" 
  | "manager_review" 
  | "forwarded" 
  | "completed" 
  | "rejected";

export type RequestType = 
  | "medical_assistance" 
  | "educational_support" 
  | "financial_aid" 
  | "food_assistance" 
  | "shelter_assistance" 
  | "water_sanitation" 
  | "psychosocial_support" 
  | "disaster_relief" 
  | "other_assistance";

// Document types
export type DocumentType = 
  | "id_document" 
  | "medical_records" 
  | "prescription" 
  | "medical_referral" 
  | "educational_records" 
  | "school_fee_structure" 
  | "admission_letter" 
  | "financial_statements" 
  | "bank_statements" 
  | "tax_documents" 
  | "proof_of_income" 
  | "proof_of_residence" 
  | "vulnerability_assessment" 
  | "disaster_assessment" 
  | "property_documents" 
  | "referral_letter" 
  | "supporting_letter" 
  | "other";

// Main Request interface
export interface Request {
  id: string;
  ticketNumber: string;
  userId: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  documents: Document[];
  notes: Note[];
  timeline: TimelineEvent[];
}

// Document interface
export interface Document {
  id: string;
  requestId: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedAt: string;
}

// Note interface
export interface Note {
  id: string;
  requestId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

// Timeline event interface
export interface TimelineEvent {
  id: string;
  requestId: string;
  type: "status_change" | "note_added" | "document_added" | "assigned";
  description: string;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
    role: string;
  };
  metadata?: Record<string, any>;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "field_officer" | "programme_manager" | "management";
  createdAt: string;
}

// Chat message interface
export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: "user" | "system" | "staff";
  content: string;
  timestamp: string;
  attachments?: {
    id: string;
    url: string;
    name: string;
    type: string;
  }[];
}

// Required document by request type
export interface RequiredDocument {
  type: DocumentType;
  name: string;
  description: string;
  required: boolean;
}

export interface RequestTypeInfo {
  type: RequestType;
  name: string;
  description: string;
  requiredDocuments: RequiredDocument[];
}
