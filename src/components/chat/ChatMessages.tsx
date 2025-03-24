
import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/types";
import ChatMessage from "./ChatMessage";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isTyping: boolean;
}

const ChatMessages = ({ messages, isTyping }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-grow overflow-y-auto p-4">
      {messages.map(message => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isTyping && (
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <div className="bg-secondary rounded-full p-2 mr-2">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
