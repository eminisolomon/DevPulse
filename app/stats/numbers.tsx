import {
  Card,
  NumbersSkeleton,
  SegmentedStatsCard,
  TimeRange,
  TimeRangeSelector,
  Typography,
} from '@/components';
import { getCategoryColor, getOSColor } from '@/constants';
import { BestDayCard } from '@/features';
import { AIProductivityCard } from '@/features/stats';
import { useMetadata, useStats, useTheme } from '@/hooks';
import { generateDeterministicColor } from '@/utilities/colors';
import { Ionicons } from '@expo/vector-icons';
import { subDays } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const rangeApiMap: Record<TimeRange, any> = {
  last_7_days: 'last_7_days',
  last_30_days: 'last_30_days',
  last_year: 'last_year',
  all_time: 'all_time',
  last_6_months: 'last_6_months',
};

const getDates = (r: TimeRange) => {
  const today = new Date();
  switch (r) {
    case 'last_7_days':
      return { start: subDays(today, 6), end: today };
    case 'last_30_days':
      return { start: subDays(today, 29), end: today };
    case 'last_year':
      return { start: subDays(today, 364), end: today };
    case 'all_time':
      return { start: subDays(today, 3650), end: today };
    case 'last_6_months':
      return { start: subDays(today, 180), end: today };
    default:
      return { start: subDays(today, 6), end: today };
  }
};

export default function NumbersScreen() {
  const { theme } = useTheme();
  const { getLanguageColor, getEditorColor, getMachineColor } = useMetadata();
  const params = useLocalSearchParams<{ range?: string }>();
  const [range, setRange] = useState<TimeRange>('last_7_days');
  useMemo(() => getDates(range), [range]);

  useEffect(() => {
    const validRanges: TimeRange[] = [
      'last_7_days',
      'last_30_days',
      'last_6_months',
      'last_year',
      'all_time',
    ];
    if (params.range && validRanges.includes(params.range as TimeRange)) {
      setRange(params.range as TimeRange);
    }
  }, [params.range]);

  const {
    data: stats,
    isLoading,
    refetch: refetchStats,
    isRefetching,
  } = useStats(rangeApiMap[range]);

  const handleRefresh = () => {
    refetchStats();
  };

  if (isLoading && !stats) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom', 'left', 'right']}
      >
        <NumbersSkeleton />
      </SafeAreaView>
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
        <TimeRangeSelector value={range} onChange={setRange} />

        <BestDayCard
          date={stats?.data?.best_day?.date}
          totalTime={stats?.data?.best_day?.text}
          totalSeconds={stats?.data?.best_day?.total_seconds}
          dailyAverage={stats?.data?.daily_average}
          topProject={stats?.data?.projects?.[0]}
        />

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
              color: getLanguageColor(l.name),
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
              color: getCategoryColor(c.name),
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
              color: getEditorColor(e.name),
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
              color: getOSColor(o.name),
              valueText: o.text,
            }))}
          />
        )}

        {stats?.data?.machines && stats.data.machines.length > 0 && (
          <SegmentedStatsCard
            title="Workstations"
            segments={stats.data.machines.slice(0, 5).map((m) => ({
              label: m.name,
              percent: m.percent,
              color: getMachineColor(m.machine_name_id),
              valueText: m.text,
            }))}
          />
        )}

        {stats?.data?.ai_additions !== undefined && (
          <AIProductivityCard
            aiAdditions={stats.data.ai_additions || 0}
            aiDeletions={stats.data.ai_deletions || 0}
            humanAdditions={stats.data.human_additions || 0}
            humanDeletions={stats.data.human_deletions || 0}
          />
        )}

        {stats?.data?.dependencies && stats.data.dependencies.length > 0 && (
          <SegmentedStatsCard
            title="Top Dependencies"
            segments={stats.data.dependencies.slice(0, 8).map((d) => ({
              label: d.name,
              percent: d.percent,
              color: generateDeterministicColor(d.name),
              valueText: d.text,
            }))}
          />
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
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 40,
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
});
