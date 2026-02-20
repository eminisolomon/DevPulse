import { wakaService } from '@/services/waka.service';
import { useLeaderboardStore, useOrganizationStore } from '@/stores';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function useLeaderboard() {
  const { selectedCountry } = useLeaderboardStore();
  const { selectedOrganization } = useOrganizationStore();
  const orgId = selectedOrganization?.id;

  const leaderboardQuery = useInfiniteQuery({
    queryKey: ['leaderboard', selectedCountry, orgId],
    queryFn: ({ pageParam = 1 }) => {
      if (orgId) {
        return Promise.resolve({
          data: [],
          total_pages: 0,
          page: 1,
        } as any);
      }
      const countryCode =
        selectedCountry === 'GLOBAL' ? undefined : selectedCountry;
      return wakaService.getLeaderboard(undefined, countryCode, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 10 * 60 * 1000,
  });

  const ranksQuery = useQuery({
    queryKey: ['userRanks', selectedCountry],
    queryFn: async () => {
      const countryCode =
        selectedCountry === 'GLOBAL' ? undefined : selectedCountry;
      const globalResponse = await wakaService.getLeaderboard(
        undefined,
        undefined,
        1,
      );
      const globalRank = globalResponse.current_user?.rank;

      let countryRank;
      if (countryCode) {
        const countryResponse = await wakaService.getLeaderboard(
          undefined,
          countryCode,
          1,
        );
        countryRank = countryResponse.current_user?.rank;
      }

      return { global: globalRank, country: countryRank };
    },
    enabled: !orgId,
    staleTime: 30 * 60 * 1000,
  });

  return {
    // Data
    data: leaderboardQuery.data,
    userRanks: {
      global: ranksQuery.data?.global,
      country: ranksQuery.data?.country,
      isLoading: ranksQuery.isLoading,
    },

    // State
    isLoading: leaderboardQuery.isLoading,
    isRefetching: leaderboardQuery.isRefetching,
    isFetchingNextPage: leaderboardQuery.isFetchingNextPage,
    hasNextPage: leaderboardQuery.hasNextPage,
    error: leaderboardQuery.error
      ? (leaderboardQuery.error as Error).message
      : null,

    // Actions
    refetch: leaderboardQuery.refetch,
    fetchNextPage: leaderboardQuery.fetchNextPage,
  };
}
