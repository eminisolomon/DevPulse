import { wakaService } from '@/services/waka.service';
import { useQuery } from '@tanstack/react-query';

export function useUser() {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: () => wakaService.getUser(),
    staleTime: 30 * 60 * 1000, // 30 minutes
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
