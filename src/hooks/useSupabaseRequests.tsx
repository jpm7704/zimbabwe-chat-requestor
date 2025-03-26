
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Request, RequestStatus } from '@/types';
import { useAuth } from './useAuth';

export const useSupabaseRequests = (filter?: RequestStatus) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userProfile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let query = supabase
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
            user_id,
            field_officer_id,
            program_manager_id,
            user:user_profiles!user_id(name, email, role),
            field_officer:user_profiles!field_officer_id(name, email, role),
            program_manager:user_profiles!program_manager_id(name, email, role)
          `);

        // Apply role-based filters
        if (userProfile.role === 'user') {
          query = query.eq('user_id', userProfile.id);
        } else if (userProfile.role === 'field_officer') {
          query = query.eq('field_officer_id', userProfile.id);
        } else if (userProfile.role === 'programme_manager') {
          query = query.eq('program_manager_id', userProfile.id);
        }
        // Management users can see all requests

        // Apply status filter if provided
        if (filter) {
          query = query.eq('status', filter);
        }

        // Order by most recent first
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        // Transform the data to match the Request type
        const transformedRequests = data.map(item => ({
          id: item.id,
          ticketNumber: item.ticket_number,
          userId: item.user_id,
          type: item.type,
          title: item.title,
          description: item.description,
          status: item.status,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          assignedTo: item.field_officer_id || item.program_manager_id,
          user: item.user ? {
            id: item.user.id,
            name: item.user.name,
            email: item.user.email,
            role: item.user.role
          } : undefined,
          fieldOfficer: item.field_officer,
          programManager: item.program_manager,
          documents: [], // These will be fetched separately if needed
          notes: [],     // These will be fetched separately if needed
          timeline: []   // These will be fetched separately if needed
        }));

        setRequests(transformedRequests);
      } catch (err: any) {
        console.error('Error fetching requests:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userProfile, filter]);

  return { requests, loading, error };
};
