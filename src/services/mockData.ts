
import { Request, RequestTypeInfo, Document, Note, TimelineEvent, ChatMessage } from "../types";

// Mock request type information
export const requestTypes: RequestTypeInfo[] = [
  {
    type: "business_funding",
    name: "Business Funding",
    description: "Apply for funding to start or grow your business in Zimbabwe",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
        required: true
      },
      {
        type: "business_plan",
        name: "Business Plan",
        description: "A comprehensive business plan including market analysis and financial projections",
        required: true
      },
      {
        type: "financial_statement",
        name: "Financial Statements",
        description: "Financial statements for the past 2 years (if applicable)",
        required: true
      },
      {
        type: "tax_clearance",
        name: "Tax Clearance",
        description: "Valid tax clearance certificate from ZIMRA",
        required: true
      },
      {
        type: "company_registration",
        name: "Company Registration",
        description: "Certificate of incorporation or business registration",
        required: true
      },
      {
        type: "bank_statement",
        name: "Bank Statements",
        description: "Bank statements for the past 6 months",
        required: true
      }
    ]
  },
  {
    type: "training_support",
    name: "Training Support",
    description: "Apply for business training and capacity building programs",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
        required: true
      },
      {
        type: "company_registration",
        name: "Company Registration",
        description: "Certificate of incorporation or business registration (if applicable)",
        required: false
      }
    ]
  },
  {
    type: "mentorship",
    name: "Mentorship Program",
    description: "Apply for mentorship from experienced business leaders",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
        required: true
      },
      {
        type: "business_plan",
        name: "Business Summary",
        description: "A brief summary of your business or business idea",
        required: true
      }
    ]
  },
  {
    type: "market_access",
    name: "Market Access",
    description: "Get support to access local and international markets",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
        required: true
      },
      {
        type: "company_registration",
        name: "Company Registration",
        description: "Certificate of incorporation or business registration",
        required: true
      },
      {
        type: "financial_statement",
        name: "Product Information",
        description: "Detailed information about your products or services",
        required: true
      }
    ]
  },
  {
    type: "other",
    name: "Other Support",
    description: "Other business support services",
    requiredDocuments: [
      {
        type: "id_document",
        name: "National ID",
        description: "A copy of your National ID or passport",
        required: true
      },
      {
        type: "other",
        name: "Supporting Documents",
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
  const types: Array<any> = ["business_funding", "training_support", "mentorship", "market_access", "other"];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = Math.random().toString(36).substring(2, 10);
    const ticketNumber = `BGF-${Math.floor(100000 + Math.random() * 900000)}`;
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString();
    const updatedAt = new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString();

    const documents = Array.from({ length: 2 + Math.floor(Math.random() * 3) }).map(() => {
      const docTypes = ["id_document", "business_plan", "financial_statement", "tax_clearance", "company_registration", "bank_statement", "other"];
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
      content: "Welcome to the BGF Zimbabwe support chat. How can I assist you today?",
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "2",
      senderId: "user",
      senderType: "user",
      content: "I'm interested in applying for business funding. What documents do I need?",
      timestamp: new Date(Date.now() - 86300000).toISOString()
    },
    {
      id: "3",
      senderId: "system",
      senderType: "system",
      content: "For business funding applications, you'll need to provide the following documents:\n\n1. National ID or passport\n2. Business Plan\n3. Financial Statements (if applicable)\n4. Tax Clearance Certificate\n5. Company Registration\n6. Bank Statements\n\nWould you like to start a new application now?",
      timestamp: new Date(Date.now() - 86200000).toISOString()
    },
    {
      id: "4",
      senderId: "user",
      senderType: "user",
      content: "Yes, I'd like to start a new application.",
      timestamp: new Date(Date.now() - 86100000).toISOString()
    },
    {
      id: "5",
      senderId: "system",
      senderType: "system",
      content: "Great! I'll guide you through the application process. First, could you tell me what type of business you have and what you're looking for funding for?",
      timestamp: new Date(Date.now() - 86000000).toISOString()
    },
    {
      id: "6",
      senderId: "user",
      senderType: "user",
      content: "I run a small agricultural business in Harare. We're looking for funding to expand our operations and purchase new equipment.",
      timestamp: new Date(Date.now() - 85900000).toISOString()
    }
  ];
};
