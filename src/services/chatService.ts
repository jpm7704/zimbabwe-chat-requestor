
import { ChatMessage } from "../types";
import { generateMockChatMessages } from "./mockData";
import { getRequestTypeInfo } from "./requestService";

// Mock delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get chat history
export const getChatHistory = async (): Promise<ChatMessage[]> => {
  await delay(500);
  return generateMockChatMessages();
};

// Send a message and get a response
export const sendMessage = async (content: string): Promise<ChatMessage> => {
  await delay(800);
  
  // Generate a fake response based on the content
  let responseContent = "";
  
  if (content.toLowerCase().includes("funding") || content.toLowerCase().includes("money")) {
    responseContent = "To apply for funding, you'll need to complete our application process. I can help guide you through this. First, could you tell me more about your business and what you need funding for?";
  } else if (content.toLowerCase().includes("document") || content.toLowerCase().includes("require")) {
    responseContent = "Required documents vary depending on the type of support you're seeking. Generally, you'll need your national ID, business registration documents, and financial statements. Is there a specific type of support you're interested in?";
  } else if (content.toLowerCase().includes("status") || content.toLowerCase().includes("track")) {
    responseContent = "You can track the status of your request using the ticket number provided when you submitted your application. Would you like me to check the status of a specific request?";
  } else if (content.toLowerCase().includes("time") || content.toLowerCase().includes("long")) {
    responseContent = "The processing time varies depending on the type of request and the current volume. Typically, initial review takes 3-5 business days, and the entire process may take 2-4 weeks.";
  } else {
    responseContent = "Thank you for your message. How else can I assist you with your BGF request today?";
  }
  
  return {
    id: Math.random().toString(36).substring(2, 15),
    senderId: "system",
    senderType: "system",
    content: responseContent,
    timestamp: new Date().toISOString()
  };
};

// Get information about a specific request type
export const getRequestTypeDetails = async (type: string): Promise<string> => {
  const requestTypeInfo = await getRequestTypeInfo(type as any);
  
  if (!requestTypeInfo) {
    return "I couldn't find information about that request type. Please try another one or ask about our available support programs.";
  }
  
  let response = `**${requestTypeInfo.name}**\n\n${requestTypeInfo.description}\n\n**Required Documents:**\n`;
  
  requestTypeInfo.requiredDocuments.forEach((doc, index) => {
    response += `${index + 1}. ${doc.name}${doc.required ? ' (Required)' : ' (Optional)'}: ${doc.description}\n`;
  });
  
  return response;
};

// Upload a file in chat
export const uploadChatFile = async (file: File): Promise<string> => {
  await delay(1500);
  
  // In a real app, this would upload to a server
  return URL.createObjectURL(file); // Temporary URL for mock purposes
};
