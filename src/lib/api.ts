// API functions for the Zimbabwe Chat Requestor
// This provides the core functionality for the request workflow

import { Request, RequestStatus, RequestType } from "@/types";

// Mock data for demonstration purposes
const mockRequests = [];

// Mock users for the system
const mockUsers = [];

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
  return [];
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
  return [];
};

// Helper function to generate realistic mock data based on the Zimbabwe context
export const generateMockRequests = (count: number) => {
  return [];
};

// Helper function to get representative titles for mock data
function getMockTitle(type: RequestType): string {
  return 'Support request';
}

// Helper function to get representative descriptions for mock data
function getMockDescription(type: RequestType): string {
  return 'Request description';
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
