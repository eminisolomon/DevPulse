import { WakaTimeSummaries } from '@/interfaces';
import { wakaService } from '@/services/waka.service';
import { useOrganizationStore } from '@/stores';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

export function useSummaries(start: Date, end: Date) {
  const { selectedOrganization } = useOrganizationStore();
  const orgId = selectedOrganization?.id;
  const startStr = format(start, 'yyyy-MM-dd');
  const endStr = format(end, 'yyyy-MM-dd');

  const query = useQuery({
    queryKey: ['summaries', startStr, endStr, orgId],
    queryFn: () => {
      if (orgId) {
        return Promise.resolve({
          data: [],
          start: startStr,
          end: endStr,
          cumulative_total: {
            seconds: 0,
            text: '0 hrs 0 mins',
          },
        } as WakaTimeSummaries);
      }
      return wakaService.getSummaries(startStr, endStr);
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    refetch: query.refetch,
  };
}
