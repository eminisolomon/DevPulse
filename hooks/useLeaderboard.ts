import { useLeaderboardStore, useOrganizationStore } from '@/stores';
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
  const { selectedOrganization } = useOrganizationStore();
  const orgId = selectedOrganization?.id;

  useEffect(() => {
    fetchLeaderboard(true, orgId);
  }, [fetchLeaderboard, orgId, selectedCountry]);

  return {
    data: {
      pages: data,
      pageParams: data.map((_, i) => i + 1),
    },
    isLoading,
    isRefetching: isLoading,
    refetch: () => fetchLeaderboard(true, orgId),
    fetchNextPage: () => fetchNextPage(orgId),
    hasNextPage: hasMore,
    isFetchingNextPage,
    error,
  };
}
