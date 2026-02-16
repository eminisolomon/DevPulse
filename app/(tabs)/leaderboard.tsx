import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Typography } from '@/components/Typography';
import { useLeaderboard, useTheme } from '@/hooks';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LeaderboardScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useLeaderboard();

  const leaderboardData = React.useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data],
  );

  const topThree = React.useMemo(
    () => leaderboardData.slice(0, 3),
    [leaderboardData],
  );

  // Reorder for display: [2nd, 1st, 3rd]
  const displayTopThree = React.useMemo(() => {
    return [
      topThree[1], // 2nd
      topThree[0], // 1st
      topThree[2], // 3rd
    ].filter(Boolean);
  }, [topThree]);

  const remainingUsers = React.useMemo(
    () => leaderboardData.slice(3),
    [leaderboardData],
  );

  const renderLeaderboardItem = ({ item }: { item: LeaderboardUser }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/user/${item.user.id}`)}
    >
      <Card style={styles.userCard}>
        <View style={styles.rankContainer}>
          <Typography
            variant="body"
            weight="bold"
            color={theme.colors.textSecondary}
          >
            #{item.rank}
          </Typography>
        </View>
        <Image
          source={{ uri: item.user.photo || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Typography variant="caption" weight="bold">
            {item.user.display_name || item.user.username || 'Anonymous'}
          </Typography>
          <Typography variant="micro" color={theme.colors.textSecondary}>
            {item.running_total.human_readable_total}
          </Typography>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderTopThree = () => {
    if (displayTopThree.length === 0) return null;

    return (
      <View style={styles.podiumContainer}>
        {displayTopThree.map((user, index) => {
          const podiumRank =
            user.rank === topThree[0]?.rank
              ? 1
              : user.rank === topThree[1]?.rank
                ? 2
                : 3;
          const isFirst = podiumRank === 1;
          const isSecond = podiumRank === 2;
          const colors = {
            1: '#FFD700', // Gold
            2: '#C0C0C0', // Silver
            3: '#CD7F32', // Bronze
          };
          const color = colors[podiumRank as 1 | 2 | 3];

          return (
            <TouchableOpacity
              key={user.user.id}
              activeOpacity={0.8}
              style={[
                styles.podiumItem,
                isFirst && styles.podiumItemFirst,
                isSecond && styles.podiumItemSecond,
              ]}
              onPress={() => router.push(`/user/${user.user.id}`)}
            >
              <View style={styles.avatarWrapper}>
                <Image
                  source={{
                    uri: user.user.photo || 'https://via.placeholder.com/150',
                  }}
                  style={[
                    styles.podiumAvatar,
                    isFirst
                      ? styles.avatarFirst
                      : isSecond
                        ? styles.avatarSecond
                        : styles.avatarThird,
                    { borderColor: color },
                  ]}
                />
                <View style={[styles.podiumBadge, { backgroundColor: color }]}>
                  <Typography
                    variant="micro"
                    weight="bold"
                    color="#FFFFFF"
                    style={user.rank > 999 ? { fontSize: 8 } : undefined}
                  >
                    {user.rank}
                  </Typography>
                </View>
                {isFirst && (
                  <View style={styles.crownContainer}>
                    <Feather name="award" size={24} color="#FFD700" />
                  </View>
                )}
              </View>

              <View style={styles.podiumInfo}>
                <Typography
                  variant="caption"
                  weight="bold"
                  align="center"
                  numberOfLines={1}
                >
                  {user.user.display_name || user.user.username || 'Anon'}
                </Typography>
                <Typography
                  variant="micro"
                  color={theme.colors.textSecondary}
                  align="center"
                  weight="medium"
                >
                  {user.running_total.human_readable_total
                    .replace('hrs', 'h')
                    .replace('mins', 'm')}
                </Typography>
              </View>

              {/* Pedestal effect */}
              <View
                style={[
                  styles.pedestal,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.03)',
                  },
                  isFirst
                    ? styles.pedestalFirst
                    : isSecond
                      ? styles.pedestalSecond
                      : styles.pedestalThird,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  if (isLoading && !data) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScreenHeader
        title="Leaderboard"
        subtitle="Top developers this week"
        actions={[
          {
            icon: 'refresh',
            onPress: () => refetch(),
          },
        ]}
      />

      <FlatList
        data={remainingUsers}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.user.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderTopThree}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          remainingUsers.length === 0 && leaderboardData.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="users" size={48} color={theme.colors.border} />
              <Typography
                variant="title"
                weight="semibold"
                style={styles.emptyTitle}
              >
                Leaderboard Unavailable
              </Typography>
              <Typography
                color={theme.colors.textSecondary}
                style={styles.emptySubtitle}
              >
                Unable to fetch leaderboard data at this time.
              </Typography>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingBottom: 0,
  },
  listContent: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  podiumItemFirst: {
    zIndex: 2,
  },
  podiumItemSecond: {
    zIndex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
  },
  podiumAvatar: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 3,
  },
  avatarFirst: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avatarSecond: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarThird: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  podiumBadge: {
    position: 'absolute',
    bottom: -2,
    right: 0,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 4,
  },
  crownContainer: {
    position: 'absolute',
    top: -20,
    zIndex: 3,
  },
  podiumInfo: {
    paddingHorizontal: 4,
    marginBottom: 8,
    width: '100%',
  },
  pedestal: {
    width: '90%',
    borderRadius: 12,
    position: 'absolute',
    bottom: -16,
    zIndex: -1,
  },
  pedestalFirst: {
    height: 90,
    width: '100%',
  },
  pedestalSecond: {
    height: 70,
  },
  pedestalThird: {
    height: 50,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  userInfo: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
