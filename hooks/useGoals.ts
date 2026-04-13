import { WakaTimeGoalsResponse } from '@/interfaces';
import { wakaService } from '@/services';
import { useQuery } from '@tanstack/react-query';

export function useGoals() {
  const query = useQuery<WakaTimeGoalsResponse>({
    queryKey: ['goals'],
    queryFn: () => wakaService.getGoals(),
    staleTime: 5 * 60 * 1000,
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
