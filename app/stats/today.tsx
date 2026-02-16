import { RadialClockChart, SegmentedStatsCard } from '@/components';
import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useDurations } from '@/hooks/useDurations';
import { useSummaries } from '@/hooks/useSummaries';
import { useTheme } from '@/hooks/useTheme';
import {
  endOfDay,
  format,
  isToday,
  isYesterday,
  parseISO,
  startOfDay,
} from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TodayScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ date?: string }>();

  const selectedDate = useMemo(() => {
    if (params.date) {
      try {
        return parseISO(params.date);
      } catch (e) {
        console.warn('Invalid date passed to today screen:', params.date);
        return new Date();
      }
    }
    return new Date();
  }, [params.date]);

  const start = startOfDay(selectedDate);
  const end = endOfDay(selectedDate);

  const title = useMemo(() => {
    if (isToday(selectedDate)) return 'TODAY';
    if (isYesterday(selectedDate)) return 'YESTERDAY';
    return format(selectedDate, 'EEEE, dd MMM').toUpperCase();
  }, [selectedDate]);

  const {
    data: summaries,
    isLoading,
    refetch,
    isRefetching,
  } = useSummaries(start, end);

  const { data: durationSessions, isLoading: durationsLoading } =
    useDurations(selectedDate);

  const todayData = useMemo(() => {
    if (!summaries?.data?.[0]) return null;
    return summaries.data[0];
  }, [summaries]);

  const totalTime = useMemo(() => {
    if (!todayData?.grand_total) return '0 HRS 0 MINS';
    const total = todayData.grand_total.total_seconds || 0;
    const hours = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    return `${hours} HRS ${mins} MINS`;
  }, [todayData]);

  const projects = useMemo(() => {
    if (!todayData?.projects) return [];
    return todayData.projects.slice(0, 5).map((p, idx) => ({
      name: p.name,
      time: p.text,
      color: p.color || theme.colors.primary,
      icon: idx === 0 ? 'ellipse' : 'ellipse',
    }));
  }, [todayData, theme.colors.primary]);

  const clockSessions = useMemo(() => {
    if (!durationSessions || !Array.isArray(durationSessions)) return [];
    return durationSessions;
  }, [durationSessions]);

  if ((isLoading || durationsLoading) && !todayData) {
    return (
      <View
        style={[styles.loading, { backgroundColor: theme.colors.background }]}
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
      <Stack.Screen options={{ title }} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
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
            {totalTime}
          </Typography>
          <Typography
            variant="caption"
            color={theme.colors.textSecondary}
            align="center"
          >
            worked
          </Typography>
        </Card>

        {/* Radial Clock Chart */}
        {clockSessions.length > 0 && (
          <Card style={styles.chartCard}>
            <RadialClockChart sessions={clockSessions} size={280} />
          </Card>
        )}

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

        {/* Languages */}
        {todayData?.languages && todayData.languages.length > 0 && (
          <SegmentedStatsCard
            title="LANGUAGES"
            segments={todayData.languages.slice(0, 4).map((l) => ({
              label: l.name,
              percent: l.percent,
              color: l.color || theme.colors.primary,
              valueText: l.text,
            }))}
          />
        )}

        {/* Categories */}
        {todayData?.categories && todayData.categories.length > 0 && (
          <SegmentedStatsCard
            title="CATEGORIES"
            segments={todayData.categories.slice(0, 3).map((c) => ({
              label: c.name,
              percent: c.percent,
              color: c.color || theme.colors.primary,
              valueText: c.text,
            }))}
          />
        )}

        {/* Editors */}
        {todayData?.editors && todayData.editors.length > 0 && (
          <SegmentedStatsCard
            title="EDITORS"
            segments={todayData.editors.slice(0, 2).map((e) => ({
              label: e.name,
              percent: e.percent,
              color: e.color || theme.colors.primary,
              valueText: e.text,
            }))}
          />
        )}

        {/* Operating Systems */}
        {todayData?.operating_systems &&
          todayData.operating_systems.length > 0 && (
            <SegmentedStatsCard
              title="OPERATING SYSTEMS"
              segments={todayData.operating_systems.slice(0, 1).map((os) => ({
                label: os.name,
                percent: os.percent,
                color: os.color || theme.colors.primary,
                valueText: os.text,
              }))}
            />
          )}

        {/* Workstations */}
        {todayData?.machines && todayData.machines.length > 0 && (
          <SegmentedStatsCard
            title="WORKSTATIONS"
            segments={todayData.machines.slice(0, 2).map((m) => ({
              label: m.name,
              percent: m.percent,
              color: m.color || theme.colors.primary,
              valueText: m.text,
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
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
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
