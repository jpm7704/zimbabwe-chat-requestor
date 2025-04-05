import { UserProfile } from './index';

export interface FieldVisit {
  id: string;
  request_id?: string | null;
  assigned_officer_id?: string | null;
  assigned_officer_name?: string | null;
  visit_date?: string | null;
  location?: string | null;
  purpose?: string | null;
  status: string;
  priority: string;
  region?: string | null;
  report_submitted?: boolean | null;
  report_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  
  // Computed properties (not in the database)
  assignedOfficer?: UserProfile;
  request?: any; // This would be the Request type
  report?: any; // This would be the Report type
}

export interface Report {
  id: string;
  type: string;
  title: string;
  content: string;
  field_visit_id?: string | null;
  request_id?: string | null;
  author_id?: string | null;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
  
  // Computed properties
  author?: UserProfile;
  fieldVisit?: FieldVisit;
  request?: any; // This would be the Request type
}
