
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Report {
  id: string;
  title: string;
  date: string;
  author: string;
  category?: string;
  status: 'Published' | 'Draft' | 'Under Review';
  content?: string;
}

export interface ReportFilters {
  status?: string;
  category?: string;
  searchTerm?: string;
}

// Fetch reports from the API
export const fetchReports = async (filters?: ReportFilters): Promise<Report[]> => {
  try {
    // In the future, this will connect to Supabase
    // For now, return mock data
    const mockReports: Report[] = [];
    
    // Filter the reports based on the filters
    let filteredReports = [...mockReports];
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        filteredReports = filteredReports.filter(report => 
          report.status.toLowerCase() === filters.status?.toLowerCase()
        );
      }
      
      if (filters.category && filters.category !== 'all') {
        filteredReports = filteredReports.filter(report => 
          report.category?.toLowerCase() === filters.category?.toLowerCase()
        );
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredReports = filteredReports.filter(report => 
          report.title.toLowerCase().includes(searchLower) || 
          report.author.toLowerCase().includes(searchLower) ||
          (report.content && report.content.toLowerCase().includes(searchLower))
        );
      }
    }
    
    return filteredReports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw new Error("Failed to fetch reports. Please try again later.");
  }
};

// Fetch a single report by ID
export const fetchReportById = async (reportId: string): Promise<Report | null> => {
  try {
    // This function will connect to a real API in the future
    // For now, return null
    return null;
  } catch (error) {
    console.error(`Error fetching report ${reportId}:`, error);
    throw new Error("Failed to fetch report details. Please try again later.");
  }
};

// Create a new report
export const createReport = async (reportData: Omit<Report, 'id' | 'date'>): Promise<Report> => {
  try {
    // This function will connect to a real API in the future
    // For now, return a mock response
    const newReport = {
      id: 'temp-' + Date.now(),
      date: new Date().toISOString(),
      ...reportData
    };

    console.log('Created new report:', newReport);
    return newReport;
  } catch (error) {
    console.error("Error creating report:", error);
    throw new Error("Failed to create report. Please try again later.");
  }
};
