
import { useToast } from "@/hooks/use-toast";
import { ChatMessage as ChatMessageType } from "@/types";

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isSystemMessage?: boolean;
}

export const sendMessage = async (requestId: string, message: string, senderId: string): Promise<ChatMessageType> => {
  try {
    // This will be connected to a real API in the future
    const newMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      content: message,
      senderId: senderId,
      senderType: "user", // default sender type
      timestamp: new Date().toISOString(),
    };
    
    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message. Please try again.");
  }
};

export const fetchMessages = async (requestId: string): Promise<ChatMessageType[]> => {
  try {
    // This will be connected to a real API in the future
    return [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to load messages. Please try again.");
  }
};

// Adding the missing getChatHistory function
export const getChatHistory = async (): Promise<ChatMessageType[]> => {
  try {
    // This will be connected to a real API in the future
    return [];
  } catch (error) {
    console.error("Error loading chat history:", error);
    throw new Error("Failed to load chat history. Please try again.");
  }
};
