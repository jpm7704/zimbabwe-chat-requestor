
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RequestTypeInfo, RequestType } from "@/types";
import { getRequestTypeInfo } from "@/services/requestService";
import DocumentUpload from "./DocumentUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stethoscope, GraduationCap, HelpCircle, Home as HomeIcon, Utensils as UtensilsIcon, Droplet as DropletIcon, Users as UsersIcon, AlertTriangle } from "lucide-react";

interface NewRequestFormProps {
  requestForm: {
    type: string;
    title: string;
    description: string;
  };
  setRequestForm: React.Dispatch<React.SetStateAction<{
    type: string;
    title: string;
    description: string;
  }>>;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  submitting: boolean;
  setShowNewRequest: (show: boolean) => void;
  handleRequestSubmit: (e: React.FormEvent) => void;
  requestTypeInfo: RequestTypeInfo | null;
  restrictedTypes?: RequestType[];
  isEnquiry?: boolean;
}

const NewRequestForm = ({
  requestForm,
  setRequestForm,
  selectedFiles,
  setSelectedFiles,
  submitting,
  setShowNewRequest,
  handleRequestSubmit,
  requestTypeInfo,
  restrictedTypes,
  isEnquiry = false
}: NewRequestFormProps) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const loadRequestTypeInfo = async (type: string) => {
    try {
      const info = await getRequestTypeInfo(type as any);
      if (info) {
        // Use the response, but don't store it here
        // This is handled by the parent component
      }
    } catch (error) {
      console.error("Error loading request type info:", error);
    }
  };

  // Filter request types based on restrictedTypes prop if provided
  const getRequestTypeOptions = () => {
    if (restrictedTypes?.length) {
      const options = [
        { value: "medical_assistance", label: "Medical Assistance", icon: <Stethoscope className="h-4 w-4 mr-2" /> },
        { value: "educational_support", label: "Educational Support", icon: <GraduationCap className="h-4 w-4 mr-2" /> },
      ];
      return options.filter(option => 
        restrictedTypes.includes(option.value as RequestType)
      );
    }
    
    if (isEnquiry) {
      return [
        { value: "shelter_assistance", label: "Shelter Assistance", icon: <HomeIcon className="h-4 w-4 mr-2" /> },
        { value: "food_assistance", label: "Food Assistance", icon: <UtensilsIcon className="h-4 w-4 mr-2" /> },
        { value: "water_sanitation", label: "Water & Sanitation", icon: <DropletIcon className="h-4 w-4 mr-2" /> },
        { value: "community_development", label: "Community Development", icon: <UsersIcon className="h-4 w-4 mr-2" /> },
        { value: "disaster_relief", label: "Emergency Relief", icon: <AlertTriangle className="h-4 w-4 mr-2" /> },
        { value: "general_enquiry", label: "General Enquiry", icon: <HelpCircle className="h-4 w-4 mr-2" /> },
      ];
    }
    
    return [];
  };

  const typeOptions = getRequestTypeOptions();

  return (
    <form onSubmit={handleRequestSubmit} className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-serif font-semibold mb-6 text-elegant">
        {isEnquiry ? "Enquiry Details" : "Application Details"}
      </h2>
      
      <div>
        <label htmlFor="requestType" className="block text-sm font-medium font-serif mb-2">
          {isEnquiry ? "Enquiry Type" : "Request Type"} <span className="text-destructive">*</span>
        </label>
        <Select
          value={requestForm.type}
          onValueChange={(value) => {
            setRequestForm(prev => ({ ...prev, type: value }));
            loadRequestTypeInfo(value);
          }}
        >
          <SelectTrigger className="w-full font-serif">
            <SelectValue placeholder={isEnquiry ? "Select Enquiry Type" : "Select Request Type"} />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="font-serif flex items-center"
              >
                <div className="flex items-center">
                  {option.icon}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="requestTitle" className="block text-sm font-medium font-serif mb-2">
          {isEnquiry ? "Enquiry Title" : "Request Title"} <span className="text-destructive">*</span>
        </label>
        <Input
          id="requestTitle"
          placeholder={isEnquiry ? "Enter a title for your enquiry" : "Enter a title for your request"}
          value={requestForm.title}
          onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
          required
          className="font-serif"
        />
      </div>
      
      <div>
        <label htmlFor="requestDescription" className="block text-sm font-medium font-serif mb-2">
          Description <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="requestDescription"
          placeholder={isEnquiry ? "Describe your enquiry in detail" : "Describe your request in detail"}
          rows={6}
          value={requestForm.description}
          onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
          required
          className="font-serif"
        />
      </div>
      
      {!isEnquiry && (
        <DocumentUpload 
          requestTypeInfo={requestTypeInfo}
          selectedFiles={selectedFiles}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
        />
      )}
      
      <div className="flex justify-end gap-4 pt-4 border-t border-primary/10">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowNewRequest(false)}
          disabled={submitting}
          className="font-serif"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="font-serif px-6"
        >
          {submitting ? 'Submitting...' : isEnquiry ? 'Submit Enquiry' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
};

export default NewRequestForm;
