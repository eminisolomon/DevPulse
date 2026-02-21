import {
  Card,
  NumbersSkeleton,
  SegmentedStatsCard,
  TimeRangeSelector,
  Typography,
} from '@/components';
import { getCategoryColor, getOSColor } from '@/constants';
import { BestDayCard } from '@/features';
import { AIProductivityCard } from '@/features/stats';
import { useMetadata, useStats, useTheme } from '@/hooks';
import { RANGE_API_MAP, TimeRange, VALID_TIME_RANGES } from '@/utilities';
import { generateDeterministicColor } from '@/utilities/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NumbersScreen() {
  const { theme } = useTheme();
  const { getLanguageColor, getEditorColor, getMachineColor } = useMetadata();
  const params = useLocalSearchParams<{ range?: string }>();
  const [range, setRange] = useState<TimeRange>('last_7_days');

  useEffect(() => {
    if (params.range && VALID_TIME_RANGES.includes(params.range as TimeRange)) {
      setRange(params.range as TimeRange);
    }
  }, [params.range]);

  const {
    data: stats,
    isLoading,
    refetch: refetchStats,
    isRefetching,
  } = useStats(RANGE_API_MAP[range]);

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
    },
    {
      label: 'Projects',
      value: stats?.data?.projects?.length?.toString() || '0',
      icon: 'folder-outline',
      color: '#4CAF50',
    },
    {
      label: 'Editors',
      value: stats?.data?.editors?.length?.toString() || '0',
      icon: 'create-outline',
      color: '#FF9800',
    },
    {
      label: 'OS',
      value: stats?.data?.operating_systems?.length?.toString() || '0',
      icon: 'desktop-outline',
      color: '#9C27B0',
    },
  ];

  const sections: {
    title: string;
    data: any[] | undefined;
    getColor: (name: string) => string;
    limit?: number;
  }[] = [
    {
      title: 'Top Languages',
      data: stats?.data?.languages,
      getColor: getLanguageColor,
    },
    {
      title: 'Categories',
      data: stats?.data?.categories,
      getColor: getCategoryColor,
    },
    {
      title: 'Editors',
      data: stats?.data?.editors,
      getColor: getEditorColor,
    },
    {
      title: 'Operating Systems',
      data: stats?.data?.operating_systems,
      getColor: getOSColor,
    },
    {
      title: 'Workstations',
      data: stats?.data?.machines,
      getColor: (name) => {
        const machine = stats?.data?.machines?.find(
          (m: any) => m.name === name,
        );
        return getMachineColor(machine?.machine_name_id);
      },
    },
    {
      title: 'Top Dependencies',
      data: stats?.data?.dependencies,
      getColor: generateDeterministicColor,
      limit: 8,
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
                <Typography
                  variant="title"
                  weight="bold"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.value}
                </Typography>
              </View>
            </Card>
          ))}
        </View>

        {sections.map(
          (section) =>
            section.data &&
            section.data.length > 0 && (
              <SegmentedStatsCard
                key={section.title}
                title={section.title}
                segments={section.data
                  .slice(0, section.limit || 5)
                  .map((item) => ({
                    label: item.name,
                    percent: item.percent,
                    color: section.getColor(item.name),
                    valueText: item.text,
                  }))}
              />
            ),
        )}

        {stats?.data?.ai_additions !== undefined && (
          <AIProductivityCard
            aiAdditions={stats.data.ai_additions || 0}
            aiDeletions={stats.data.ai_deletions || 0}
            humanAdditions={stats.data.human_additions || 0}
            humanDeletions={stats.data.human_deletions || 0}
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
