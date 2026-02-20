import { useCallback, useMemo, useState } from 'react';
import { useLeaderboard } from './useLeaderboard';
import { useStats } from './useStats';
import { useUser } from './useUser';

export function useUserProfile(id: string) {
  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    refetch: refetchLeaderboard,
    userRanks,
  } = useLeaderboard();

  const {
    data: currentUser,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useUser();

  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useStats('last_7_days');

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchLeaderboard(), refetchUser(), refetchStats()]);
    setRefreshing(false);
  }, [refetchLeaderboard, refetchUser, refetchStats]);

  const isSelf = currentUser?.data?.id === id;

  const profile = useMemo(() => {
    if (leaderboardData?.pages) {
      const found = leaderboardData.pages
        .flatMap((page: any) => page.data)
        .find((item: any) => item.user.id === id);
      if (found) return found;
    }

    if (isSelf && currentUser?.data && statsData?.data) {
      return {
        rank: userRanks.global || '?',
        user: currentUser.data,
        running_total: {
          total_seconds: statsData.data.total_seconds,
          human_readable_total: statsData.data.human_readable_total,
          daily_average: statsData.data.daily_average,
          human_readable_daily_average:
            statsData.data.human_readable_daily_average,
          languages: statsData.data.languages.map((l: any) => ({
            name: l.name,
            total_seconds: l.total_seconds,
          })),
        },
      };
    }

    return null;
  }, [leaderboardData, id, isSelf, currentUser, statsData, userRanks.global]);

  const isLoading =
    isLeaderboardLoading || (isSelf && (isUserLoading || isStatsLoading));

  return {
    // Data
    profile,
    isSelf,

    // State
    isLoading,
    refreshing,

    // Actions
    onRefresh,
  };
}
