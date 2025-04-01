
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
        const { count: totalCount } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true });
          
        // Get pending requests count
        const { count: pendingCount } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .in('status', ['submitted', 'assigned', 'under_review', 'manager_review']);
          
        // Get completed requests count
        const { count: completedCount } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .in('status', ['completed', 'forwarded']);
          
        // Get rejected requests count
        const { count: rejectedCount } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejected');
          
        // Get requests by type
        const { data: typeData } = await supabase
          .from('requests')
          .select('type');
          
        // Calculate type distribution
        const typeCount: Record<string, number> = {};
        typeData?.forEach(item => {
          if (item.type) {
            typeCount[item.type] = (typeCount[item.type] || 0) + 1;
          }
        });
        
        const requestsByType = Object.entries(typeCount).map(([type, count]) => ({
          type,
          count
        }));
        
        // Get requests by status
        const { data: statusData } = await supabase
          .from('requests')
          .select('status');
          
        const statusCount: Record<string, number> = {};
        statusData?.forEach(item => {
          if (item.status) {
            statusCount[item.status] = (statusCount[item.status] || 0) + 1;
          }
        });
        
        const requestsByStatus = Object.entries(statusCount).map(([status, count]) => ({
          status,
          count
        }));
        
        // Get requests by month
        const { data: dateData } = await supabase
          .from('requests')
          .select('created_at');
          
        const monthCount: Record<string, number> = {};
        dateData?.forEach(item => {
          if (item.created_at) {
            const month = new Date(item.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
            monthCount[month] = (monthCount[month] || 0) + 1;
          }
        });
        
        const requestsByMonth = Object.entries(monthCount).map(([month, count]) => ({
          month,
          count
        }));
        
        // Set the data without throwing errors if values are null
        setData({
          totalRequests: totalCount || 0,
          pendingRequests: pendingCount || 0,
          completedRequests: completedCount || 0,
          rejectedRequests: rejectedCount || 0,
          requestsByType: requestsByType || [],
          requestsByStatus: requestsByStatus || [],
          requestsByMonth: requestsByMonth || [],
          averageCompletionTime: null // Will be implemented in the future
        });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        // We don't set the error state anymore as requested
        // Instead, we ensure the data state has valid defaults
        setData({
          totalRequests: 0,
          pendingRequests: 0,
          completedRequests: 0,
          rejectedRequests: 0,
          requestsByType: [],
          requestsByStatus: [],
          requestsByMonth: [],
          averageCompletionTime: null
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);
  
  return { data, loading, error: null }; // Always return null for error
}
