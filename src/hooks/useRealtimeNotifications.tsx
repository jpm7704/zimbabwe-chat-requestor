
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Notification } from '@/types';

export const useRealtimeNotifications = () => {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!userProfile || userProfile.role === 'user') return;
    
    // Subscribe to notifications table changes
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `target_roles=cs.{${userProfile.role}}`
        },
        (payload) => {
          // Update notification count in cache
          queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
          
          // Add to notifications cache
          queryClient.setQueryData(['notifications'], (oldData: Notification[] | undefined) => {
            const newNotification: Notification = {
              id: payload.new.id,
              type: payload.new.type,
              title: payload.new.title,
              message: payload.new.message,
              createdAt: payload.new.created_at,
              read: payload.new.read,
              link: payload.new.link || '',
              targetRoles: payload.new.target_roles,
              relatedId: payload.new.related_id
            };
            
            // Show toast for new notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
              action: {
                altText: "View notification",
                children: "View",
                onClick: () => window.location.href = newNotification.link || ''
              }
            });
            
            // Add to the existing notifications or create new array
            return oldData ? [newNotification, ...oldData] : [newNotification];
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile, queryClient, toast]);
};
