
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { FieldVisit } from '@/services/fieldWorkService';

export interface FieldWorkRequest {
  id: string;
  ticketNumber: string;
  title: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  visitDate: string;
  location: string;
  assignee: string | undefined;
  reportSubmitted: boolean;
  requestId: string | null;
  purpose: string;
}

export function useFieldWork() {
  const [fieldVisits, setFieldVisits] = useState<FieldWorkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const fetchFieldVisits = async () => {
    if (!userProfile) {
      setFieldVisits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('field_visits').select(`
        *,
        request:requests(ticket_number, title)
      `);

      // Filter by role
      if (userProfile.role === 'field_officer') {
        query = query.eq('assigned_officer_id', userProfile.id);
      } else if (userProfile.region && ['regional_project_officer', 'assistant_project_officer', 'project_officer'].includes(userProfile.role)) {
        query = query.eq('region', userProfile.region);
      }
      // Higher management sees all visits

      const { data, error: fetchError } = await query.order('visit_date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        const transformedVisits: FieldWorkRequest[] = data.map(visit => ({
          id: visit.id,
          ticketNumber: visit.request?.ticket_number || 'N/A',
          title: visit.request?.title || visit.purpose || 'Field Visit',
          status: visit.status,
          priority: visit.priority as 'low' | 'medium' | 'high',
          visitDate: visit.visit_date,
          location: visit.location,
          assignee: visit.assigned_officer_name || undefined,
          reportSubmitted: visit.report_submitted,
          requestId: visit.request_id,
          purpose: visit.purpose || ''
        }));

        setFieldVisits(transformedVisits);
      }
    } catch (err) {
      console.error('Error fetching field visits:', err);
      setError(err instanceof Error ? err : new Error('Failed to load field visits'));
      toast({
        title: 'Error',
        description: 'Failed to load field visits. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createFieldVisit = async (visitData: Omit<FieldWorkRequest, 'id' | 'ticketNumber' | 'assignee' | 'reportSubmitted'>) => {
    try {
      setLoading(true);
      
      if (!userProfile) {
        throw new Error('User must be logged in to create a field visit');
      }
      
      const { data, error } = await supabase
        .from('field_visits')
        .insert({
          location: visitData.location,
          visit_date: visitData.visitDate,
          purpose: visitData.purpose,
          status: visitData.status,
          priority: visitData.priority,
          assigned_officer_id: userProfile.id,
          assigned_officer_name: userProfile.name,
          region: userProfile.region,
          request_id: visitData.requestId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Field visit created',
        description: 'Your field visit has been successfully scheduled'
      });
      
      // Refresh the field visits list
      fetchFieldVisits();
      
      return data;
    } catch (err) {
      console.error('Error creating field visit:', err);
      toast({
        title: 'Error creating field visit',
        description: err instanceof Error ? err.message : 'Failed to create field visit',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFieldVisit = async (visitId: string, updates: Partial<FieldWorkRequest>) => {
    try {
      setLoading(true);
      
      const updateData: any = {};
      if (updates.status) updateData.status = updates.status;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.location) updateData.location = updates.location;
      if (updates.visitDate) updateData.visit_date = updates.visitDate;
      if (updates.purpose) updateData.purpose = updates.purpose;
      
      const { error } = await supabase
        .from('field_visits')
        .update(updateData)
        .eq('id', visitId);
      
      if (error) throw error;
      
      toast({
        title: 'Field visit updated',
        description: 'Your field visit has been successfully updated'
      });
      
      // Refresh the field visits list
      fetchFieldVisits();
    } catch (err) {
      console.error('Error updating field visit:', err);
      toast({
        title: 'Error updating field visit',
        description: err instanceof Error ? err.message : 'Failed to update field visit',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFieldVisits();
  }, [userProfile]);

  return {
    fieldVisits,
    loading,
    error,
    fetchFieldVisits,
    createFieldVisit,
    updateFieldVisit
  };
}
