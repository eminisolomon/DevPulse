import { Typography } from '@/components';
import { UserProfileSkeleton } from '@/components/skeletons';
import { ProfileHeader, ProfileStats, UserLanguages } from '@/features';
import { useLeaderboard, useStats, useTheme, useUser } from '@/hooks';
import { useLeaderboardStore } from '@/stores';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    refetch: refetchLeaderboard,
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
  const { userRanks } = useLeaderboardStore();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchLeaderboard(), refetchUser(), refetchStats()]);
    setRefreshing(false);
  }, [refetchLeaderboard, refetchUser, refetchStats]);

  const isSelf = currentUser?.data?.id === id;

  const userRank = useMemo(() => {
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
  }, [
    leaderboardData,
    id,
    isSelf,
    currentUser,
    statsData,
    userRanks.global,
  ]) as any;

  const isLoading =
    isLeaderboardLoading || (isSelf && (isUserLoading || isStatsLoading));

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom', 'left', 'right']}
      >
        <UserProfileSkeleton />
      </SafeAreaView>
    );
  }

  if (!userRank) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom', 'left', 'right']}
      >
        <Typography
          variant="headline"
          weight="bold"
          style={{ margin: 16, textAlign: 'center', marginTop: 100 }}
        >
          User Not Found
        </Typography>
        <Typography
          color={theme.colors.textSecondary}
          style={{ textAlign: 'center', marginHorizontal: 32 }}
        >
          We couldn't find this user in the current leaderboard. They might not
          have any activity for this period.
        </Typography>
      </SafeAreaView>
    );
  }

  const { user, running_total, rank } = userRank;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <ProfileHeader user={user} rank={rank} isSelf={isSelf} />
        <ProfileStats runningTotal={running_total} />
        <UserLanguages languages={running_total.languages} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
