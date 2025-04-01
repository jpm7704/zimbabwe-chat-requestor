
import { RequestType, RequestTypeInfo } from "@/types";

// Helper function to get detailed information about a request type
export const getRequestTypeDetails = async (type: string): Promise<RequestTypeInfo | null> => {
  // This will be replaced by an actual API call in the future
  // For now, return some mock data based on the type
  
  const mockRequestTypeInfo: Record<string, RequestTypeInfo> = {
    medical_assistance: {
      type: "medical_assistance",
      name: "Medical Assistance",
      description: "Support for medical needs including consultations, treatments, and medications",
      requiredDocuments: [
        { 
          type: "id_document", 
          name: "Identification Document", 
          description: "National ID, passport, or birth certificate", 
          required: true 
        },
        { 
          type: "medical_records", 
          name: "Medical Records", 
          description: "Recent medical history or diagnosis", 
          required: true 
        },
        { 
          type: "prescription", 
          name: "Prescription", 
          description: "Doctor's prescription if requesting medication support", 
          required: false 
        }
      ]
    },
    educational_support: {
      type: "educational_support",
      name: "Educational Support",
      description: "Support for educational needs including school fees, books, and uniforms",
      requiredDocuments: [
        { 
          type: "id_document", 
          name: "Identification Document", 
          description: "National ID or birth certificate", 
          required: true 
        },
        { 
          type: "educational_records", 
          name: "Educational Records", 
          description: "Recent school reports or admission letter", 
          required: true 
        },
        { 
          type: "school_fee_structure", 
          name: "School Fee Structure", 
          description: "Official fee structure from the educational institution", 
          required: true 
        }
      ]
    },
    shelter_assistance: {
      type: "shelter_assistance",
      name: "Shelter Assistance",
      description: "Support for shelter needs including temporary accommodation or house repairs",
      requiredDocuments: [
        { 
          type: "id_document", 
          name: "Identification Document", 
          description: "National ID or other proof of identity", 
          required: true 
        },
        { 
          type: "property_documents", 
          name: "Property Documents", 
          description: "Proof of ownership or tenancy", 
          required: false 
        }
      ]
    }
  };

  // Add a delay to simulate an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockRequestTypeInfo[type] || null;
};

// Export a function to get a list of available request types
export const getAvailableRequestTypes = (isEnquiry: boolean = false): { value: string, label: string }[] => {
  if (isEnquiry) {
    return [
      { value: "shelter_assistance", label: "Shelter Assistance" },
      { value: "food_assistance", label: "Food Assistance" },
      { value: "water_sanitation", label: "Water & Sanitation" },
      { value: "community_development", label: "Community Development" },
      { value: "disaster_relief", label: "Emergency Relief" },
      { value: "general_enquiry", label: "General Enquiry" },
    ];
  }
  
  return [
    { value: "medical_assistance", label: "Medical Assistance" },
    { value: "educational_support", label: "Educational Support" },
    { value: "financial_aid", label: "Financial Aid" },
    { value: "food_assistance", label: "Food Assistance" },
  ];
};
