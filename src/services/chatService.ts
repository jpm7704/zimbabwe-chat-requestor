
import { ChatMessage as ChatMessageType } from "@/types";

// Local interface for backward compatibility
export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isSystemMessage?: boolean;
}

export const sendMessage = async (
  requestId: string,
  message: string,
  senderId: string
): Promise<ChatMessageType> => {
  console.log("[chatService] sendMessage called", { requestId, message, senderId });
  try {
    // This will be connected to a real API in the future
    const newMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      content: message,
      senderId: senderId,
      senderType: "user", // default sender type
      timestamp: new Date().toISOString(),
    };
    console.log("[chatService] sendMessage success", newMessage);
    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message. Please try again.");
  }
};

export const fetchMessages = async (requestId: string): Promise<ChatMessageType[]> => {
  console.log("[chatService] fetchMessages called", { requestId });
  try {
    // This will be connected to a real API in the future
    const messages: ChatMessageType[] = [];
    console.log("[chatService] fetchMessages success", messages);
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to load messages. Please try again.");
  }
};

// Function to get chat history
export const getChatHistory = async (): Promise<ChatMessageType[]> => {
  console.log("[chatService] getChatHistory called");
  try {
    // This will be connected to a real API in the future
    const history: ChatMessageType[] = [];
    console.log("[chatService] getChatHistory success", history);
    return history;
  } catch (error) {
    console.error("Error loading chat history:", error);
    throw new Error("Failed to load chat history. Please try again.");
  }
};
