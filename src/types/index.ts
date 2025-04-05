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
  | "livelihood_development"
  | "community_development"
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
  | "project_proposal"
  | "community_letter"
  | "community_assessment"
  | "other";

// Main Request interface
export interface Request {
  id: string;
  ticket_number: string;
  user_id: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  field_officer_id?: string | null;
  program_manager_id?: string | null;
  notes?: string | null;
  priority?: string;
  due_date?: string | null;
  region?: string | null;
  is_enquiry?: boolean;

  // Related data (not in the database table)
  documents?: Document[];
  statusUpdates?: StatusUpdate[];
  timeline?: TimelineEvent[];
  fieldOfficer?: UserProfile | null;
  programManager?: UserProfile | null;
}

// Document interface (matches attachments table)
export interface Document {
  id: string;
  request_id: string | null;
  message_id?: string | null;
  name: string;
  type: string;
  url: string;
  size: number;
  uploaded_at: string;
}

// Note interface (matches messages table)
export interface Note {
  id: string;
  request_id: string;
  topic: string;
  sender_id: string;
  content: string;
  extension: string;
  is_system_message?: boolean | null;
  payload?: any;
  event?: string | null;
  timestamp?: string;
  private?: boolean;
  updated_at: string;
  inserted_at: string;

  // Computed properties
  author?: UserProfile;
  isInternal?: boolean;
}

// Status update interface
export interface StatusUpdate {
  id: string;
  request_id: string;
  status: RequestStatus;
  updated_by: string;
  timestamp: string;
  notes?: string | null;
  updatedByUser?: UserProfile;
}

// Timeline event interface
export interface TimelineEvent {
  id: string;
  request_id: string;
  type: "status_change" | "note_added" | "document_added" | "assigned";
  description: string;
  created_at: string;
  created_by?: {
    id: string;
    first_name: string;
    last_name?: string;
    role: string;
  };
  metadata?: Record<string, any>;
}

// User interface
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "user" | "field_officer" | "programme_manager" | "management" | "admin";
  avatar_url?: string | null;
  region?: string | null;
  staff_number?: number | null;
  created_at: string;
  updated_at: string;
}

// UserProfile interface - used throughout the application
export interface UserProfile {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  role: string;
  avatar_url?: string | null;
  region?: string | null;
  staff_number?: number | null;
  created_at?: string;
  updated_at?: string;

  // Computed properties
  fullName?: string; // Computed from first_name + last_name
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

export type NotificationType = 'document_upload' | 'status_change' | 'assignment' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string; // This is 'content' in the database, not 'message'
  link?: string | null;
  read: boolean;
  created_at: string;

  // Computed properties (not in the database)
  formattedDate?: string;
}
