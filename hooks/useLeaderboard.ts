import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import { useEffect } from 'react';

export function useLeaderboard() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    selectedCountry,
    fetchLeaderboard,
    fetchNextPage,
    hasMore,
  } = useLeaderboardStore();

  useEffect(() => {
    if (data.length === 0 && !isLoading && !error) {
      fetchLeaderboard();
    }
  }, [data.length, fetchLeaderboard, isLoading, error]);

  return {
    data: {
      pages: data,
      pageParams: data.map((_, i) => i + 1),
    },
    isLoading,
    isRefetching: isLoading,
    refetch: () => fetchLeaderboard(true),
    fetchNextPage,
    hasNextPage: hasMore,
    isFetchingNextPage,
    error,
  };
}
