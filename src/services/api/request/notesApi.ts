
import { TimelineEvent, Note } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Add a note to a request
 */
export const addNoteToRequest = async (
  requestId: string,
  content: string,
  isInternal: boolean = false
): Promise<{ note: Note | null, timelineEvent: TimelineEvent | null }> => {
  try {
    // Get the current user's session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("No authenticated user");
    }
    
    const userId = sessionData.session.user.id;
    
    // Get the user's profile
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('name, role')
      .eq('id', userId)
      .single();
    
    if (userError) {
      throw userError;
    }
    
    // Create a message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        request_id: requestId,
        sender_id: userId,
        content,
        is_system_message: isInternal
      })
      .select()
      .single();
    
    if (messageError) {
      throw messageError;
    }
    
    // Prepare the note object
    const note: Note = {
      id: messageData.id,
      requestId,
      authorId: userId,
      authorName: userData.name,
      authorRole: userData.role,
      content,
      createdAt: messageData.timestamp,
      isInternal
    };
    
    // Prepare the timeline event
    const timelineEvent: TimelineEvent = {
      id: messageData.id,
      requestId,
      type: "note_added",
      description: `New ${isInternal ? 'internal ' : ''}note added by ${userData.name}`,
      createdAt: messageData.timestamp,
      createdBy: {
        id: userId,
        name: userData.name,
        role: userData.role
      },
      metadata: {
        noteId: messageData.id,
        isInternal
      }
    };
    
    return { note, timelineEvent };
  } catch (error: any) {
    console.error("Error adding note:", error);
    toast({
      title: "Failed to add note",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return { note: null, timelineEvent: null };
  }
};

/**
 * Get all notes for a request
 */
export const getRequestNotes = async (requestId: string, includeInternal: boolean = false): Promise<Note[]> => {
  try {
    let query = supabase
      .from('messages')
      .select(`
        id,
        request_id,
        sender_id,
        content,
        timestamp,
        is_system_message,
        user:user_profiles(id, name, email, role)
      `)
      .eq('request_id', requestId);
    
    if (!includeInternal) {
      query = query.eq('is_system_message', false);
    }
    
    const { data, error } = await query.order('timestamp', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data.map(message => ({
      id: message.id,
      requestId: message.request_id,
      authorId: message.sender_id,
      authorName: message.user ? message.user.name : "Unknown User",
      authorRole: message.user ? message.user.role : "user",
      content: message.content,
      createdAt: message.timestamp,
      isInternal: message.is_system_message || false
    }));
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};
