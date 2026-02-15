import {
  RadialClockChart,
  SegmentedStatsCard,
  TimeRange,
  TimeRangeSelector,
} from '@/components';
import ActivityChart from '@/components/ActivityChart';
import { PunchCard } from '@/components/PunchCard';
import { Typography } from '@/components/Typography';
import { useDurations } from '@/hooks/useDurations';
import { usePunchCardData } from '@/hooks/usePunchCardData';
import { useStats } from '@/hooks/useStats';
import { useSummaries } from '@/hooks/useSummaries';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { subDays } from 'date-fns';
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const rangeApiMap: Record<TimeRange, string> = {
  '7_days': 'last_7_days',
  '30_days': 'last_30_days',
  year: 'last_year',
  all_time: 'all_time',
};

const getDates = (r: TimeRange) => {
  const today = new Date();
  switch (r) {
    case '7_days':
      return { start: subDays(today, 6), end: today };
    case '30_days':
      return { start: subDays(today, 29), end: today };
    case 'year':
      return { start: subDays(today, 364), end: today };
    case 'all_time':
      return { start: subDays(today, 3650), end: today };
    default:
      return { start: subDays(today, 6), end: today };
  }
};

export default function Dashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const { apiKey } = useAuthStore();

  if (!apiKey) {
    return <Redirect href="/" />;
  }

  const [range, setRange] = useState<TimeRange>('7_days');
  const { start, end } = useMemo(() => getDates(range), [range]);

  const { data: user, isLoading: userLoading } = useUser();

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    isRefetching: isStatsRefetching,
  } = useStats(rangeApiMap[range]);

  const {
    data: summaries,
    isLoading: summariesLoading,
    refetch: refetchSummaries,
    isRefetching: isSummariesRefetching,
  } = useSummaries(start, end);

  const { data: punchData, isLoading: punchLoading } = usePunchCardData(
    range === '7_days' ? 7 : range === '30_days' ? 30 : 90,
  );

  const { data: durationSessions, isLoading: durationsLoading } =
    useDurations();

  const isLoading =
    userLoading || statsLoading || summariesLoading || durationsLoading;
  const isRefetching = isStatsRefetching || isSummariesRefetching;

  const handleRefresh = () => {
    refetchStats();
    refetchSummaries();
  };

  if (isLoading && !stats && !summaries) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
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
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Typography
                variant="caption"
                weight="semibold"
                color={theme.colors.textSecondary}
                style={styles.greeting}
              >
                Welcome back
              </Typography>
              <Typography variant="headline" weight="bold">
                {user?.data?.display_name ||
                  user?.data?.username ||
                  'Developer'}
              </Typography>
            </View>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Image
                source={{
                  uri: user?.data?.photo || 'https://via.placeholder.com/150',
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.banner,
            { backgroundColor: theme.colors.primary + '10' },
          ]}
          onPress={() => router.push('/stats/numbers' as any)}
        >
          <View>
            <Typography
              variant="body"
              weight="bold"
              color={theme.colors.primary}
            >
              The Numbers
            </Typography>
            <Typography variant="caption" color={theme.colors.textSecondary}>
              Tap for cumulative lifetime analytics
            </Typography>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        <TimeRangeSelector value={range} onChange={setRange} />

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                marginRight: 8,
              },
            ]}
          >
            <Typography
              variant="micro"
              weight="medium"
              color={theme.colors.textSecondary}
              style={styles.statLabel}
            >
              7 Day Total
            </Typography>
            <Typography
              variant="title"
              color={theme.colors.primary}
              weight="bold"
            >
              {stats?.data?.human_readable_total || '0h 0m'}
            </Typography>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                marginLeft: 8,
              },
            ]}
          >
            <Typography
              variant="micro"
              weight="medium"
              color={theme.colors.textSecondary}
              style={styles.statLabel}
            >
              Daily Average
            </Typography>
            <Typography variant="title" weight="bold">
              {stats?.data?.human_readable_daily_average || '0h 0m'}
            </Typography>
          </View>
        </View>

        {stats?.data?.languages && (
          <SegmentedStatsCard
            title="Top Languages"
            segments={stats.data.languages.slice(0, 5).map((l) => ({
              label: l.name,
              percent: l.percent,
              color: l.color || theme.colors.primary,
              valueText: l.text,
            }))}
          />
        )}

        {stats?.data?.categories && (
          <SegmentedStatsCard
            title="Categories"
            segments={stats.data.categories.slice(0, 5).map((c) => ({
              label: c.name,
              percent: c.percent,
              color: theme.colors.secondary,
              valueText: c.text,
            }))}
          />
        )}

        {stats?.data?.editors && (
          <SegmentedStatsCard
            title="Editors"
            segments={stats.data.editors.slice(0, 5).map((e) => ({
              label: e.name,
              percent: e.percent,
              color: theme.colors.accent,
              valueText: e.text,
            }))}
          />
        )}

        {stats?.data?.operating_systems && (
          <SegmentedStatsCard
            title="Operating Systems"
            segments={stats.data.operating_systems.slice(0, 5).map((o) => ({
              label: o.name,
              percent: o.percent,
              color: theme.colors.primary,
              valueText: o.text,
            }))}
          />
        )}

        {durationSessions && <RadialClockChart sessions={durationSessions} />}

        {!punchLoading && punchData && <PunchCard data={punchData} />}

        <View style={styles.chartSection}>
          <Typography variant="title" weight="bold" style={styles.chartTitle}>
            Daily Activity
          </Typography>
          <View
            style={[
              styles.chartCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                padding: 16,
              },
            ]}
          >
            {summaries?.data ? (
              <ActivityChart data={summaries.data} />
            ) : (
              <Typography
                color={theme.colors.textSecondary}
                style={styles.noDataText}
              >
                Loading activity data...
              </Typography>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  greeting: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  chartSection: {
    marginBottom: 32,
  },
  chartTitle: {
    marginBottom: 16,
  },
  chartCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 40,
  },
});
