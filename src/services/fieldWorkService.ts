
import { supabase } from "@/integrations/supabase/client";
import { FieldVisit } from "@/types/fieldVisit";

export const createFieldVisit = async (visitData: Omit<FieldVisit, 'id' | 'created_at' | 'report_submitted'>) => {
  console.log("[fieldWorkService] createFieldVisit called", { visitData });
  try {
    // Use any type to bypass TypeScript errors until Supabase types are updated
    const { data, error } = await (supabase as any)
      .from('field_visits')
      .insert(visitData)
      .select()
      .single();

    if (error) throw error;

    console.log("[fieldWorkService] createFieldVisit success", data);
    return data;
  } catch (error) {
    console.error("Error creating field visit:", error);
    throw error;
  }
};

export const getFieldVisitById = async (visitId: string) => {
  console.log("[fieldWorkService] getFieldVisitById called", { visitId });
  try {
    // Use any type to bypass TypeScript errors until Supabase types are updated
    const { data, error } = await (supabase as any)
      .from('field_visits')
      .select('*, request:requests(id, ticket_number, title)')
      .eq('id', visitId)
      .single();

    if (error) throw error;

    console.log("[fieldWorkService] getFieldVisitById success", data);
    return data;
  } catch (error) {
    console.error(`Error fetching field visit ${visitId}:`, error);
    throw error;
  }
};

export const updateFieldVisit = async (visitId: string, updates: Partial<FieldVisit>) => {
  console.log("[fieldWorkService] updateFieldVisit called", { visitId, updates });
  try {
    // Use any type to bypass TypeScript errors until Supabase types are updated
    const { data, error } = await (supabase as any)
      .from('field_visits')
      .update(updates)
      .eq('id', visitId)
      .select();

    if (error) throw error;

    console.log("[fieldWorkService] updateFieldVisit success", data);
    return data;
  } catch (error) {
    console.error("Error updating field visit:", error);
    throw error;
  }
};

export const deleteFieldVisit = async (visitId: string) => {
  console.log("[fieldWorkService] deleteFieldVisit called", { visitId });
  try {
    // Use any type to bypass TypeScript errors until Supabase types are updated
    const { error } = await (supabase as any)
      .from('field_visits')
      .delete()
      .eq('id', visitId);

    if (error) throw error;

    console.log("[fieldWorkService] deleteFieldVisit success");
    return true;
  } catch (error) {
    console.error("Error deleting field visit:", error);
    throw error;
  }
};

export const submitFieldVisitReport = async (visitId: string, reportContent: string) => {
  console.log("[fieldWorkService] submitFieldVisitReport called", { visitId, reportContent });
  try {
    // First create the report
    // Use any type to bypass TypeScript errors until Supabase types are updated
    const { data: report, error: reportError } = await (supabase as any)
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
    console.log("[fieldWorkService] submitFieldVisitReport created report", report);

    // Then update the field visit with the report ID and mark as submitted
    // Use any type to bypass TypeScript errors until Supabase types are updated
    const { error: visitError } = await (supabase as any)
      .from('field_visits')
      .update({
        report_id: report.id,
        report_submitted: true,
        status: 'completed'
      })
      .eq('id', visitId);

    if (visitError) throw visitError;

    console.log("[fieldWorkService] submitFieldVisitReport updated field visit");
    return report;
  } catch (error) {
    console.error("Error submitting field visit report:", error);
    throw error;
  }
};
