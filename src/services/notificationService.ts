
import { Notification, NotificationType } from '@/types';
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
      user_id: notification.user_id,
      type: notification.type as NotificationType,
      title: notification.title,
      content: notification.content,
      created_at: notification.created_at,
      read: notification.read,
      link: notification.link
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
 * Mark a specific notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

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
 * Mark all notifications for the current user as read
 */
export async function markAllNotificationsRead(): Promise<boolean> {
  try {
    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession.session) {
      return false;
    }

    // Get the user's role
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userSession.session.user.id)
      .single();

    if (!userProfile || !userProfile.role) {
      return false;
    }

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
 * Create a notification for specific roles
 */
export async function createNotification(
  type: NotificationType,
  title: string,
  content: string,
  user_id: string,
  link?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        type,
        title,
        content,
        user_id,
        link,
        read: false
      });

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

/**
 * Create a notification for document upload
 */
export async function createDocumentUploadNotification(
  requestId: string,
  documentName: string,
  userId: string
): Promise<void> {
  try {
    // Get request details
    const { data: request } = await supabase
      .from('requests')
      .select('title, ticket_number')
      .eq('id', requestId)
      .single();

    if (!request) return;

    await createNotification(
      'document_upload',
      'New Document Uploaded',
      `A new document "${documentName}" was uploaded for request ${request.ticket_number}: ${request.title}`,
      userId,
      `/requests/${requestId}`
    );
  } catch (error) {
    console.error('Error creating document upload notification:', error);
  }
}
