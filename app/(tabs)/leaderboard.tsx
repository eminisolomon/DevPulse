import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useLeaderboard, useTheme } from '@/hooks';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  // For now, fetching global leaderboard. Language filtering could be added later.
  const { data, isLoading, refetch, isRefetching } = useLeaderboard();

  const renderLeaderboardItem = ({ item }: { item: LeaderboardUser }) => (
    <Card
      style={[
        styles.userCard,
        item.rank === 1 && { borderColor: '#FFD700', borderWidth: 2 },
      ]}
    >
      <View style={styles.rankContainer}>
        <Typography
          variant="title"
          weight="bold"
          color={
            item.rank <= 3 ? theme.colors.primary : theme.colors.textSecondary
          }
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

      {item.rank <= 3 && (
        <Feather
          name="award"
          size={20}
          color={
            item.rank === 1
              ? '#FFD700'
              : item.rank === 2
                ? '#C0C0C0'
                : '#CD7F32'
          }
        />
      )}
    </Card>
  );

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Typography variant="headline" weight="bold">
          Leaderboard
        </Typography>
        <Typography color={theme.colors.textSecondary}>
          Top developers this week
        </Typography>
      </View>

      <FlatList
        data={data?.data}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.user.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
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
        }
      />
    </SafeAreaView>
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
    paddingBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
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
});
