
import { useState, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "@/types";
import { getChatHistory, sendMessage } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

export const useChatMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await getChatHistory();
        setMessages(history);
      } catch (error) {
        console.error("Error loading chat history:", error);
        toast({
          title: "Error",
          description: "Failed to load chat history. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadChatHistory();
  }, [toast]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      senderId: "user",
      senderType: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);
    
    try {
      const response = await sendMessage(inputMessage);
      
      // Slight delay to simulate typing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isTyping,
    handleSendMessage
  };
};
