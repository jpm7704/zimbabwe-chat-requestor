
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getUnreadNotificationsCount
} from '@/services/notificationService';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { userProfile } = useAuth();
  
  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    enabled: !!userProfile && userProfile.role !== 'user',
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    notifications: data,
    isLoading,
    error,
    refetch
  };
};

export const useUnreadNotificationsCount = () => {
  const { userProfile } = useAuth();
  
  const {
    data = 0,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: getUnreadNotificationsCount,
    enabled: !!userProfile && userProfile.role !== 'user',
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refresh every 2 minutes
  });

  return {
    unreadCount: data,
    isLoading,
    error,
    refetch
  };
};

export const useMarkNotificationAsRead = (notificationId: string) => {
  const [isMarking, setIsMarking] = useState(false);
  const queryClient = useQueryClient();

  const markAsRead = async () => {
    try {
      setIsMarking(true);
      await markNotificationAsRead(notificationId);
      
      // Update the notifications cache
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    } finally {
      setIsMarking(false);
    }
  };

  return { markAsRead, isMarking };
};

export const useMarkAllNotificationsAsRead = () => {
  const [isMarking, setIsMarking] = useState(false);
  const queryClient = useQueryClient();

  const markAllAsRead = async () => {
    try {
      setIsMarking(true);
      await markAllNotificationsAsRead();
      
      // Update the notifications cache
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    } finally {
      setIsMarking(false);
    }
  };

  return { markAllAsRead, isMarking };
};
