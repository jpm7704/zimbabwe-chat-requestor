
import { Notification } from '@/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets all notifications for the current user based on their role
 */
export async function getNotifications(): Promise<Notification[]> {
  try {
    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession.session) {
      return [];
    }

    // Get the user's role from their profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userSession.session.user.id)
      .single();

    if (!userProfile || !userProfile.role) {
      return [];
    }

    // Query notifications where target_roles contains the user's role
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .contains('target_roles', [userProfile.role])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      createdAt: notification.created_at,
      read: notification.read,
      link: notification.link,
      targetRoles: notification.target_roles,
      relatedId: notification.related_id
    }));
  } catch (error) {
    console.error('Error in getNotifications:', error);
    return [];
  }
}

/**
 * Gets the count of unread notifications for the current user
 */
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession.session) {
      return 0;
    }

    // Get the user's role from their profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userSession.session.user.id)
      .single();

    if (!userProfile || !userProfile.role) {
      return 0;
    }

    // Count unread notifications for the user's role
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .contains('target_roles', [userProfile.role])
      .eq('read', false);

    if (error) {
      console.error('Error counting unread notifications:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getUnreadNotificationCount:', error);
    return 0;
  }
}

/**
 * Marks a notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select();

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markNotificationRead:', error);
    return false;
  }
}

/**
 * Marks all notifications as read for the current user's role
 */
export async function markAllNotificationsRead(): Promise<boolean> {
  try {
    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession.session) {
      return false;
    }

    // Get the user's role from their profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userSession.session.user.id)
      .single();

    if (!userProfile || !userProfile.role) {
      return false;
    }

    // Update all unread notifications for this role
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .contains('target_roles', [userProfile.role])
      .eq('read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markAllNotificationsRead:', error);
    return false;
  }
}

/**
 * Creates a new notification
 */
export async function createNotification(
  type: string,
  title: string,
  message: string,
  targetRoles: string[],
  link?: string,
  relatedId?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          type,
          title,
          message,
          target_roles: targetRoles,
          link,
          related_id: relatedId,
          read: false
        }
      ])
      .select();

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createNotification:', error);
    return false;
  }
}
