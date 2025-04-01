
// API functions for the Zimbabwe Chat Requestor
// Core functionality for the request workflow

import { RequestStatus } from "@/types";

// Simulated delay to mimic API calls
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const createRequest = async (data: any) => {
  console.log('Creating request:', data);
  await simulateApiDelay();
  
  // Generate a ticket number
  const ticketNumber = `BGF-${new Date().getFullYear().toString().substr(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  return { 
    id: `request-${Date.now()}`,
    ticketNumber,
    ...data
  };
};

export const getRequests = async () => {
  console.log('Fetching all requests');
  await simulateApiDelay();
  return [];
};

export const getRequestById = async (id: string) => {
  console.log('Fetching request by ID:', id);
  await simulateApiDelay();
  throw new Error(`Request with ID ${id} not found`);
};

export const updateRequest = async (id: string, data: any) => {
  console.log('Updating request:', id, data);
  await simulateApiDelay();
  return { id, ...data };
};

export const updateRequestStatus = async (id: string, status: RequestStatus, notes?: string) => {
  console.log('Updating request status:', id, status, notes);
  return { id, status, notes };
};

export const assignRequest = async (requestId: string, assigneeId: string, assigneeRole: string) => {
  console.log('Assigning request:', requestId, 'to', assigneeId, '(', assigneeRole, ')');
  await simulateApiDelay();
  return { id: requestId, status: 'assigned' };
};

export const deleteRequest = async (id: string) => {
  console.log('Deleting request:', id);
  await simulateApiDelay();
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
  return [];
};

export const getUserById = async (id: string) => {
  console.log('Fetching user by ID:', id);
  await simulateApiDelay();
  throw new Error(`User with ID ${id} not found`);
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

// Clean API without mock data generation
export const getMockRequest = getRequestById;
