import { wakaService } from '@/services/waka.service';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useProjects() {
  const query = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam = 1 }) => wakaService.getProjects(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < (lastPage.total_pages || 1)) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    // Data
    data: query.data,

    // State
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    error: query.error ? (query.error as Error).message : null,

    // Actions
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
  };
}
