import { wakaService } from '@/services';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

export function useProjectSummaries(
  projectName: string,
  start: Date,
  end: Date,
) {
  const startStr = format(start, 'yyyy-MM-dd');
  const endStr = format(end, 'yyyy-MM-dd');

  const query = useQuery({
    queryKey: ['project-summaries', projectName, startStr, endStr],
    queryFn: async () => {
      return wakaService.getSummaries(startStr, endStr, projectName);
    },
    enabled: !!projectName,
    staleTime: 0,
    gcTime: 0,
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
