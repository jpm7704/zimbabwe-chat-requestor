import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RequestType, RequestTypeInfo, ChatMessage } from "@/types";
import { createRequest } from "@/services/requestService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "react-query";

interface RequestSubmissionResult {
  isSuccess: boolean;
  requestId?: string;
  ticketNumber?: string;
  errorMessage?: string;
  isLoading: boolean;
}

/**
 * Hook for handling request form submission
 */
export const useRequestSubmission = (
  requestForm: { 
    type: string; 
    title: string; 
    description: string; 
    isEnquiry: boolean 
  },
  selectedFiles: File[],
  requestTypeInfo: RequestTypeInfo | null,
  setShowNewRequest: (show: boolean) => void,
  setRequestForm: React.Dispatch<React.SetStateAction<{
    type: string;
    title: string;
    description: string;
    isEnquiry: boolean;
  }>>,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>,
  isEnquiry: boolean
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile, isAuthenticated } = useAuth();
  const [submitting, setSubmitting] = useState(false);

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
      
      // Different success message for enquiries vs applications
      toast({
        title: isEnquiry || requestForm.isEnquiry ? "Enquiry submitted successfully" : "Request submitted successfully",
        description: `Your ${isEnquiry || requestForm.isEnquiry ? "enquiry" : "request"} has been submitted with ticket number ${result.ticketNumber}.`,
      });
      
      // Add a message to the chat explaining the workflow
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: "system",
        senderType: "system",
        content: isEnquiry || requestForm.isEnquiry 
          ? `Your enquiry has been submitted successfully! Your ticket number is **${result.ticketNumber}**. \n\nYour enquiry will be reviewed by our team:\n\n1. Initial Assessment\n2. Assignment to Appropriate Department\n3. Specialist Review\n4. Follow-up Communication\n\nYou can track the status of your enquiry in the Requests section.`
          : `Your request has been submitted successfully! Your ticket number is **${result.ticketNumber}**. \n\nYour request will now go through our review process:\n\n1. Head of Programs Review\n2. Assignment to Assistant Project Officer\n3. Field Assessment by Regional Project Officer\n4. Final Review and Approval\n\nYou can track the status of your request in the Requests section.`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Reset form
      setRequestForm({
        type: "",
        title: "",
        description: "",
        isEnquiry: false
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

  // Method to handle request type selection with auth check
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

  return { submitting, handleRequestSubmit, handleRequestTypeSelect };
};

export function useRequestSubmission() {
  const [result, setResult] = useState<RequestSubmissionResult>({
    isSuccess: false,
    isLoading: false,
  });
  
  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData: {
      title: string;
      description: string;
      type: string;
      documents: File[];
      isEnquiry?: boolean;
    }) => {
      // Create the request
      const requestResult = await createRequest({
        title: formData.title,
        description: formData.description,
        type: formData.type,
      });

      if (!requestResult) {
        throw new Error('Failed to create request');
      }

      const { requestId, ticketNumber } = requestResult;

      // Upload any documents
      if (formData.documents && formData.documents.length > 0) {
        await Promise.all(
          formData.documents.map(async (file) => {
            await uploadDocument(
              requestId,
              file,
              'supporting_letter' as DocumentType
            );
          })
        );
      }

      return { requestId, ticketNumber };
    },
    onSuccess: (data) => {
      setResult({
        isSuccess: true,
        requestId: data.requestId,
        ticketNumber: data.ticketNumber,
        isLoading: false,
      });
    },
    onError: (error: any) => {
      setResult({
        isSuccess: false,
        errorMessage: error.message || 'Failed to submit request',
        isLoading: false,
      });
    },
  });

  const submitRequest = (formData: {
    title: string;
    description: string;
    type: string;
    documents: File[];
    isEnquiry?: boolean;
  }) => {
    setResult((prev) => ({ ...prev, isLoading: true }));
    mutate(formData);
  };

  return {
    submitRequest,
    isLoading,
    ...result,
  };
}
