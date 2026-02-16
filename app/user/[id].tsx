import { Avatar, Card, Typography } from '@/components';
import { UserProfileSkeleton } from '@/components/skeletons';
import { useLeaderboard, useStats, useTheme, useUser } from '@/hooks';
import { useLeaderboardStore } from '@/stores';
import { formatDuration } from '@/utilities';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { data: leaderboardData, isLoading: isLeaderboardLoading } =
    useLeaderboard();
  const { data: currentUser, isLoading: isUserLoading } = useUser();
  const { data: statsData, isLoading: isStatsLoading } =
    useStats('last_7_days');
  const { userRanks } = useLeaderboardStore();

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Avatar
              source={user.photo ? { uri: user.photo } : undefined}
              initials={user.display_name || user.username}
              size={120}
            />
            <View
              style={[
                styles.rankBadge,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Typography
                variant="micro"
                weight="bold"
                style={{ color: '#fff' }}
              >
                #{rank}
              </Typography>
            </View>
          </View>

          <Typography variant="title" weight="bold" style={styles.displayName}>
            {user.display_name || user.username || 'Anonymous'}
          </Typography>
          <Typography
            color={theme.colors.textSecondary}
            style={styles.username}
          >
            @{user.username || 'anonymous'}
          </Typography>

          <View style={styles.badgesContainer}>
            {user.is_hireable && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.colors.primary + '15' },
                ]}
              >
                <Feather name="zap" size={14} color={theme.colors.primary} />
                <Typography
                  variant="caption"
                  weight="bold"
                  color={theme.colors.primary}
                  style={styles.badgeText}
                >
                  HIREABLE
                </Typography>
              </View>
            )}

            {user.website && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.badge,
                  { backgroundColor: theme.colors.surfaceHighlight },
                ]}
                onPress={() => Linking.openURL(user.website!)}
              >
                <Feather
                  name="globe"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Typography
                  variant="caption"
                  weight="bold"
                  color={theme.colors.textSecondary}
                  style={styles.badgeText}
                >
                  PORTFOLIO
                </Typography>
              </TouchableOpacity>
            )}

            {user.email && user.is_email_public && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.badge,
                  { backgroundColor: theme.colors.surfaceHighlight },
                ]}
                onPress={() => Linking.openURL(`mailto:${user.email}`)}
              >
                <Feather
                  name="mail"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Typography
                  variant="caption"
                  weight="bold"
                  color={theme.colors.textSecondary}
                  style={styles.badgeText}
                >
                  EMAIL
                </Typography>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Typography
              variant="micro"
              color={theme.colors.textSecondary}
              style={styles.statLabel}
            >
              WEEKLY TOTAL
            </Typography>
            <Typography variant="title" weight="bold">
              {running_total.human_readable_total}
            </Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography
              variant="micro"
              color={theme.colors.textSecondary}
              style={styles.statLabel}
            >
              DAILY AVG
            </Typography>
            <Typography variant="title" weight="bold">
              {running_total.human_readable_daily_average}
            </Typography>
          </Card>
        </View>

        <Typography
          variant="micro"
          weight="bold"
          color={theme.colors.textSecondary}
          style={styles.sectionHeader}
        >
          TOP LANGUAGES
        </Typography>
        <Card style={styles.languagesCard}>
          {running_total.languages.map((lang: any, index: number) => (
            <View
              key={lang.name}
              style={[
                styles.langItem,
                index !== running_total.languages.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border + '50',
                },
              ]}
            >
              <Typography weight="medium">{lang.name}</Typography>
              <Typography color={theme.colors.textSecondary}>
                {formatDuration(lang.total_seconds)}
              </Typography>
            </View>
          ))}
          {running_total.languages.length === 0 && (
            <Typography
              color={theme.colors.textSecondary}
              style={{ textAlign: 'center', padding: 16 }}
            >
              No language data available
            </Typography>
          )}
        </Card>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  rankBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
  },
  displayName: {
    marginBottom: 4,
  },
  username: {
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    marginBottom: 8,
  },
  sectionHeader: {
    marginLeft: 4,
    marginBottom: 12,
  },
  languagesCard: {
    padding: 4,
    marginBottom: 24,
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  socialGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
});
