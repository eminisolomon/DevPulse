import { useProjectsStore } from '@/stores';
import { useEffect } from 'react';

export function useProjects() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    fetchProjects,
    fetchNextPage,
    hasMore,
  } = useProjectsStore();

  useEffect(() => {
    if (data.length === 0) {
      fetchProjects();
    }
  }, [data.length, fetchProjects]);

  return {
    data: {
      pages: [{ data }],
    },
    isLoading,
    isRefetching: isLoading,
    refetch: () => fetchProjects(true),
    fetchNextPage,
    hasNextPage: hasMore,
    isFetchingNextPage,
    error,
  };
}
