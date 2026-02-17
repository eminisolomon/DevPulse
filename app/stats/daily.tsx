import {
  ActivityRhythm,
  Card,
  SegmentedStatsCard,
  Typography,
} from '@/components';
import { DailyStatsSkeleton } from '@/components/skeletons';
import {
  getCategoryColor,
  getEditorColor,
  getLanguageColor,
  getOSColor,
  getWorkstationColor,
} from '@/constants';
import { useDurations, useStats, useSummaries, useTheme } from '@/hooks';
import { formatDisplayDuration, getDailyStatsTitle } from '@/utilities';
import { getProjectColor } from '@/utilities/projectColors';
import { Ionicons } from '@expo/vector-icons';
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

  const projects = useMemo(() => {
    if (!dayData?.projects) return [];
    return dayData.projects.slice(0, 5).map((p) => ({
      name: p.name,
      time: p.text,
      color: getProjectColor(p.name),
      icon: 'circle',
    }));
  }, [dayData]);

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
            colors={[theme.colors.primary]} // For Android
            progressBackgroundColor={theme.colors.surface} // For Android
          />
        }
      >
        {/* Total Time Card */}
        <Card
          style={[
            styles.card,
            {
              borderColor: theme.colors.border,
              borderWidth: 1,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          {/* Content Section */}
          <View style={styles.textContainer}>
            <Typography
              variant="micro"
              weight="bold"
              align="center"
              style={[styles.label, { color: theme.colors.primary }]}
            >
              TOTAL WORKED
            </Typography>
            <Typography
              variant="display"
              weight="bold"
              align="center"
              style={{ fontSize: 32, lineHeight: 40, marginVertical: 4 }}
            >
              {totalTimeLabel}
            </Typography>

            {goalDiffText ? (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isDark
                      ? isPositiveDiff
                        ? 'rgba(34, 197, 94, 0.15)'
                        : 'rgba(248, 113, 113, 0.15)'
                      : isPositiveDiff
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                    marginTop: 4,
                    alignSelf: 'center',
                  },
                ]}
              >
                <Ionicons
                  name={isPositiveDiff ? 'trending-up' : 'trending-down'}
                  size={12}
                  color={diffColor}
                  style={{ marginRight: 4 }}
                />
                <Typography
                  variant="caption"
                  weight="bold"
                  style={{ color: diffColor }}
                >
                  {goalDiffText}
                </Typography>
              </View>
            ) : (
              <Typography
                variant="caption"
                color={theme.colors.textSecondary}
                align="center"
                style={{ marginTop: 2 }}
              >
                No data vs average
              </Typography>
            )}
          </View>
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
              color: getLanguageColor(l.name),
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
              color: getCategoryColor(c.name),
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
              color: getEditorColor(e.name),
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
              color: getOSColor(os.name),
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
              color: getWorkstationColor(m.name),
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
  card: {
    marginBottom: 16,
    padding: 16,
    overflow: 'hidden',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
