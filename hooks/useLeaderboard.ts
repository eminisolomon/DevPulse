import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import { useEffect } from 'react';

export function useLeaderboard(countryCode?: string, language?: string) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    selectedCountry,
    setSelectedCountry,
    fetchLeaderboard,
    fetchNextPage,
    hasMore,
  } = useLeaderboardStore();

  useEffect(() => {
    if (countryCode !== selectedCountry) {
      setSelectedCountry(countryCode);
    }
  }, [countryCode, selectedCountry, setSelectedCountry]);

  useEffect(() => {
    if (data.length === 0) {
      fetchLeaderboard();
    }
  }, [data.length, fetchLeaderboard]);

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
