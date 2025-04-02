
import { useState, useEffect } from 'react';
import { Report, ReportFilters } from '@/services/reportService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useReports(filters?: ReportFilters) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!userProfile) {
        setReports([]);
        return;
      }
      
      let query = supabase
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
      
      // Role-based filtering
      if (userProfile.role === 'field_officer') {
        query = query.eq('author_id', userProfile.id);
      } else if (
        userProfile.role === 'project_officer' || 
        userProfile.role === 'regional_project_officer' || 
        userProfile.role === 'assistant_project_officer'
      ) {
        if (userProfile.region) {
          query = query.eq('region', userProfile.region);
        }
      }
      
      // Sort by creation date, newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        const transformedReports: Report[] = data.map(report => ({
          id: report.id,
          title: report.title,
          date: report.created_at,
          author: report.author_name || 'Unknown',
          category: report.category,
          status: report.status,
          content: report.content
        }));

        setReports(transformedReports);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error("Error loading reports:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        title: "Error loading reports",
        description: err instanceof Error ? err.message : "Failed to load reports",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [userProfile, filters?.status, filters?.category, filters?.searchTerm]);

  const createReport = async (reportData: Omit<Report, 'id' | 'date'>) => {
    try {
      setIsLoading(true);
      
      if (!userProfile) {
        throw new Error('User must be logged in to create a report');
      }
      
      const { data, error } = await supabase
        .from('reports')
        .insert({
          title: reportData.title,
          content: reportData.content,
          category: reportData.category,
          status: reportData.status,
          author_id: userProfile.id,
          author_name: userProfile.name,
          region: userProfile.region
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Report created",
        description: "Your report has been successfully created"
      });
      
      // Refresh the reports list
      loadReports();
      
      return data[0];
    } catch (err) {
      console.error("Error creating report:", err);
      toast({
        title: "Error creating report",
        description: err instanceof Error ? err.message : "Failed to create report",
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReport = async (reportId: string, updates: Partial<Report>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('reports')
        .update({
          title: updates.title,
          content: updates.content,
          category: updates.category,
          status: updates.status
        })
        .eq('id', reportId);
      
      if (error) throw error;
      
      toast({
        title: "Report updated",
        description: "Your report has been successfully updated"
      });
      
      // Refresh the reports list
      loadReports();
    } catch (err) {
      console.error("Error updating report:", err);
      toast({
        title: "Error updating report",
        description: err instanceof Error ? err.message : "Failed to update report",
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reports,
    isLoading,
    error,
    refetchReports: loadReports,
    createReport,
    updateReport
  };
}
