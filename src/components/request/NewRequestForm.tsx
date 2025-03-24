
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RequestTypeInfo, RequestType } from "@/types";
import { getRequestTypeInfo } from "@/services/requestService";
import DocumentUpload from "./DocumentUpload";

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
}

const NewRequestForm = ({
  requestForm,
  setRequestForm,
  selectedFiles,
  setSelectedFiles,
  submitting,
  setShowNewRequest,
  handleRequestSubmit,
  requestTypeInfo
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

  return (
    <form onSubmit={handleRequestSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label htmlFor="requestType" className="block text-sm font-medium mb-1">
          Request Type <span className="text-destructive">*</span>
        </label>
        <select
          id="requestType"
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={requestForm.type}
          onChange={(e) => {
            setRequestForm(prev => ({ ...prev, type: e.target.value }));
            loadRequestTypeInfo(e.target.value);
          }}
          required
        >
          <option value="">Select Request Type</option>
          <option value="medical_assistance">Medical Assistance</option>
          <option value="educational_support">Educational Support</option>
          <option value="financial_aid">Financial Aid</option>
          <option value="food_assistance">Food Assistance</option>
          <option value="shelter_assistance">Shelter Assistance</option>
          <option value="water_sanitation">Water & Sanitation</option>
          <option value="psychosocial_support">Psychosocial Support</option>
          <option value="disaster_relief">Disaster Relief</option>
          <option value="other_assistance">Other Assistance</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="requestTitle" className="block text-sm font-medium mb-1">
          Request Title <span className="text-destructive">*</span>
        </label>
        <Input
          id="requestTitle"
          placeholder="Enter a title for your request"
          value={requestForm.title}
          onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <label htmlFor="requestDescription" className="block text-sm font-medium mb-1">
          Description <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="requestDescription"
          placeholder="Describe your request in detail"
          rows={4}
          value={requestForm.description}
          onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      
      <DocumentUpload 
        requestTypeInfo={requestTypeInfo}
        selectedFiles={selectedFiles}
        handleFileChange={handleFileChange}
        removeFile={removeFile}
      />
      
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowNewRequest(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
};

export default NewRequestForm;
