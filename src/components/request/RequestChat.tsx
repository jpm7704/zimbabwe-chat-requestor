import { useState, useEffect } from 'react';
import { Send, PaperclipIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ChatMessage } from '@/types';
import FileUpload from "./FileUpload";
import { addNoteToRequest } from '@/services/api/requestMutationApi';

interface RequestChatProps {
  requestId: string;
  initialMessages: ChatMessage[];
  canUploadFiles?: boolean;
  canAddNotes?: boolean;
  onNewMessage?: (message: ChatMessage) => void;
}

const RequestChat = ({ 
  requestId, 
  initialMessages,
  canUploadFiles = true,
  canAddNotes = true,
  onNewMessage
}: RequestChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    try {
      setLoading(true);
      
      // Add the note to the request
      await addNoteToRequest(requestId, newMessage);
      
      // Create a new chat message object
      const newChatMessage: ChatMessage = {
        id: Date.now().toString(), // Temporary ID
        senderId: 'user', // Replace with actual user ID
        senderType: 'staff',
        content: newMessage,
        timestamp: new Date().toISOString(),
        attachments: []
      };
      
      // Update the messages state
      setMessages(prevMessages => [...prevMessages, newChatMessage]);
      
      // Clear the input field
      setNewMessage('');
      
      // Notify parent component about the new message
      if (onNewMessage) {
        onNewMessage(newChatMessage);
      }
      
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileUploadComplete = () => {
    setUploading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1">
        <ScrollArea className="h-full">
          <div className="flex flex-col space-y-4 p-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id} className="flex flex-col">
                  <div className="flex items-end">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-sm font-medium">{message.senderType === 'system' ? 'System' : 'Staff'}</p>
                      <div className="relative">
                        <div className="px-4 py-2 rounded-lg bg-muted w-fit">
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="absolute text-[0.7rem] bottom-0 left-2 text-gray-500">{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No messages yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      <Separator />
      
      {/* File Upload */}
      {canUploadFiles && (
        <div className="p-4">
          <h4 className="mb-2 text-sm font-medium">Attachments</h4>
          <FileUpload requestId={requestId} onUploadComplete={handleFileUploadComplete} />
        </div>
      )}
      
      {/* Message Input */}
      {canAddNotes && (
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter your message here"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={loading}>
              {loading ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestChat;
