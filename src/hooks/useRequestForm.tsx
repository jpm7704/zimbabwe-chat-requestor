
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RequestType, RequestTypeInfo, ChatMessage as ChatMessageType } from "@/types";
import { createRequest, getRequestTypeInfo } from "@/services/requestService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useRequestForm = (setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile, isAuthenticated } = useAuth();
  
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requestForm, setRequestForm] = useState<{
    type: string;
    title: string;
    description: string;
  }>({
    type: "",
    title: "",
    description: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [requestTypeInfo, setRequestTypeInfo] = useState<RequestTypeInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (requestForm.type) {
      loadRequestTypeInfo(requestForm.type);
    }
  }, [requestForm.type]);

  const loadRequestTypeInfo = async (type: string) => {
    try {
      const info = await getRequestTypeInfo(type as any);
      if (info) {
        setRequestTypeInfo(info);
      }
    } catch (error) {
      console.error("Error loading request type info:", error);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a request.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Validate form
    if (!requestForm.type || !requestForm.title || !requestForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if required documents are uploaded
    const requiredDocCount = requestTypeInfo?.requiredDocuments.filter(doc => doc.required).length || 0;
    if (selectedFiles.length < requiredDocCount) {
      toast({
        title: "Documents required",
        description: `Please upload all required documents (${requiredDocCount} required).`,
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Cast the string type to RequestType before submitting
      const result = await createRequest({
        type: requestForm.type as RequestType,
        title: requestForm.title,
        description: requestForm.description
      });
      
      // In a real app, we would now upload the files
      // For this demo, we'll just simulate success
      
      toast({
        title: "Request submitted successfully",
        description: `Your request has been submitted with ticket number ${result.ticketNumber}.`,
      });
      
      // Add a message to the chat
      const newMessage: ChatMessageType = {
        id: Date.now().toString(),
        senderId: "system",
        senderType: "system",
        content: `Your request has been submitted successfully! Your ticket number is **${result.ticketNumber}**. This request will now go through our process:\n\n1. Field Officer Verification\n2. Programme Manager Review\n3. Management Approval\n\nYou can track the status of your request in the Requests section.`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Reset form
      setRequestForm({
        type: "",
        title: "",
        description: ""
      });
      setSelectedFiles([]);
      setShowNewRequest(false);
      
      // Navigate to the request
      setTimeout(() => {
        navigate(`/requests/${result.requestId}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // New method to handle request type selection with auth check
  const handleRequestTypeSelect = (type: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a request.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setShowNewRequest(true);
    setRequestForm(prev => ({
      ...prev,
      type
    }));
  };

  return {
    showNewRequest,
    setShowNewRequest,
    requestForm,
    setRequestForm,
    selectedFiles,
    setSelectedFiles,
    requestTypeInfo,
    submitting,
    handleRequestSubmit,
    handleRequestTypeSelect
  };
};
