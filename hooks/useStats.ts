import { StatsRange } from '@/constants/wakatime';
import { useStatsStore } from '@/stores/useStatsStore';
import { useEffect } from 'react';

export function useStats(range: StatsRange = 'last_7_days') {
  const { data, isLoading, error, fetchStats } = useStatsStore();

  useEffect(() => {
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
