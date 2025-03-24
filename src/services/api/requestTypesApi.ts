
import { RequestType, RequestTypeInfo } from "@/types";
import { requestTypes } from "../mockData";
import { delay } from "./baseApi";

/**
 * Get all request types and their requirements
 */
export const getRequestTypes = async (): Promise<RequestTypeInfo[]> => {
  await delay(500);
  return requestTypes;
};

/**
 * Get a specific request type and its requirements
 */
export const getRequestTypeInfo = async (type: RequestType): Promise<RequestTypeInfo | undefined> => {
  await delay(300);
  return requestTypes.find(t => t.type === type);
};
