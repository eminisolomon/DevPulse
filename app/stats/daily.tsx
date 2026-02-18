import { ActivityRhythm } from '@/components';
import { DailyStatsSkeleton } from '@/components/skeletons';
import { DailyDistributionStats, DailyTotalCard } from '@/features/stats';
import { useDurations, useStats, useSummaries, useTheme } from '@/hooks';
import { formatDisplayDuration, getDailyStatsTitle } from '@/utilities';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export default function DailyScreen() {
  const { theme, isDark } = useTheme();
  const params = useLocalSearchParams<{ date?: string }>();

  const selectedDate = useMemo(() => {
    if (params.date) {
      try {
        return parseISO(params.date);
      } catch (e) {
        console.warn('Invalid date passed to daily screen:', params.date);
        return new Date();
      }
    }
    return new Date();
  }, [params.date]);

  const start = startOfDay(selectedDate);
  const end = endOfDay(selectedDate);

  const title = useMemo(() => getDailyStatsTitle(selectedDate), [selectedDate]);

  const {
    data: summaries,
    isLoading,
    refetch,
    isRefetching,
  } = useSummaries(start, end);

  const {
    data: durationSessions,
    isLoading: durationsLoading,
    refetch: refetchDurations,
  } = useDurations(selectedDate);

  const dayData = useMemo(() => {
    if (!summaries?.data?.[0]) return null;
    return summaries.data[0];
  }, [summaries]);

  const { data: stats, refetch: refetchStats } = useStats('last_7_days');
  const dailyAverage = stats?.data?.daily_average || 0;

  const onRefresh = async () => {
    await Promise.all([refetch(), refetchDurations(), refetchStats()]);
  };

  const { goalDiffText, totalTimeLabel, isPositiveDiff } = useMemo(() => {
    const seconds = dayData?.grand_total?.total_seconds || 0;
    const label = dayData?.grand_total
      ? formatDisplayDuration(seconds)
      : '0 HRS 0 MINS';

    let diffText = '';
    let isPositive = true;

    if (dailyAverage > 0 && seconds > 0) {
      const diff = seconds - dailyAverage;
      isPositive = diff >= 0;
      const sign = isPositive ? '+' : '-';
      const absDiff = Math.abs(diff);
      const h = Math.floor(absDiff / 3600);
      const m = Math.floor((absDiff % 3600) / 60);

      if (h > 0) {
        diffText = `${sign}${h}h ${m}m from average`;
      } else {
        diffText = `${sign}${m}m from average`;
      }
    }

    return {
      totalTimeLabel: label,
      goalDiffText: diffText,
      isPositiveDiff: isPositive,
    };
  }, [dayData, dailyAverage]);

  const clockSessions = useMemo(() => {
    if (!durationSessions || !Array.isArray(durationSessions)) return [];
    return durationSessions;
  }, [durationSessions]);

  if ((isLoading || durationsLoading) && !dayData) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Stack.Screen options={{ title }} />
        <DailyStatsSkeleton />
      </View>
    );
  }

  const diffColor = isPositiveDiff
    ? isDark
      ? '#4ADE80'
      : '#22C55E'
    : isDark
      ? '#F87171'
      : '#EF4444';

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen options={{ title }} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
        {/* Total Time Card */}
        <DailyTotalCard
          totalTimeLabel={totalTimeLabel}
          goalDiffText={goalDiffText}
          isPositiveDiff={isPositiveDiff}
          diffColor={diffColor}
        />

        {/* Activity Rhythm */}
        <ActivityRhythm sessions={clockSessions} isLoading={durationsLoading} />

        {/* Segmented Stats */}
        <DailyDistributionStats data={dayData} />
      </ScrollView>
    </View>
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
    paddingBottom: 100,
  },
});
