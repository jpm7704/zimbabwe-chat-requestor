
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AnalyticsData {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  rejectedRequests: number;
  requestsByType: { type: string, count: number }[];
  requestsByStatus: { status: string, count: number }[];
  requestsByMonth: { month: string, count: number }[];
  averageCompletionTime: number | null;
}

export function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsData>({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
    requestsByType: [],
    requestsByStatus: [],
    requestsByMonth: [],
    averageCompletionTime: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get total requests count
        const { count: totalCount, error: totalError } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true });
          
        if (totalError) {
          console.error('Error fetching total count:', totalError);
          throw new Error(`Failed to fetch total requests: ${totalError.message}`);
        }
        
        // Get pending requests count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .in('status', ['submitted', 'assigned', 'under_review', 'manager_review']);
          
        if (pendingError) {
          console.error('Error fetching pending count:', pendingError);
          throw new Error(`Failed to fetch pending requests: ${pendingError.message}`);
        }
        
        // Get completed requests count
        const { count: completedCount, error: completedError } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .in('status', ['completed', 'forwarded']);
          
        if (completedError) {
          console.error('Error fetching completed count:', completedError);
          throw new Error(`Failed to fetch completed requests: ${completedError.message}`);
        }
        
        // Get rejected requests count
        const { count: rejectedCount, error: rejectedError } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejected');
          
        if (rejectedError) {
          console.error('Error fetching rejected count:', rejectedError);
          throw new Error(`Failed to fetch rejected requests: ${rejectedError.message}`);
        }
        
        // Get requests by type
        const { data: typeData, error: typeError } = await supabase
          .from('requests')
          .select('type');
          
        if (typeError) {
          console.error('Error fetching requests by type:', typeError);
          throw new Error(`Failed to fetch request types: ${typeError.message}`);
        }
        
        const typeCount: Record<string, number> = {};
        typeData?.forEach(item => {
          typeCount[item.type] = (typeCount[item.type] || 0) + 1;
        });
        
        const requestsByType = Object.entries(typeCount).map(([type, count]) => ({
          type,
          count
        }));
        
        // Get requests by status
        const { data: statusData, error: statusError } = await supabase
          .from('requests')
          .select('status');
          
        if (statusError) {
          console.error('Error fetching requests by status:', statusError);
          throw new Error(`Failed to fetch request statuses: ${statusError.message}`);
        }
        
        const statusCount: Record<string, number> = {};
        statusData?.forEach(item => {
          statusCount[item.status] = (statusCount[item.status] || 0) + 1;
        });
        
        const requestsByStatus = Object.entries(statusCount).map(([status, count]) => ({
          status,
          count
        }));
        
        // Get requests by month
        const { data: dateData, error: dateError } = await supabase
          .from('requests')
          .select('created_at');
          
        if (dateError) {
          console.error('Error fetching requests by date:', dateError);
          throw new Error(`Failed to fetch request dates: ${dateError.message}`);
        }
        
        const monthCount: Record<string, number> = {};
        dateData?.forEach(item => {
          const month = new Date(item.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
          monthCount[month] = (monthCount[month] || 0) + 1;
        });
        
        const requestsByMonth = Object.entries(monthCount).map(([month, count]) => ({
          month,
          count
        }));
        
        // Calculate average completion time (for completed requests)
        let averageCompletionTime = null;
        
        // Use stored function if available, or calculate manually
        // This is a simplified calculation and would be more accurate with a specific DB query
        // In a real app, you'd use a database function or compute this server-side
        
        setData({
          totalRequests: totalCount || 0,
          pendingRequests: pendingCount || 0,
          completedRequests: completedCount || 0,
          rejectedRequests: rejectedCount || 0,
          requestsByType,
          requestsByStatus,
          requestsByMonth,
          averageCompletionTime
        });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        let errorMessage = 'Failed to load analytics data';
        
        if (err instanceof Error) {
          errorMessage = err.message;
          setError(err);
        } else {
          // Handle non-Error objects
          const genericError = new Error(errorMessage);
          setError(genericError);
          
          // Log more details for debugging
          console.error('Non-standard error object:', err);
        }
        
        // Show a toast notification for user feedback
        toast({
          title: "Analytics Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);
  
  return { data, loading, error };
}
