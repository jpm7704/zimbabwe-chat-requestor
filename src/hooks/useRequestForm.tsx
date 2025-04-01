
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RequestType, RequestTypeInfo, ChatMessage as ChatMessageType, RequestStatus } from "@/types";
import { createRequest, getRequestTypeInfo } from "@/services/requestService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useRequestForm = (setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [isEnquiry, setIsEnquiry] = useState(false);
  const [requestForm, setRequestForm] = useState<{
    type: string;
    title: string;
    description: string;
    isEnquiry: boolean;
  }>({
    type: "",
    title: "",
    description: "",
    isEnquiry: false
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [requestTypeInfo, setRequestTypeInfo] = useState<RequestTypeInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Initialize form with URL parameters if available
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const enquiryParam = searchParams.get('enquiry');
    
    if (typeParam) {
      setShowNewRequest(true);
      setRequestForm(prev => ({
        ...prev,
        type: typeParam,
        isEnquiry: enquiryParam === 'true'
      }));
      setIsEnquiry(enquiryParam === 'true');
    }
  }, [searchParams]);

  useEffect(() => {
    if (requestForm.type) {
      loadRequestTypeInfo(requestForm.type);
    }
  }, [requestForm.type]);

  // Update request form when isEnquiry changes
  useEffect(() => {
    setRequestForm(prev => ({
      ...prev,
      isEnquiry
    }));
  }, [isEnquiry]);

  const loadRequestTypeInfo = async (type: string) => {
    try {
      const info = await getRequestTypeInfo(type);
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
    
    // Check if required documents are uploaded (for applications only, not enquiries)
    if (!isEnquiry && !requestForm.isEnquiry) {
      const requiredDocCount = requestTypeInfo?.requiredDocuments.filter(doc => doc.required).length || 0;
      if (selectedFiles.length < requiredDocCount) {
        toast({
          title: "Documents required",
          description: `Please upload all required documents (${requiredDocCount} required).`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setSubmitting(true);
    
    try {
      // Cast the string type to RequestType before submitting
      // Include isEnquiry flag with the request
      const result = await createRequest({
        type: requestForm.type as RequestType,
        title: requestForm.title,
        description: requestForm.description,
        isEnquiry: isEnquiry || requestForm.isEnquiry
      });

      if (!result) {
        throw new Error("Failed to create request");
      }
      
      // In a real app, we would now upload the files
      // For this demo, we'll just simulate success
      
      // Different success message for enquiries vs applications
      toast({
        title: isEnquiry || requestForm.isEnquiry ? "Enquiry submitted successfully" : "Request submitted successfully",
        description: `Your ${isEnquiry || requestForm.isEnquiry ? "enquiry" : "request"} has been submitted with ticket number ${result.ticketNumber}.`,
      });
      
      // Add a message to the chat explaining the workflow
      const newMessage: ChatMessageType = {
        id: Date.now().toString(),
        senderId: "system",
        senderType: "system",
        content: isEnquiry || requestForm.isEnquiry 
          ? `Your enquiry has been submitted successfully! Your ticket number is **${result.ticketNumber}**. \n\nYour enquiry will be reviewed by our team:\n\n1. Initial Assessment\n2. Assignment to Appropriate Department\n3. Specialist Review\n4. Follow-up Communication\n\nYou can track the status of your enquiry in the Requests section.`
          : `Your request has been submitted successfully! Your ticket number is **${result.ticketNumber}**. \n\nYour request will now go through our review process:\n\n1. Head of Programs Review\n2. Assignment to Assistant Project Officer\n3. Field Assessment by Regional Project Officer\n4. Final Review and Approval\n\nYou can track the status of your request in the Requests section.`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Reset form
      setRequestForm({
        type: "",
        title: "",
        description: "",
        isEnquiry: false
      });
      setSelectedFiles([]);
      setShowNewRequest(false);
      setIsEnquiry(false);
      
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
    isEnquiry,
    setIsEnquiry,
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
