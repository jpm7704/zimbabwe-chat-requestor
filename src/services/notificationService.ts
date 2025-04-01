
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
      .rpc('get_notifications_for_role', { user_role: userProfile.role });
    
    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
    
    // Transform received data to match our Notification type
    return Array.isArray(data) ? data.map((item): Notification => ({
      id: item.id,
      type: item.type as NotificationType,
      title: item.title,
      message: item.message,
      createdAt: item.created_at,
      read: item.read,
      link: item.link || '',
      targetRoles: item.target_roles,
      relatedId: item.related_id
    })) : [];
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
    const { data, error } = await supabase
      .rpc('get_unread_notification_count', { user_role: userProfile.role });
    
    if (error) {
      console.error("Error fetching notification count:", error);
      return 0;
    }
    
    return data || 0;
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
    // Update the notification
    const { error } = await supabase
      .rpc('mark_notification_read', { notification_id: notificationId });
    
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
      .rpc('mark_all_notifications_read', { user_role: userProfile.role });
    
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
    
    // Use the dedicated RPC function to create notification
    const { error } = await supabase
      .rpc('create_notification', {
        notification_type: 'document_upload',
        notification_title: 'New document uploaded',
        notification_message: `A new document "${documentName}" has been uploaded for request ${requestTicketNumber}`,
        target_roles_array: targetRoles,
        link_path: `/requests/${requestId}`,
        related_id_param: requestId
      });
    
    if (error) {
      console.error("Error creating document upload notification:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in createDocumentUploadNotification:", error);
    // Just log error but don't throw - notifications are not critical to app function
  }
};
