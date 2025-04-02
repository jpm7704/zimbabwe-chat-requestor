
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
    // Use any type to bypass TypeScript errors until Supabase types are updated
    let query = (supabase as any)
      .from('reports')
      .select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        query = query.or(`title.ilike.%${term}%,content.ilike.%${term}%`);
      }
    }
    
    // Sort by creation date, newest first
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data.map(report => ({
      id: report.id,
      title: report.title,
      date: report.created_at,
      author: report.author_name || 'Unknown',
      category: report.category,
      status: report.status,
      content: report.content
    })) || [];
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw new Error("Failed to fetch reports. Please try again later.");
  }
};

// Fetch a single report by ID
export const fetchReportById = async (reportId: string): Promise<Report | null> => {
  try {
    // Use any type to bypass TypeScript errors until Supabase types are updated
    const { data, error } = await (supabase as any)
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      title: data.title,
      date: data.created_at,
      author: data.author_name || 'Unknown',
      category: data.category,
      status: data.status,
      content: data.content
    };
  } catch (error) {
    console.error(`Error fetching report ${reportId}:`, error);
    throw new Error("Failed to fetch report details. Please try again later.");
  }
};

// Create a new report
export const createReport = async (reportData: Omit<Report, 'id' | 'date'>): Promise<Report> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error("You must be logged in to create reports");
    }
    
    // Get user profile to add author name
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.session.user.id)
      .single();
    
    const authorName = profile ? profile.name || 'Anonymous' : 'Anonymous';
    
    // Use any type to bypass TypeScript errors until Supabase types are updated
    const { data, error } = await (supabase as any)
      .from('reports')
      .insert({
        title: reportData.title,
        content: reportData.content,
        category: reportData.category,
        status: reportData.status,
        author_id: session.session.user.id,
        author_name: authorName,
        region: profile?.region
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      date: data.created_at,
      author: data.author_name,
      category: data.category,
      status: data.status,
      content: data.content
    };
  } catch (error) {
    console.error("Error creating report:", error);
    throw new Error("Failed to create report. Please try again later.");
  }
};
