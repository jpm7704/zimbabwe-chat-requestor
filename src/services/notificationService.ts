
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationType } from "@/types";

/**
 * Get all notifications for the current user based on their role
 */
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    // Get the current user session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return [];
    }
    
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.session.user.id)
      .single();
      
    if (!userProfile) {
      return [];
    }
    
    // Get notifications for the user based on their role and role hierarchy
    const { data, error } = await supabase
      .from('notifications')
      .select()
      .filter('target_roles', 'cs', `{${userProfile.role}}`)
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
    
    // Transform received data to match our Notification type
    return (data || []).map((item): Notification => ({
      id: item.id,
      type: item.type as NotificationType,
      title: item.title,
      message: item.message,
      createdAt: item.created_at,
      read: item.read,
      link: item.link || '',
      targetRoles: item.target_roles,
      relatedId: item.related_id
    }));
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return [];
  }
};

/**
 * Get count of unread notifications for the current user
 */
export const getUnreadNotificationsCount = async (): Promise<number> => {
  try {
    // Get the current user session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return 0;
    }
    
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.session.user.id)
      .single();
      
    if (!userProfile) {
      return 0;
    }
    
    // Count unread notifications for the user based on their role
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .filter('target_roles', 'cs', `{${userProfile.role}}`)
      .eq('read', false);
    
    if (error) {
      console.error("Error fetching notification count:", error);
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error in getUnreadNotificationsCount:", error);
    return 0;
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    throw error;
  }
};

/**
 * Mark all notifications for the current user as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    // Get the current user session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return;
    }
    
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.session.user.id)
      .single();
      
    if (!userProfile) {
      return;
    }
    
    // Mark all unread notifications as read
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .filter('target_roles', 'cs', `{${userProfile.role}}`)
      .eq('read', false);
    
    if (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in markAllNotificationsAsRead:", error);
    throw error;
  }
};

/**
 * Create a notification when a document is uploaded
 */
export const createDocumentUploadNotification = async (
  requestId: string,
  requestTicketNumber: string,
  documentName: string,
): Promise<void> => {
  try {
    // Create a notification for relevant roles
    // Field officers and project officers should be notified
    const targetRoles = ['field_officer', 'project_officer', 'regional_project_officer', 'assistant_project_officer', 'programme_manager', 'head_of_programs'];
    
    const { error } = await supabase
      .from('notifications')
      .insert({
        type: 'document_upload',
        title: 'New document uploaded',
        message: `A new document "${documentName}" has been uploaded for request ${requestTicketNumber}`,
        target_roles: targetRoles,
        link: `/requests/${requestId}`,
        related_id: requestId,
        read: false
      });
    
    if (error) {
      console.error("Error creating document upload notification:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in createDocumentUploadNotification:", error);
    throw error;
  }
};
