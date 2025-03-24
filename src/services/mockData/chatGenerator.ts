
import { ChatMessage } from "../../types";

// Generate mock chat messages
export const generateMockChatMessages = (): ChatMessage[] => {
  return [
    {
      id: "1",
      senderId: "system",
      senderType: "system",
      content: "Welcome to the humanitarian assistance support chat. How can I assist you today?",
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "2",
      senderId: "user",
      senderType: "user",
      content: "I need help with medical expenses for my child's treatment. What assistance is available?",
      timestamp: new Date(Date.now() - 86300000).toISOString()
    },
    {
      id: "3",
      senderId: "system",
      senderType: "system",
      content: "For medical assistance applications, you'll need to provide the following documents:\n\n1. National ID or passport\n2. Medical Records\n3. Prescription\n4. Medical Referral (optional)\n\nWould you like to start a new application now?",
      timestamp: new Date(Date.now() - 86200000).toISOString()
    },
    {
      id: "4",
      senderId: "user",
      senderType: "user",
      content: "Yes, I'd like to apply for medical assistance.",
      timestamp: new Date(Date.now() - 86100000).toISOString()
    },
    {
      id: "5",
      senderId: "system",
      senderType: "system",
      content: "I'll guide you through the application process. First, could you tell me about the medical condition and what type of assistance you need?",
      timestamp: new Date(Date.now() - 86000000).toISOString()
    },
    {
      id: "6",
      senderId: "user",
      senderType: "user",
      content: "My child has been diagnosed with asthma and needs ongoing medication. We're struggling to afford the monthly prescriptions.",
      timestamp: new Date(Date.now() - 85900000).toISOString()
    }
  ];
};
