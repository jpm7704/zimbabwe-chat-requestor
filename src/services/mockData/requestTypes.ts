
import { RequestTypeInfo } from "../../types";

// Mock request type information
export const requestTypes: RequestTypeInfo[] = [
  {
    type: "medical_assistance",
    name: "Medical Assistance",
    description: "Apply for support with medical bills, treatments, or medications",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
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
    type: "educational_support",
    name: "Educational Support",
    description: "Apply for educational fees, supplies, or scholarships",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
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
    type: "financial_aid",
    name: "Financial Aid",
    description: "Apply for general financial assistance or loans",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
        required: true
      },
      {
        type: "financial_statements",
        name: "Financial Statements",
        description: "Recent financial statements or records",
        required: true
      },
      {
        type: "bank_statements",
        name: "Bank Statements",
        description: "Bank statements for the past 3 months",
        required: true
      },
      {
        type: "proof_of_income",
        name: "Proof of Income",
        description: "Documents showing your current sources of income (if any)",
        required: false
      }
    ]
  },
  {
    type: "food_assistance",
    name: "Food Assistance",
    description: "Apply for food supplies or nutrition support",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
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
    type: "shelter_assistance",
    name: "Shelter Assistance",
    description: "Apply for housing support or emergency shelter",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
        required: true
      },
      {
        type: "vulnerability_assessment",
        name: "Vulnerability Assessment",
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
    type: "water_sanitation",
    name: "Water & Sanitation",
    description: "Apply for clean water access or sanitation support",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
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
      }
    ]
  },
  {
    type: "psychosocial_support",
    name: "Psychosocial Support",
    description: "Apply for counseling or mental health support services",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
        required: true
      },
      {
        type: "referral_letter",
        name: "Referral Letter",
        description: "Letter from healthcare provider, social worker, or community leader",
        required: false
      },
      {
        type: "medical_records",
        name: "Medical Records",
        description: "Any relevant medical or psychological records (if available)",
        required: false
      }
    ]
  },
  {
    type: "disaster_relief",
    name: "Disaster Relief",
    description: "Apply for emergency assistance after natural disasters",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
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
        description: "A copy of your National ID or passport",
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
