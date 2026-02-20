import { WakaTimeGoalsResponse } from '@/interfaces';
import { wakaService } from '@/services';
import { useQuery } from '@tanstack/react-query';

export function useGoals() {
  const query = useQuery<WakaTimeGoalsResponse>({
    queryKey: ['goals'],
    queryFn: () => wakaService.getGoals(),
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
