
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { RequestType, ChatMessage } from "@/types";
import { useRequestTypes } from "@/hooks/useRequestTypes";
import { useRequestSubmission } from "@/hooks/useRequestSubmission";

export const useRequestForm = (setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
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
  
  // Use the extracted hooks
  const { requestTypeInfo } = useRequestTypes(requestForm.type);
  const { submitting, handleRequestSubmit, handleRequestTypeSelect } = useRequestSubmission({
    requestForm, 
    selectedFiles, 
    requestTypeInfo, 
    setShowNewRequest, 
    setRequestForm,
    setMessages,
    setSelectedFiles,
    isEnquiry
  });

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

  // Update request form when isEnquiry changes
  useEffect(() => {
    setRequestForm(prev => ({
      ...prev,
      isEnquiry
    }));
  }, [isEnquiry]);

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
