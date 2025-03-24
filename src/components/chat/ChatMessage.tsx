
import { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div 
      className={`flex flex-col max-w-[80%] ${
        message.senderType === "user" ? "items-end ml-auto" : "items-start"
      } mb-4 animate-fade-in`}
    >
      <div className={`px-4 py-3 rounded-2xl ${
        message.senderType === "user" 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-secondary text-secondary-foreground rounded-tl-none"
      }`}>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
      <div className={`text-xs text-muted-foreground mt-1 ${
        message.senderType === "user" ? "text-right" : "text-left"
      }`}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default ChatMessage;
