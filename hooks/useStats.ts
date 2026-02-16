import { useStatsStore } from '@/stores/useStatsStore';
import { useEffect } from 'react';

export function useStats(range: string = 'last_7_days') {
  const { data, isLoading, error, fetchStats } = useStatsStore();

  useEffect(() => {
    // Initial fetch if data for range doesn't exist
    if (!data[range]) {
      fetchStats(range);
    }
  }, [range, data, fetchStats]);

  return {
    data: data[range] || null,
    isLoading,
    error,
    refetch: () => fetchStats(range),
    isRefetching: isLoading,
  };
}
