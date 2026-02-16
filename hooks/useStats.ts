import { StatsRange } from '@/constants/wakatime';
import { useOrganizationStore } from '@/stores/useOrganizationStore';
import { useStatsStore } from '@/stores/useStatsStore';
import { useEffect } from 'react';

export function useStats(range: StatsRange = 'last_7_days') {
  const { data, isLoading, error, fetchStats } = useStatsStore();
  const { selectedOrganization } = useOrganizationStore();
  const orgId = selectedOrganization?.id;
  const cacheKey = orgId ? `${range}_${orgId}` : range;

  useEffect(() => {
    fetchStats(range, orgId);
  }, [range, orgId, fetchStats]);

  return {
    data: data[cacheKey] || null,
    isLoading,
    error,
    refetch: () => fetchStats(range, orgId),
    isRefetching: isLoading,
  };
}
