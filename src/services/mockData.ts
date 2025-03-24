import { Request, RequestTypeInfo, Document, Note, TimelineEvent, ChatMessage } from "../types";

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

// Generate mock request
const generateMockDocument = (requestId: string, type: string): Document => {
  const id = Math.random().toString(36).substring(2, 10);
  return {
    id,
    requestId,
    name: `${type.replace('_', ' ')}.pdf`,
    type: type as any,
    url: `https://example.com/documents/${id}`,
    uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString()
  };
};

const generateMockNote = (requestId: string): Note => {
  const id = Math.random().toString(36).substring(2, 10);
  const authorRoles = ["user", "field_officer", "programme_manager", "management"];
  const authorRole = authorRoles[Math.floor(Math.random() * authorRoles.length)];
  
  return {
    id,
    requestId,
    authorId: Math.random().toString(36).substring(2, 10),
    authorName: `${authorRole === 'user' ? 'John Doe' : authorRole.replace('_', ' ')}`,
    authorRole,
    content: "Additional information provided for this request. Please review and provide feedback.",
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString(),
    isInternal: authorRole !== "user"
  };
};

const generateTimelineEvent = (requestId: string, type: string, createdAt: string): TimelineEvent => {
  return {
    id: Math.random().toString(36).substring(2, 10),
    requestId,
    type: type as any,
    description: type === "status_change" 
      ? "Request status updated to Under Review" 
      : type === "note_added" 
        ? "New note added to the request" 
        : type === "document_added" 
          ? "New document uploaded" 
          : "Request assigned to field officer",
    createdAt,
    createdBy: {
      id: Math.random().toString(36).substring(2, 10),
      name: "System",
      role: "system"
    }
  };
};

export const generateMockRequests = (count: number = 5): Request[] => {
  const statuses: Array<any> = ["submitted", "assigned", "under_review", "manager_review", "forwarded", "completed", "rejected"];
  const types: Array<any> = ["medical_assistance", "educational_support", "financial_aid", "food_assistance", "shelter_assistance", "water_sanitation", "psychosocial_support", "disaster_relief", "other_assistance"];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = Math.random().toString(36).substring(2, 10);
    const ticketNumber = `BGF-${Math.floor(100000 + Math.random() * 900000)}`;
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString();
    const updatedAt = new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString();

    const documents = Array.from({ length: 2 + Math.floor(Math.random() * 3) }).map(() => {
      const docTypes = ["id_document", "medical_records", "prescription", "medical_referral", "educational_records", "school_fee_structure", "admission_letter", "financial_statements", "bank_statements", "proof_of_income", "vulnerability_assessment", "proof_of_residence", "property_documents", "disaster_assessment", "referral_letter", "medical_records", "supporting_letter", "other"];
      return generateMockDocument(id, docTypes[Math.floor(Math.random() * docTypes.length)]);
    });

    const notes = Array.from({ length: Math.floor(Math.random() * 3) }).map(() => generateMockNote(id));

    const timelineEvents = [
      generateTimelineEvent(id, "status_change", createdAt),
      ...Array.from({ length: Math.floor(Math.random() * 3) }).map(() => 
        generateTimelineEvent(
          id, 
          ["status_change", "note_added", "document_added", "assigned"][Math.floor(Math.random() * 4)],
          new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString()
        )
      )
    ];

    return {
      id,
      ticketNumber,
      userId: Math.random().toString(36).substring(2, 10),
      type,
      title: `${type.replace('_', ' ')} request for ${['Small Business', 'Startup', 'Expanding Business', 'Tech Company'][Math.floor(Math.random() * 4)]}`,
      description: `This is a request for ${type.replace('_', ' ')} for a business based in ${['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo'][Math.floor(Math.random() * 5)]}, Zimbabwe.`,
      status,
      createdAt,
      updatedAt,
      assignedTo: status !== "submitted" ? Math.random().toString(36).substring(2, 10) : undefined,
      documents,
      notes,
      timeline: timelineEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    };
  });
};

export const getMockRequest = (requestId: string): Request | undefined => {
  const requests = generateMockRequests(10);
  return requests.find(r => r.id === requestId) || requests[0];
};

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

