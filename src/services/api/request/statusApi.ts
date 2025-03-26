
import { RequestStatus, TimelineEvent } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Update a request's status
 */
export const updateRequestStatus = async (
  requestId: string,
  status: RequestStatus,
  note?: string
): Promise<TimelineEvent | null> => {
  try {
    // Get the current user's session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("No authenticated user");
    }
    
    const userId = sessionData.session.user.id;
    
    // Get the current status of the request
    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .select('status')
      .eq('id', requestId)
      .single();
    
    if (requestError) {
      throw requestError;
    }
    
    const oldStatus = requestData.status;
    
    // Update the request status
    const { error: updateError } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', requestId);
    
    if (updateError) {
      throw updateError;
    }
    
    // Create a status update record
    const { data: statusUpdateData, error: statusUpdateError } = await supabase
      .from('status_updates')
      .insert({
        request_id: requestId,
        status,
        notes: note,
        updated_by: userId
      })
      .select()
      .single();
    
    if (statusUpdateError) {
      throw statusUpdateError;
    }
    
    // Get the name of the user who made the update
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('name, role')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error("Error fetching user data:", userError);
    }
    
    // Create and return a timeline event
    const timelineEvent: TimelineEvent = {
      id: statusUpdateData.id,
      requestId,
      type: "status_change",
      description: `Request status updated from ${oldStatus.replace('_', ' ')} to ${status.replace('_', ' ')}`,
      createdAt: statusUpdateData.timestamp,
      createdBy: {
        id: userId,
        name: userData ? userData.name : "Unknown User",
        role: userData ? userData.role : "user"
      },
      metadata: {
        oldStatus,
        newStatus: status,
        note
      }
    };
    
    return timelineEvent;
  } catch (error: any) {
    console.error("Error updating request status:", error);
    toast({
      title: "Status update failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Get status history for a request
 */
export const getStatusHistory = async (requestId: string): Promise<TimelineEvent[]> => {
  try {
    // Fetch status updates
    const { data: statusUpdates, error: statusError } = await supabase
      .from('status_updates')
      .select(`
        id,
        request_id,
        status,
        notes,
        timestamp,
        updated_by
      `)
      .eq('request_id', requestId)
      .order('timestamp', { ascending: false });
    
    if (statusError) {
      throw statusError;
    }

    // If we have no status updates, return empty array
    if (!statusUpdates || statusUpdates.length === 0) {
      return [];
    }

    // Get unique updater IDs
    const updaterIds = [...new Set(statusUpdates.map(update => update.updated_by))];

    // Fetch user profiles for all updaters
    const { data: userProfiles, error: userError } = await supabase
      .from('user_profiles')
      .select('id, name, role')
      .in('id', updaterIds);

    if (userError) {
      console.error("Error fetching user profiles:", userError);
    }

    // Create a map of user profiles for easy lookup
    const userProfileMap = (userProfiles || []).reduce((map, profile) => {
      map[profile.id] = profile;
      return map;
    }, {} as Record<string, any>);
    
    // Transform status updates to timeline events
    return statusUpdates.map(update => {
      const userProfile = userProfileMap[update.updated_by];
      
      return {
        id: update.id,
        requestId: update.request_id,
        type: "status_change",
        description: `Request status updated to ${update.status.replace('_', ' ')}`,
        createdAt: update.timestamp,
        createdBy: {
          id: update.updated_by,
          name: userProfile ? userProfile.name : "Unknown User",
          role: userProfile ? userProfile.role : "user"
        },
        metadata: {
          newStatus: update.status,
          note: update.notes
        }
      };
    });
  } catch (error) {
    console.error("Error fetching status history:", error);
    return [];
  }
};
