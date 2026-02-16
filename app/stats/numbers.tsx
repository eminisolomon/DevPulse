import {
  RadialClockChart,
  SegmentedStatsCard,
  TimeRange,
  TimeRangeSelector,
} from '@/components';
import ActivityChart from '@/components/ActivityChart';
import { Card } from '@/components/Card';
import { PunchCard } from '@/components/PunchCard';
import { Typography } from '@/components/Typography';
import { useDurations } from '@/hooks/useDurations';
import { usePunchCardData } from '@/hooks/usePunchCardData';
import { useStats } from '@/hooks/useStats';
import { useSummaries } from '@/hooks/useSummaries';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
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

export default function NumbersScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [range, setRange] = useState<TimeRange>('7_days');
  const { start, end } = useMemo(() => getDates(range), [range]);

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
    statsLoading || summariesLoading || punchLoading || durationsLoading;
  const isRefetching = isStatsRefetching || isSummariesRefetching;

  const handleRefresh = () => {
    refetchStats();
    refetchSummaries();
  };

  if (isLoading && !stats && !summaries) {
    return (
      <View
        style={[styles.loading, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const statItems = [
    {
      label: 'All Time Total',
      value: stats?.data?.human_readable_total || '0h 0m',
      icon: 'time-outline',
      color: theme.colors.primary,
      fullWidth: true,
    },
    {
      label: 'Daily Average',
      value: stats?.data?.human_readable_daily_average || '0h 0m',
      icon: 'stats-chart-outline',
      color: theme.colors.secondary,
      fullWidth: true,
    },
    {
      label: 'Languages',
      value: stats?.data?.languages?.length?.toString() || '0',
      icon: 'code-slash-outline',
      color: theme.colors.accent,
      fullWidth: false,
    },
    {
      label: 'Projects',
      value: stats?.data?.projects?.length?.toString() || '0',
      icon: 'folder-outline',
      color: '#4CAF50',
      fullWidth: false,
    },
    {
      label: 'Editors',
      value: stats?.data?.editors?.length?.toString() || '0',
      icon: 'create-outline',
      color: '#FF9800',
      fullWidth: false,
    },
    {
      label: 'OS',
      value: stats?.data?.operating_systems?.length?.toString() || '0',
      icon: 'desktop-outline',
      color: '#9C27B0',
      fullWidth: false,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Typography
          variant="caption"
          color={theme.colors.textSecondary}
          style={styles.subtitle}
        >
          Detailed analytics
        </Typography>

        <TimeRangeSelector value={range} onChange={setRange} />
        <View style={{ height: 16 }} />

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

        <View style={styles.grid}>
          {statItems.map((item, index) => (
            <Card
              key={index}
              style={[
                styles.statCard,
                item.fullWidth ? { width: '100%' } : { width: '48%' },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              </View>
              <View style={styles.statInfo}>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                >
                  {item.label}
                </Typography>
                <Typography variant="title" weight="bold">
                  {item.value}
                </Typography>
              </View>
            </Card>
          ))}
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

        {stats?.data?.best_day && (
          <Card style={styles.bestDayCard}>
            <View style={styles.bestDayHeader}>
              <Ionicons name="trophy-outline" size={24} color="#FFD700" />
              <Typography
                variant="title"
                weight="bold"
                style={styles.bestDayTitle}
              >
                Best Day
              </Typography>
            </View>
            <View style={styles.bestDayInfo}>
              <Typography
                variant="headline"
                color={theme.colors.primary}
                weight="bold"
              >
                {stats.data.best_day.text}
              </Typography>
              <Typography variant="body" color={theme.colors.textSecondary}>
                on {stats.data.best_day.date}
              </Typography>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  subtitle: {
    marginBottom: 24,
  },
  grid: {
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statInfo: {
    flex: 1,
  },
  bestDayCard: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#FFD70010',
    borderWidth: 1,
    borderColor: '#FFD70030',
  },
  bestDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bestDayTitle: {
    marginLeft: 12,
  },
  bestDayInfo: {
    alignItems: 'center',
    paddingVertical: 10,
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
