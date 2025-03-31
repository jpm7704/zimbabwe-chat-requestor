
// API functions for the Zimbabwe Chat Requestor
// This provides the core functionality for the request workflow

import { Request, RequestStatus, RequestType } from "@/types";

// Mock data for demonstration purposes
const mockRequests = [
  {
    id: 'mock-request-1',
    ticketNumber: 'BGF-2301-0001',
    userId: 'user-1',
    type: 'medical_assistance' as RequestType,
    title: 'Medical support for child',
    description: 'Need assistance with medical bills for my 10-year-old child who has malaria.',
    status: 'submitted' as RequestStatus,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    notes: [],
    timeline: []
  },
  {
    id: 'mock-request-2',
    ticketNumber: 'BGF-2301-0002',
    userId: 'user-1',
    type: 'educational_support' as RequestType,
    title: 'School fees for secondary education',
    description: 'Requesting help with secondary school fees for the upcoming term.',
    status: 'under_review' as RequestStatus,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    notes: [],
    timeline: []
  },
  {
    id: 'mock-request-3',
    ticketNumber: 'BGF-2301-0003',
    userId: 'user-2',
    type: 'shelter_assistance' as RequestType,
    title: 'Roof repair after storm damage',
    description: 'Our home was damaged during recent storms and we need help with repairs.',
    status: 'manager_review' as RequestStatus,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    notes: [],
    timeline: []
  },
  {
    id: 'mock-request-4',
    ticketNumber: 'BGF-2301-0004',
    userId: 'user-3',
    type: 'food_assistance' as RequestType,
    title: 'Emergency food supplies',
    description: 'Request for emergency food assistance for family of 5 after crop failure.',
    status: 'completed' as RequestStatus,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    notes: [],
    timeline: []
  },
  {
    id: 'mock-request-5',
    ticketNumber: 'BGF-2301-0005',
    userId: 'user-1',
    type: 'water_sanitation' as RequestType,
    title: 'Community borehole repair',
    description: 'Our village borehole is broken and we need assistance with repairs for clean water access.',
    status: 'rejected' as RequestStatus,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    notes: [],
    timeline: []
  }
];

// Mock users for the system
const mockUsers = [
  { 
    id: 'user-1', 
    name: 'Alice Moyo', 
    email: 'alice@example.com', 
    role: 'user',
    first_name: 'Alice',
    last_name: 'Moyo'
  },
  { 
    id: 'field-officer-1', 
    name: 'Bob Mutasa', 
    email: 'bob@example.com', 
    role: 'field_officer',
    first_name: 'Bob',
    last_name: 'Mutasa'
  },
  { 
    id: 'program-manager-1', 
    name: 'Carol Ndlovu', 
    email: 'carol@example.com', 
    role: 'programme_manager',
    first_name: 'Carol',
    last_name: 'Ndlovu'
  },
  { 
    id: 'director-1', 
    name: 'David Nyoni', 
    email: 'david@example.com', 
    role: 'director',
    first_name: 'David',
    last_name: 'Nyoni'
  }
];

