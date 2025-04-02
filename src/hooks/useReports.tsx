
import { useState, useEffect } from 'react';
import { fetchReports, Report, ReportFilters } from '@/services/reportService';

export function useReports(filters?: ReportFilters) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchReports(filters);
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [filters?.status, filters?.category, filters?.searchTerm]);

  return {
    reports,
    isLoading,
    error,
    refetchReports: loadReports
  };
}
