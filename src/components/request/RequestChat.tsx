import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Note } from '@/types';
import { Send, Paperclip, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getRequestNotes, addNoteToRequest } from '@/services/api/requestMutationApi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from './FileUpload';
import { DocumentType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';

interface RequestChatProps {
  requestId: string;
  canAddInternalNotes?: boolean;
}

export function RequestChat({ requestId, canAddInternalNotes = false }: RequestChatProps) {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showingUpload, setShowingUpload] = useState(false);
  const [isInternalNote, setIsInternalNote] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadNotes = async () => {
    try {
      const canSeeInternalNotes = userProfile?.role !== 'user';
      const fetchedNotes = await getRequestNotes(requestId, canSeeInternalNotes);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversation history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
    
    const subscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `request_id=eq.${requestId}`,
      }, (payload) => {
        loadNotes();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [notes]);

  const handleSendMessage = async () => {
    if (!message.trim() || !userProfile) return;
    
    setSending(true);
    try {
      await addNoteToRequest(requestId, message, isInternalNote);
      setMessage('');
      setIsInternalNote(false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return timestamp;
    }
  };

  const getMessageClasses = (note: Note) => {
    const isMine = note.authorId === userProfile?.id;
    const isSystemOrInternal = note.isInternal;
    
    if (isSystemOrInternal) {
      return 'bg-secondary/20 border-secondary-foreground/10';
    } else if (isMine) {
      return 'bg-primary/10 border-primary/20 ml-auto';
    } else {
      return 'bg-card border-border';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 px-4 py-3">
        <CardTitle className="text-lg">Communication</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col h-[400px]">
          <ScrollArea className="flex-grow p-4">
            {loading ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-20 w-[300px]" />
                  </div>
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-12 w-[300px]" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            ) : notes.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mb-2 mx-auto opacity-30" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="flex items-start gap-3">
                    {note.authorId !== userProfile?.id && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={note.authorName} />
                        <AvatarFallback>{getInitials(note.authorName)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 max-w-[80%] border ${getMessageClasses(note)}`}
                    >
                      <div className="flex justify-between items-center gap-4 mb-1">
                        <span className="font-medium text-sm">
                          {note.authorId === userProfile?.id ? 'You' : note.authorName}
                          {note.isInternal && ' (Internal Note)'}
                        </span>
                        <span className="text-muted-foreground text-xs flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(note.createdAt)}
                        </span>
                      </div>
                      <p className="whitespace-pre-line">{note.content}</p>
                    </div>
                    {note.authorId === userProfile?.id && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt="You" />
                        <AvatarFallback>{userProfile ? getInitials(userProfile.first_name + ' ' + userProfile.last_name) : 'ME'}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
          
          {showingUpload ? (
            <div className="p-4 border-t">
              <FileUpload
                requestId={requestId}
                documentType="supporting_letter"
                onUploadComplete={() => setShowingUpload(false)}
              />
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={() => setShowingUpload(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="p-4 border-t">
              {canAddInternalNotes && (
                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    id="internal-note"
                    checked={isInternalNote}
                    onCheckedChange={setIsInternalNote}
                  />
                  <label
                    htmlFor="internal-note"
                    className="text-sm cursor-pointer"
                  >
                    Internal note (only visible to staff)
                  </label>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowingUpload(true)}
                  disabled={sending}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Type your message here"
                  className="flex-1 min-h-[2.5rem] h-[2.5rem] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={sending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
