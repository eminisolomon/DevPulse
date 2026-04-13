import { StatsRange } from '@/constants/wakatime';
import { wakaService } from '@/services/waka.service';
import { useOrganizationStore } from '@/stores';
import { useQuery } from '@tanstack/react-query';

export function useStats(range: StatsRange = 'last_7_days') {
  const { selectedOrganization } = useOrganizationStore();
  const orgId = selectedOrganization?.id;

  const query = useQuery({
    queryKey: ['stats', range, orgId],
    queryFn: () => {
      if (orgId) {
        return wakaService.getOrgStats(orgId, range);
      }
      return wakaService.getStats(range);
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    refetch: query.refetch,
  };
}
