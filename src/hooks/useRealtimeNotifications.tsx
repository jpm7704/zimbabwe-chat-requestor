
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ToastAction } from '@/components/ui/toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { markNotificationRead } from '@/services/notificationService';

export function useRealtimeNotifications() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Safely access the query client
  let queryClient;
  try {
    queryClient = useQueryClient();
  } catch (error) {
    console.error("QueryClient not available:", error);
    // We'll continue without the queryClient
  }

  // Subscribe to realtime updates
  useEffect(() => {
    if (!userProfile) return;

    const channel = supabase
      .channel('notifications-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `target_roles=cs.{${userProfile.role}}`,
      }, handleNewNotification)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile]);

  // Handle incoming notifications
  const handleNewNotification = async (payload: any) => {
    const notification = payload.new;
    
    if (!userProfile || !notification) return;

    // Check if the notification is targeting the user's role
    if (notification.target_roles?.includes(userProfile.role)) {
      // Invalidate queries to force refetch of notifications
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
      
      // Increment notification count
      setNotificationCount(prev => prev + 1);

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
        action: notification.link ? (
          <ToastAction 
            altText="View"
            onClick={() => {
              // Mark as read
              markNotificationRead(notification.id);
              // Navigate to the related page
              navigate(notification.link || '/');
            }}
          >
            View
          </ToastAction>
        ) : undefined,
      });
    }
  };

  return { notificationCount };
}
