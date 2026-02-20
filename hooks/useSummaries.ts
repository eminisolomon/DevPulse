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
        } as any);
      }
      return wakaService.getSummaries(startStr, endStr);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    // Data
    data: query.data,

    // State
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,

    // Actions
    refetch: query.refetch,
  };
}
