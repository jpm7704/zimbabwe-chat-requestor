
import { supabase } from "@/integrations/supabase/client";

export interface FieldVisit {
  id: string;
  request_id: string | null;
  location: string;
  visit_date: string;
  purpose: string;
  status: 'scheduled' | 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  report_id: string | null;
  assigned_officer_id: string | null;
  created_at: string;
  report_submitted: boolean;
  notes: string | null;
  region: string | null;
}

export const createFieldVisit = async (visitData: Omit<FieldVisit, 'id' | 'created_at' | 'report_submitted'>) => {
  try {
    const { data, error } = await supabase
      .from('field_visits')
      .insert(visitData)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating field visit:", error);
    throw error;
  }
};

export const getFieldVisitById = async (visitId: string) => {
  try {
    const { data, error } = await supabase
      .from('field_visits')
      .select('*, request:requests(id, ticket_number, title)')
      .eq('id', visitId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error fetching field visit ${visitId}:`, error);
    throw error;
  }
};

export const updateFieldVisit = async (visitId: string, updates: Partial<FieldVisit>) => {
  try {
    const { data, error } = await supabase
      .from('field_visits')
      .update(updates)
      .eq('id', visitId)
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error updating field visit:", error);
    throw error;
  }
};

export const deleteFieldVisit = async (visitId: string) => {
  try {
    const { error } = await supabase
      .from('field_visits')
      .delete()
      .eq('id', visitId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting field visit:", error);
    throw error;
  }
};

export const submitFieldVisitReport = async (visitId: string, reportContent: string) => {
  try {
    // First create the report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        type: 'field_visit',
        title: 'Field Visit Report',
        content: reportContent,
        status: 'Published'
      })
      .select()
      .single();
    
    if (reportError) throw reportError;
    
    // Then update the field visit with the report ID and mark as submitted
    const { error: visitError } = await supabase
      .from('field_visits')
      .update({ 
        report_id: report.id,
        report_submitted: true,
        status: 'completed'
      })
      .eq('id', visitId);
    
    if (visitError) throw visitError;
    
    return report;
  } catch (error) {
    console.error("Error submitting field visit report:", error);
    throw error;
  }
};
