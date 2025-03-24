
/**
 * Base API utilities for service calls
 */

// API simulation with a delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// UUID validation
export const isValidUUID = (uuid: string): boolean => {
  return !!uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
};
