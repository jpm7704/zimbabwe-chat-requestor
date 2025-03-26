
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Request, RequestStatus, RequestType } from '@/types';
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
        // Fetch requests without joining user profiles
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
            program_manager_id
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

        // If we have requests, fetch user profiles separately
        if (data.length > 0) {
          // Get unique user IDs
          const userIds = [...new Set([
            ...data.map(item => item.user_id),
            ...data.map(item => item.field_officer_id).filter(Boolean),
            ...data.map(item => item.program_manager_id).filter(Boolean)
          ])];

          // Fetch all relevant user profiles in one query
          const { data: userProfiles, error: userError } = await supabase
            .from('user_profiles')
            .select('id, name, email, role')
            .in('id', userIds);

          if (userError) {
            console.error('Error fetching user profiles:', userError);
          }

          // Create a map of user profiles for easy lookup
          const userProfileMap = (userProfiles || []).reduce((map, profile) => {
            map[profile.id] = profile;
            return map;
          }, {} as Record<string, any>);

          // Transform the data to match the Request type
          const transformedRequests = data.map(item => ({
            id: item.id,
            ticketNumber: item.ticket_number,
            userId: item.user_id,
            type: item.type as RequestType,
            title: item.title,
            description: item.description,
            status: item.status as RequestStatus,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            assignedTo: item.field_officer_id || item.program_manager_id,
            user: userProfileMap[item.user_id] ? {
              id: userProfileMap[item.user_id].id,
              name: userProfileMap[item.user_id].name,
              email: userProfileMap[item.user_id].email,
              role: userProfileMap[item.user_id].role
            } : undefined,
            fieldOfficer: item.field_officer_id ? {
              id: userProfileMap[item.field_officer_id]?.id,
              name: userProfileMap[item.field_officer_id]?.name,
              email: userProfileMap[item.field_officer_id]?.email,
              role: userProfileMap[item.field_officer_id]?.role
            } : undefined,
            programManager: item.program_manager_id ? {
              id: userProfileMap[item.program_manager_id]?.id,
              name: userProfileMap[item.program_manager_id]?.name,
              email: userProfileMap[item.program_manager_id]?.email,
              role: userProfileMap[item.program_manager_id]?.role
            } : undefined,
            documents: [], // These will be fetched separately if needed
            notes: [],     // These will be fetched separately if needed
            timeline: []   // These will be fetched separately if needed
          }));

          setRequests(transformedRequests);
        } else {
          setRequests([]);
        }
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
