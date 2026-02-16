import {
  DailyProgressCard,
  DashboardBanner,
  DashboardHeader,
  MonthlyCalendarCard,
  QuickStats,
  TotalTimeCard,
} from '@/features/dashboard';
import { useStats } from '@/hooks/useStats';
import { useSummaries } from '@/hooks/useSummaries';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatDuration } from '@/utilities/formatters';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Redirect } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  const { theme } = useTheme();
  const { apiKey } = useAuthStore();

  const { isLoading: userLoading } = useUser();

  const today = useMemo(() => new Date(), []);
  const [viewingMonth, setViewingMonth] = useState(today);

  const startMonth = useMemo(() => startOfMonth(viewingMonth), [viewingMonth]);
  const endMonth = useMemo(() => endOfMonth(viewingMonth), [viewingMonth]);

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    isRefetching: isStatsRefetching,
  } = useStats('last_7_days');

  const { data: allTimeStats, refetch: refetchAllTime } = useStats('all_time');

  const { data: recentStats, refetch: refetchRecent } = useStats('last_7_days');

  const { data: todaySummaries, refetch: refetchToday } = useSummaries(
    today,
    today,
  );

  const { data: monthSummaries, refetch: refetchMonth } = useSummaries(
    startMonth,
    endMonth,
  );

  const isLoading = userLoading || statsLoading;

  const handleRefresh = () => {
    refetchStats();
    refetchAllTime();
    refetchRecent();
    refetchToday();
    refetchMonth();
  };

  const dailyAverage = stats?.data?.daily_average || 0;

  // Derived Data
  const totalTimeDisplay =
    allTimeStats?.data.human_readable_total || '0 HRS 0 MINS';
  const totalProjects = allTimeStats?.data.projects?.length || 0;

  const recentProjects = (recentStats?.data.projects || [])
    .slice(0, 3)
    .map((p) => ({
      name: p.name,
      text: p.text || formatDuration(p.total_seconds),
    }));

  // Calculate Today's Progress
  const { todayTotal, todayPercent, todayGoalDiffText } = useMemo(() => {
    const seconds = todaySummaries?.cumulative_total?.seconds || 0;
    const text = todaySummaries?.cumulative_total?.text || '0 mins';
    const percent =
      dailyAverage > 0
        ? Math.min(100, Math.round((seconds / dailyAverage) * 100))
        : 0;

    let goalDiffText = '';
    if (dailyAverage > 0) {
      const diff = seconds - dailyAverage;
      const sign = diff >= 0 ? '+' : '-';
      const absDiff = Math.abs(diff);
      const h = Math.floor(absDiff / 3600);
      const m = Math.floor((absDiff % 3600) / 60);

      if (h > 0) {
        goalDiffText = `${sign}${h}h ${m}m`;
      } else {
        goalDiffText = `${sign}${m}m`;
      }
    }

    return {
      todayTotal: text,
      todayPercent: percent,
      todayGoalDiffText: goalDiffText,
    };
  }, [todaySummaries, dailyAverage]);

  const todayProjects = (todaySummaries?.data?.[0]?.projects || [])
    .slice(0, 3)
    .map((p) => ({
      name: p.name,
      text: p.text,
      color: theme.colors.primary,
    }));

  const monthTotal = monthSummaries?.cumulative_total?.text || '0 hrs 0 mins';

  const handlePrevMonth = () => {
    setViewingMonth((prev: Date) =>
      startOfMonth(new Date(prev.getFullYear(), prev.getMonth() - 1, 1)),
    );
  };

  const handleNextMonth = () => {
    setViewingMonth((prev: Date) =>
      startOfMonth(new Date(prev.getFullYear(), prev.getMonth() + 1, 1)),
    );
  };

  // Transform Month Summary Data for Calendar with Heatmap
  const calendarDays = (monthSummaries?.data || []).map((dayData) => {
    const totalSeconds = dayData.grand_total.total_seconds;
    let activityLevel = 0;

    if (totalSeconds > 0 && dailyAverage > 0) {
      const ratio = totalSeconds / dailyAverage;
      if (ratio > 1) activityLevel = 4;
      else if (ratio > 0.75) activityLevel = 3;
      else if (ratio > 0.25) activityLevel = 2;
      else activityLevel = 1;
    } else if (totalSeconds > 0) {
      activityLevel = 2;
    }

    return {
      date: dayData.range.date,
      totalTime: dayData.grand_total.text,
      hasActivity: totalSeconds > 0,
      activityLevel,
    };
  });

  if (!apiKey) {
    return <Redirect href="/" />;
  }

  if (isLoading && !stats) {
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
            refreshing={isStatsRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <DashboardHeader />

        <DashboardBanner />

        <QuickStats
          totalDuration={stats?.data?.human_readable_total || '0h 0m'}
          dailyAverage={stats?.data?.human_readable_daily_average || '0h 0m'}
        />

        <TotalTimeCard
          totalTime={totalTimeDisplay}
          totalProjectsCount={totalProjects}
          recentProjects={recentProjects}
        />
        <DailyProgressCard
          totalTime={todayTotal}
          projects={todayProjects}
          percent={todayPercent}
          goalDiffText={todayGoalDiffText}
        />
        <MonthlyCalendarCard
          monthDate={viewingMonth}
          totalTime={monthTotal}
          days={calendarDays}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
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
});
