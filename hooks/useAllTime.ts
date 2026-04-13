import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';

export function useAllTime() {
  const query = useQuery({
    queryKey: ['allTime'],
    queryFn: () => wakaService.getAllTimeSinceToday(),
    staleTime: 5 * 60 * 1000,
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
