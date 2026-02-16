import {
  ActivityRhythm,
  Card,
  SegmentedStatsCard,
  Typography,
} from '@/components';
import { DailyStatsSkeleton } from '@/components/skeletons';
import { useDurations, useStats, useSummaries, useTheme } from '@/hooks';
import { formatDisplayDuration, getDailyStatsTitle } from '@/utilities';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export default function DailyScreen() {
  const { theme } = useTheme();
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

  const { goalDiffText, totalTimeLabel } = useMemo(() => {
    const seconds = dayData?.grand_total?.total_seconds || 0;
    const label = dayData?.grand_total
      ? formatDisplayDuration(seconds)
      : '0 HRS 0 MINS';

    let diffText = '';
    if (dailyAverage > 0 && seconds > 0) {
      const diff = seconds - dailyAverage;
      const sign = diff >= 0 ? '+' : '-';
      const absDiff = Math.abs(diff);
      const h = Math.floor(absDiff / 3600);
      const m = Math.floor((absDiff % 3600) / 60);

      if (h > 0) {
        diffText = `${sign}${h}h ${m}m from average`;
      } else {
        diffText = `${sign}${m}m from average`;
      }
    }

    return { totalTimeLabel: label, goalDiffText: diffText };
  }, [dayData, dailyAverage]);

  const projects = useMemo(() => {
    if (!dayData?.projects) return [];
    return dayData.projects.slice(0, 5).map((p, idx) => ({
      name: p.name,
      time: p.text,
      color: p.color || theme.colors.primary,
      icon: 'circle',
    }));
  }, [dayData, theme.colors.primary]);

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
            colors={[theme.colors.primary]} // For Android
            progressBackgroundColor={theme.colors.surface} // For Android
          />
        }
      >
        {/* Total Time Card */}
        <Card style={styles.totalCard}>
          <Typography
            variant="display"
            weight="bold"
            align="center"
            style={styles.totalTime}
          >
            {totalTimeLabel}
          </Typography>
          <Typography
            variant="caption"
            color={theme.colors.textSecondary}
            align="center"
          >
            worked {goalDiffText && `• ${goalDiffText}`}
          </Typography>
        </Card>

        {/* Activity Rhythm */}
        <ActivityRhythm sessions={clockSessions} isLoading={durationsLoading} />

        {/* Projects List */}
        {projects.length > 0 && (
          <Card style={styles.projectsCard}>
            {projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <View style={styles.projectLeft}>
                  <View
                    style={[
                      styles.projectDot,
                      { backgroundColor: project.color },
                    ]}
                  />
                  <Typography variant="body" weight="medium">
                    {project.name}
                  </Typography>
                </View>
                <Typography variant="body" weight="bold">
                  {project.time}
                </Typography>
              </View>
            ))}
          </Card>
        )}

        {/* Segmented Stats */}
        {dayData?.languages && dayData.languages.length > 0 && (
          <SegmentedStatsCard
            title="LANGUAGES"
            segments={dayData.languages.slice(0, 4).map((l) => ({
              label: l.name,
              percent: l.percent,
              color: l.color || theme.colors.primary,
              valueText: l.text,
            }))}
          />
        )}

        {dayData?.categories && dayData.categories.length > 0 && (
          <SegmentedStatsCard
            title="CATEGORIES"
            segments={dayData.categories.slice(0, 3).map((c) => ({
              label: c.name,
              percent: c.percent,
              color: c.color || theme.colors.primary,
              valueText: c.text,
            }))}
          />
        )}

        {dayData?.editors && dayData.editors.length > 0 && (
          <SegmentedStatsCard
            title="EDITORS"
            segments={dayData.editors.slice(0, 2).map((e) => ({
              label: e.name,
              percent: e.percent,
              color: e.color || theme.colors.primary,
              valueText: e.text,
            }))}
          />
        )}

        {dayData?.operating_systems && dayData.operating_systems.length > 0 && (
          <SegmentedStatsCard
            title="OPERATING SYSTEMS"
            segments={dayData.operating_systems.slice(0, 1).map((os) => ({
              label: os.name,
              percent: os.percent,
              color: os.color || theme.colors.primary,
              valueText: os.text,
            }))}
          />
        )}

        {dayData?.machines && dayData.machines.length > 0 && (
          <SegmentedStatsCard
            title="WORKSTATIONS"
            segments={dayData.machines.slice(0, 2).map((m) => ({
              label: m.name,
              percent: m.percent,
              color: m.color || theme.colors.primary,
              valueText: m.text,
            }))}
          />
        )}
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
  totalCard: {
    paddingVertical: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  totalTime: {
    marginBottom: 4,
  },
  chartCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  projectsCard: {
    marginBottom: 16,
    gap: 12,
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  projectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
