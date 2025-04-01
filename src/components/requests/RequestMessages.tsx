
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Note } from '@/types';
import { addNoteToRequest } from '@/services/requestService';
import { useToast } from '@/hooks/use-toast';

interface RequestMessagesProps {
  requestId: string;
}

const RequestMessages = ({ requestId }: RequestMessagesProps) => {
  const [messages, setMessages] = useState<Note[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        const { data: messages, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            timestamp,
            is_system_message,
            sender_id
          `)
          .eq('request_id', requestId)
          .order('timestamp', { ascending: true });
        
        if (error) throw error;
        
        // Get user information for each message
        const notes: Note[] = [];
        for (const msg of messages) {
          // Get user info for this message
          const { data: sender } = await supabase
            .from('user_profiles')
            .select('name, role')
            .eq('id', msg.sender_id)
            .single();
          
          notes.push({
            id: msg.id,
            requestId,
            authorId: msg.sender_id,
            authorName: sender?.name || 'Unknown User',
            authorRole: sender?.role || 'user',
            content: msg.content,
            createdAt: msg.timestamp,
            isInternal: msg.is_system_message
          });
        }
        
        setMessages(notes);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [requestId]);
  
  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setSubmitting(true);
      
      await addNoteToRequest(requestId, newMessage);
      
      // Add optimistic update
      const tempId = `temp-${Date.now()}`;
      const { data: userData } = await supabase.auth.getUser();
      
      // Get the user profile
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('name, role')
        .eq('id', userData.user?.id)
        .single();
      
      const optimisticNote: Note = {
        id: tempId,
        requestId,
        authorId: userData.user?.id || '',
        authorName: userProfile?.name || 'You',
        authorRole: userProfile?.role || 'user',
        content: newMessage,
        createdAt: new Date().toISOString(),
        isInternal: false
      };
      
      setMessages(prev => [...prev, optimisticNote]);
      setNewMessage('');
      
      toast({
        title: 'Message sent',
        description: 'Your message has been added to the request.'
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.isInternal ? 'bg-secondary/20 p-3 rounded-md' : ''}`}
            >
              <Avatar className="h-9 w-9 mr-3">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {message.authorName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-baseline mb-1">
                  <p className="font-medium text-sm">{message.authorName}</p>
                  <span className="text-xs text-muted-foreground ml-2">
                    {message.authorRole.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {format(new Date(message.createdAt), 'PPp')}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="relative">
        <Textarea
          placeholder="Type your message here..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="min-h-[100px] pr-16"
        />
        <Button
          className="absolute bottom-2 right-2"
          size="icon"
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || submitting}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default RequestMessages;
