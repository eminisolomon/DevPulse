import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';

export function useAllTime() {
  const query = useQuery({
    queryKey: ['allTime'],
    queryFn: () => wakaService.getAllTimeSinceToday(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return {
    // Data
    data: query.data || null,

    // State
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,

    // Actions
    refetch: query.refetch,
  };
}
