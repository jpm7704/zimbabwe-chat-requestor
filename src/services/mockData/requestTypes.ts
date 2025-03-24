
import { RequestTypeInfo } from "../../types";

// Mock request type information aligned with BGF Zimbabwe's focus areas
export const requestTypes: RequestTypeInfo[] = [
  {
    type: "educational_support",
    name: "Educational Support",
    description: "Apply for school fees, learning materials, or educational programs",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or birth certificate",
        required: true
      },
      {
        type: "educational_records",
        name: "Educational Records",
        description: "Recent academic records or school reports",
        required: true
      },
      {
        type: "school_fee_structure",
        name: "School Fee Structure",
        description: "Official document showing required school fees",
        required: true
      },
      {
        type: "admission_letter",
        name: "Admission Letter",
        description: "Admission or acceptance letter from the educational institution",
        required: false
      }
    ]
  },
  {
    type: "medical_assistance",
    name: "Healthcare Assistance",
    description: "Apply for medical treatments, medications, or health services",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or birth certificate",
        required: true
      },
      {
        type: "medical_records",
        name: "Medical Records",
        description: "Recent medical reports or diagnoses from a healthcare provider",
        required: true
      },
      {
        type: "prescription",
        name: "Prescription",
        description: "Current medical prescriptions (if applicable)",
        required: true
      },
      {
        type: "medical_referral",
        name: "Medical Referral",
        description: "Referral letter from a healthcare provider",
        required: false
      }
    ]
  },
  {
    type: "livelihood_development",
    name: "Livelihood Development",
    description: "Apply for skills training, income generation initiatives, or financial literacy programs",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or birth certificate",
        required: true
      },
      {
        type: "proof_of_residence",
        name: "Proof of Residence",
        description: "Document confirming your current residence",
        required: true
      },
      {
        type: "financial_statements",
        name: "Financial Information",
        description: "Any information about your current financial situation (if available)",
        required: false
      },
      {
        type: "project_proposal",
        name: "Project Proposal",
        description: "A brief outline of your business or skills development idea (if applicable)",
        required: false
      }
    ]
  },
  {
    type: "food_assistance",
    name: "Food Assistance",
    description: "Apply for emergency food supplies or nutrition support",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or birth certificate",
        required: true
      },
      {
        type: "vulnerability_assessment",
        name: "Vulnerability Assessment",
        description: "Assessment of household food security situation",
        required: true
      },
      {
        type: "proof_of_residence",
        name: "Proof of Residence",
        description: "Document confirming your current residence",
        required: true
      }
    ]
  },
  {
    type: "water_sanitation",
    name: "Water & Sanitation",
    description: "Apply for clean water access, sanitation facilities, or hygiene education",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or birth certificate",
        required: true
      },
      {
        type: "vulnerability_assessment",
        name: "Situation Assessment",
        description: "Assessment of current water and sanitation conditions",
        required: true
      },
      {
        type: "proof_of_residence",
        name: "Proof of Residence",
        description: "Document confirming your current residence",
        required: true
      },
      {
        type: "community_letter",
        name: "Community Support Letter",
        description: "Letter from community leaders (for community-wide projects)",
        required: false
      }
    ]
  },
  {
    type: "shelter_assistance",
    name: "Shelter Assistance",
    description: "Apply for housing support, home repairs, or emergency shelter",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or birth certificate",
        required: true
      },
      {
        type: "vulnerability_assessment",
        name: "Housing Assessment",
        description: "Assessment of housing condition or need",
        required: true
      },
      {
        type: "property_documents",
        name: "Property Documents",
        description: "Any available documents related to property or housing situation",
        required: false
      }
    ]
  },
  {
    type: "community_development",
    name: "Community Development",
    description: "Apply for support with community infrastructure or development initiatives",
    requiredDocuments: [
      {
        type: "id_document",
        name: "Project Lead ID",
        description: "National ID of the community project representative",
        required: true
      },
      {
        type: "community_letter",
        name: "Community Support Letter",
        description: "Letter from community leaders supporting the initiative",
        required: true
      },
      {
        type: "project_proposal",
        name: "Project Proposal",
        description: "Detailed plan of the community development initiative",
        required: true
      },
      {
        type: "community_assessment",
        name: "Community Assessment",
        description: "Assessment of community needs related to the project",
        required: true
      }
    ]
  },
  {
    type: "disaster_relief",
    name: "Emergency Relief",
    description: "Apply for assistance after natural disasters or other emergencies",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or birth certificate",
        required: true
      },
      {
        type: "disaster_assessment",
        name: "Disaster Assessment",
        description: "Assessment of damage or impact from the disaster",
        required: true
      },
      {
        type: "proof_of_residence",
        name: "Proof of Residence",
        description: "Document confirming your residence in affected area",
        required: true
      }
    ]
  },
  {
    type: "other_assistance",
    name: "Other Assistance",
    description: "Request other forms of assistance not listed above",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or birth certificate",
        required: true
      },
      {
        type: "supporting_letter",
        name: "Supporting Letter",
        description: "Letter explaining the nature of assistance needed",
        required: true
      },
      {
        type: "other",
        name: "Other Documents",
        description: "Any relevant supporting documents for your request",
        required: false
      }
    ]
  }
];
