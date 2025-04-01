
// Define the request type interface
export interface RequestType {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredDocuments?: string[];
  fields?: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
  }>;
}

// Get all available request types
export const getRequestTypes = async (): Promise<RequestType[]> => {
  // This will be replaced with actual API call in the future
  return [];
};

// Get detailed info about a specific request type
export const getRequestTypeInfo = async (typeId: string): Promise<RequestType | null> => {
  // This will be replaced with actual API call in the future
  return null;
};