// Simulated delay to mimic API calls
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const createRequest = async (data: any) => {
  console.log('Creating request:', data);
  await simulateApiDelay();
  
  // Generate a mock ID and ticket number
  const newId = `mock-request-${Date.now()}`;
  const ticketNumber = `BGF-${new Date().getFullYear().toString().substr(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const newRequest = {
    id: newId,
    ticketNumber,
    userId: 'user-1', // Default to first user
    type: data.type,
    title: data.title,
    description: data.description,
    status: 'submitted' as RequestStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    documents: [],
    notes: [],
    timeline: []
  };
  
  // Add to our mock data
  mockRequests.push(newRequest);
  
  return { 
    id: newId, 
    ticketNumber, 
    ...data, 
    requestId: newId // Include both id and requestId for flexibility
  };
};

export const getRequests = async () => {
  console.log('Fetching all requests');
  await simulateApiDelay();
  return mockRequests;
};

export const getRequestById = async (id: string) => {
  console.log('Fetching request by ID:', id);
  await simulateApiDelay();
  
  const request = mockRequests.find(req => req.id === id);
  if (!request) {
    throw new Error(`Request with ID ${id} not found`);
  }
  
  return request;
};

export const updateRequest = async (id: string, data: any) => {
  console.log('Updating request:', id, data);
  await simulateApiDelay();
  
  const requestIndex = mockRequests.findIndex(req => req.id === id);
  if (requestIndex === -1) {
    throw new Error(`Request with ID ${id} not found`);
  }
  
  // Merge the updates with existing request
  const updatedRequest = {
    ...mockRequests[requestIndex],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  // Update the request in our mock data
  mockRequests[requestIndex] = updatedRequest;
  
  return updatedRequest;
};

export const updateRequestStatus = async (id: string, status: RequestStatus, notes?: string) => {
  console.log('Updating request status:', id, status, notes);
  return updateRequest(id, { status, notes });
};

export const assignRequest = async (requestId: string, assigneeId: string, assigneeRole: string) => {
  console.log('Assigning request:', requestId, 'to', assigneeId, '(', assigneeRole, ')');
  await simulateApiDelay();
  
  const data: any = { status: 'assigned' };
  
  // Set the appropriate field based on role
  if (assigneeRole === 'field_officer') {
    data.field_officer_id = assigneeId;
  } else if (assigneeRole === 'programme_manager') {
    data.program_manager_id = assigneeId;
  }
  
  return updateRequest(requestId, data);
};

export const deleteRequest = async (id: string) => {
  console.log('Deleting request:', id);
  await simulateApiDelay();
  
  const requestIndex = mockRequests.findIndex(req => req.id === id);
  if (requestIndex === -1) {
    throw new Error(`Request with ID ${id} not found`);
  }
  
  // Remove the request from our mock data
  mockRequests.splice(requestIndex, 1);
  
  return { success: true, id };
};

export const getEnquiries = async () => {
  console.log('Fetching enquiries');
  await simulateApiDelay();
  
  // Filter requests that are marked as enquiries (in a real system)
  // Here we'll just return a subset of mock data
  return mockRequests.filter((_, index) => index % 3 === 0);
};

export const getUsers = async () => {
  console.log('Fetching users');
  await simulateApiDelay();
  return mockUsers;
};

export const getUserById = async (id: string) => {
  console.log('Fetching user by ID:', id);
  await simulateApiDelay();
  
  const user = mockUsers.find(user => user.id === id);
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }
  
  return user;
};

export const getRoles = async () => {
  console.log('Fetching roles');
  await simulateApiDelay();
  
  return [
    { id: 'role-1', key: 'user', name: 'Regular User', description: 'Standard beneficiary account', level: 0 },
    { id: 'role-2', key: 'field_officer', name: 'Field Officer', description: 'Conducts field verification', level: 10 },
    { id: 'role-3', key: 'programme_manager', name: 'Programme Manager', description: 'Oversees program implementation', level: 20 },
    { id: 'role-4', key: 'director', name: 'Director', description: 'Makes final approval decisions', level: 30 },
    { id: 'role-5', key: 'ceo', name: 'CEO', description: 'Organization chief executive', level: 40 },
    { id: 'role-6', key: 'patron', name: 'Patron', description: 'Highest level of endorsement', level: 50 }
  ];
};

export const getSystemSettings = async () => {
  console.log('Fetching system settings');
  await simulateApiDelay();
  
  return {
    organizationName: 'Zimbabwe Charitable Foundation',
    systemVersion: '1.0.0',
    requestTypes: [
      'medical_assistance',
      'educational_support',
      'financial_aid',
      'food_assistance',
      'shelter_assistance',
      'water_sanitation',
      'psychosocial_support',
      'disaster_relief',
      'livelihood_development',
      'community_development'
    ],
    allowUserRegistration: true,
    requireDocumentVerification: true,
    maxRequestsPerUser: 5,
    approvalWorkflow: [
      'submitted',
      'assigned',
      'under_review',
      'manager_review',
      'forwarded',
      'completed'
    ]
  };
};

export const updateSystemSettings = async (data: any) => {
  console.log('Updating system settings:', data);
  await simulateApiDelay();
  return data;
};

export const getLogs = async () => {
  console.log('Fetching system logs');
  await simulateApiDelay();
  
  return [
    { id: 'log-1', action: 'REQUEST_CREATED', userId: 'user-1', timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), details: 'Created request BGF-2301-0001' },
    { id: 'log-2', action: 'STATUS_CHANGED', userId: 'field-officer-1', timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), details: 'Changed status of BGF-2301-0001 from submitted to assigned' },
    { id: 'log-3', action: 'REQUEST_CREATED', userId: 'user-1', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), details: 'Created request BGF-2301-0002' },
    { id: 'log-4', action: 'USER_LOGIN', userId: 'program-manager-1', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), details: 'User carol@example.com logged in' },
    { id: 'log-5', action: 'DOCUMENT_UPLOADED', userId: 'user-1', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), details: 'Uploaded document to request BGF-2301-0002' }
  ];
};

// Helper function to generate realistic mock data based on the Zimbabwe context
export const generateMockRequests = (count: number) => {
  const requestTypes: RequestType[] = [
    'medical_assistance',
    'educational_support',
    'financial_aid',
    'food_assistance',
    'shelter_assistance'
  ];
  
  const statuses: RequestStatus[] = [
    'submitted',
    'assigned',
    'under_review',
    'manager_review',
    'forwarded',
    'completed',
    'rejected'
  ];
  
  const mockData = [];
  
  for (let i = 0; i < count; i++) {
    const type = requestTypes[Math.floor(Math.random() * requestTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const updatedDate = new Date(createdDate.getTime() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000);
    
    mockData.push({
      id: `mock-${i + 10}`,
      ticketNumber: `BGF-${new Date().getFullYear().toString().substr(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(i + 1000).toString().padStart(4, '0')}`,
      userId: `user-${Math.floor(Math.random() * 3) + 1}`,
      type,
      title: getMockTitle(type),
      description: getMockDescription(type),
      status,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      documents: [],
      notes: [],
      timeline: []
    });
  }
  
  return mockData;
};

// Helper function to get representative titles for mock data
function getMockTitle(type: RequestType): string {
  switch (type) {
    case 'medical_assistance':
      return 'Medical support needed for chronic condition';
    case 'educational_support':
      return 'School fees assistance for secondary school';
    case 'financial_aid':
      return 'Emergency financial support for family';
    case 'food_assistance':
      return 'Food support needed for household of 6';
    case 'shelter_assistance':
      return 'Help with roof repair after storm damage';
    default:
      return 'Support request';
  }
}

// Helper function to get representative descriptions for mock data
function getMockDescription(type: RequestType): string {
  switch (type) {
    case 'medical_assistance':
      return 'I am suffering from high blood pressure and diabetes and need assistance with medication costs. The local clinic has referred me to a specialist but I cannot afford the treatment.';
    case 'educational_support':
      return 'My child has been accepted to secondary school but we cannot afford the school fees, uniform and books required. We are requesting support for one academic year.';
    case 'financial_aid':
      return 'Our family is facing financial hardship after the loss of employment. We need temporary assistance to cover basic needs while seeking new work opportunities.';
    case 'food_assistance':
      return 'Due to drought conditions, our crops have failed this season. We are a household of 6 including 4 children and are in need of food assistance until the next harvest.';
    case 'shelter_assistance':
      return 'The recent storms damaged our roof and we have water leaking into our home. We need assistance with materials to repair the roof before the rainy season intensifies.';
    default:
      return 'I am requesting support from the foundation due to challenging circumstances. Please consider my application for assistance.';
  }
}

// Mock data for backward compatibility
export const getMockRequest = getRequestById;
export const requestTypes = [
  { value: 'medical_assistance', label: 'Medical Assistance' },
  { value: 'educational_support', label: 'Educational Support' },
  { value: 'financial_aid', label: 'Financial Aid' },
  { value: 'food_assistance', label: 'Food Assistance' },
  { value: 'shelter_assistance', label: 'Shelter Assistance' },
  { value: 'water_sanitation', label: 'Water & Sanitation' },
  { value: 'psychosocial_support', label: 'Psychosocial Support' },
  { value: 'disaster_relief', label: 'Disaster Relief' },
  { value: 'livelihood_development', label: 'Livelihood Development' },
  { value: 'community_development', label: 'Community Development' }
];
