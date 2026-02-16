import { useSummariesStore } from '@/stores/useSummariesStore';
import { useEffect } from 'react';

export function useSummaries(start: Date, end: Date) {
  const { data, isLoading, error, fetchSummaries } = useSummariesStore();
  const key = `${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}`;

  useEffect(() => {
    fetchSummaries(start, end);
  }, [key, fetchSummaries, start, end]);

  return {
    data: data[key] || undefined,
    isLoading,
    error,
    refetch: () => fetchSummaries(start, end),
    isRefetching: isLoading,
  };
}
