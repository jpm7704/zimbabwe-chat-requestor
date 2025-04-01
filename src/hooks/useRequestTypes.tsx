
import { useState, useEffect } from "react";
import { RequestTypeInfo } from "@/types";
import { getRequestTypeInfo } from "@/services/requestService";

/**
 * Hook for handling request type information
 */
export const useRequestTypes = (requestType: string) => {
  const [requestTypeInfo, setRequestTypeInfo] = useState<RequestTypeInfo | null>(null);
  const [loadingTypeInfo, setLoadingTypeInfo] = useState(false);

  useEffect(() => {
    if (requestType) {
      loadRequestTypeInfo(requestType);
    }
  }, [requestType]);

  /**
   * Load information about a specific request type
   */
  const loadRequestTypeInfo = async (type: string) => {
    try {
      setLoadingTypeInfo(true);
      const info = await getRequestTypeInfo(type);
      if (info) {
        setRequestTypeInfo(info);
      }
    } catch (error) {
      console.error("Error loading request type info:", error);
    } finally {
      setLoadingTypeInfo(false);
    }
  };

  return { requestTypeInfo, loadingTypeInfo, loadRequestTypeInfo };
};
