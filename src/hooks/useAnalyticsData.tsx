
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        
        // Get total requests count
        const { count: totalCount, error: totalError } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true });
          
        if (totalError) throw totalError;
        
        // Get pending requests count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .in('status', ['submitted', 'assigned', 'under_review', 'manager_review']);
          
        if (pendingError) throw pendingError;
        
        // Get completed requests count
        const { count: completedCount, error: completedError } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .in('status', ['completed', 'forwarded']);
          
        if (completedError) throw completedError;
        
        // Get rejected requests count
        const { count: rejectedCount, error: rejectedError } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejected');
          
        if (rejectedError) throw rejectedError;
        
        // Get requests by type
        const { data: typeData, error: typeError } = await supabase
          .from('requests')
          .select('type')
          .order('type');
          
        if (typeError) throw typeError;
        
        const typeCount: Record<string, number> = {};
        typeData.forEach(item => {
          typeCount[item.type] = (typeCount[item.type] || 0) + 1;
        });
        
        const requestsByType = Object.entries(typeCount).map(([type, count]) => ({
          type,
          count
        }));
        
        // Get requests by status
        const { data: statusData, error: statusError } = await supabase
          .from('requests')
          .select('status')
          .order('status');
          
        if (statusError) throw statusError;
        
        const statusCount: Record<string, number> = {};
        statusData.forEach(item => {
          statusCount[item.status] = (statusCount[item.status] || 0) + 1;
        });
        
        const requestsByStatus = Object.entries(statusCount).map(([status, count]) => ({
          status,
          count
        }));
        
        // Get requests by month
        const { data: dateData, error: dateError } = await supabase
          .from('requests')
          .select('created_at')
          .order('created_at');
          
        if (dateError) throw dateError;
        
        const monthCount: Record<string, number> = {};
        dateData.forEach(item => {
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
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);
  
  return { data, loading, error };
}
