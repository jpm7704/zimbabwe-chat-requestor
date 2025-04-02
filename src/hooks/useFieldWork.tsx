
import { useState, useEffect } from 'react';
import { fetchFieldWorkRequests, FieldWorkRequest } from '@/services/requestService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FieldWorkVisitFilters {
  status?: string;
  date?: string;
}

export function useFieldWork(filters?: FieldWorkVisitFilters) {
  const [visits, setVisits] = useState<FieldWorkRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const fetchVisits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user is logged in
      if (!userProfile) {
        setVisits([]);
        return;
      }

      let query = supabase
        .from('field_visits')
        .select('*, request:requests(ticket_number, title)');
      
      // Apply filters if provided
      if (filters) {
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.date) {
          // Filter by specific date if provided
          query = query.gte('visit_date', filters.date)
                       .lt('visit_date', new Date(new Date(filters.date).getTime() + 86400000).toISOString());
        }
      }
      
      // Based on role, fetch appropriate visits
      if (userProfile.role === 'field_officer') {
        // Field officers only see visits assigned to them
        query = query.eq('assigned_officer_id', userProfile.id);
      } else if (['project_officer', 'assistant_project_officer', 'regional_project_officer'].includes(userProfile.role || '')) {
        // Project officers see all visits in their region
        if (userProfile.region) {
          query = query.eq('region', userProfile.region);
        }
      }
      // Programme managers, directors and other management roles see all visits
      
      // Sort by date, most recent first
      query = query.order('visit_date', { ascending: false });
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        // Transform the data to match our FieldWorkRequest interface
        const transformedVisits: FieldWorkRequest[] = data.map(visit => ({
          id: visit.id,
          ticketNumber: visit.request?.ticket_number || 'N/A',
          title: visit.request?.title || visit.purpose || 'Field Visit',
          status: visit.status,
          priority: visit.priority || 'medium',
          dueDate: visit.visit_date,
          location: visit.location,
          assignee: visit.assigned_officer_name || 'Unassigned',
          report: visit.report_submitted ? 'Submitted' : 'Not Submitted',
          requestId: visit.request_id
        }));

        setVisits(transformedVisits);
      } else {
        setVisits([]);
      }
    } catch (err: any) {
      console.error("Error fetching field work visits:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch field work visits'));
      toast({
        title: "Error fetching visits",
        description: err.message || "Failed to load field work visits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [userProfile, filters?.status, filters?.date]);

  const scheduleVisit = async (visitData: Omit<FieldWorkRequest, 'id' | 'ticketNumber'>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('field_visits')
        .insert({
          request_id: visitData.requestId,
          location: visitData.location,
          purpose: visitData.title,
          priority: visitData.priority,
          status: 'scheduled',
          visit_date: visitData.dueDate,
          assigned_officer_id: userProfile?.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Visit scheduled",
        description: "Field visit has been successfully scheduled",
      });
      
      // Refresh the visits list
      fetchVisits();
      
      return data;
    } catch (err: any) {
      console.error("Error scheduling field visit:", err);
      toast({
        title: "Error scheduling visit",
        description: err.message || "Failed to schedule field visit",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVisitStatus = async (visitId: string, status: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('field_visits')
        .update({ status })
        .eq('id', visitId);
      
      if (error) throw error;
      
      toast({
        title: "Visit updated",
        description: `Visit status changed to ${status}`,
      });
      
      // Refresh the visits list
      fetchVisits();
    } catch (err: any) {
      console.error("Error updating field visit:", err);
      toast({
        title: "Error updating visit",
        description: err.message || "Failed to update field visit status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    visits,
    isLoading,
    error,
    fetchVisits,
    scheduleVisit,
    updateVisitStatus
  };
}
