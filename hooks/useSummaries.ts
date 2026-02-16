import { useSummariesStore } from '@/stores/useSummariesStore';
import { format } from 'date-fns';
import { useEffect } from 'react';

export function useSummaries(start: Date, end: Date) {
  const { data, isLoading, error, fetchSummaries } = useSummariesStore();
  const startStr = format(start, 'yyyy-MM-dd');
  const endStr = format(end, 'yyyy-MM-dd');
  const key = `${startStr}_${endStr}`;

  useEffect(() => {
    fetchSummaries(start, end);
  }, [key, fetchSummaries, startStr, endStr]);

  return {
    data: data[key] || undefined,
    isLoading,
    error,
    refetch: () => fetchSummaries(start, end),
    isRefetching: isLoading,
  };
}
