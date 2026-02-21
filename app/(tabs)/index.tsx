import { DashboardSkeleton } from '@/components/skeletons';
import {
  BestDayCard,
  DailyProgressCard,
  DashboardHeader,
  MonthlyCalendarCard,
  RankPulseCard,
  TotalTimeCard,
} from '@/features';
import { useAllTime, useStats, useSummaries, useTheme, useUser } from '@/hooks';
import { dashboardStyles as styles } from '@/theme/styles/dashboard';
import { formatDuration } from '@/utilities';
import { getProjectColor } from '@/utilities/projectColors';
import { endOfMonth, startOfMonth } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  const { theme } = useTheme();
  const { isLoading: userLoading } = useUser();

  const {
    data: allTimeData,
    isLoading: allTimeLoading,
    refetch: refetchAllTime,
  } = useAllTime();

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

  const { data: recentStats, refetch: refetchRecent } = useStats('last_7_days');

  const { data: todaySummaries, refetch: refetchToday } = useSummaries(
    today,
    today,
  );

  const {
    data: monthSummaries,
    refetch: refetchMonth,
    isLoading: monthLoading,
  } = useSummaries(startMonth, endMonth);

  const isLoading = userLoading || statsLoading || allTimeLoading;

  const handleRefresh = () => {
    refetchStats();
    refetchAllTime();
    refetchRecent();
    refetchToday();
    refetchMonth();
  };

  const dailyAverage = stats?.data?.daily_average || 0;

  const totalTimeDisplay = allTimeData?.data?.text || '0 HRS 0 MINS';
  const totalProjects = stats?.data?.projects?.length || 0;

  const recentProjects = (recentStats?.data?.projects || [])
    .slice(0, 3)
    .map((p) => ({
      name: p.name,
      text: p.text || formatDuration(p.total_seconds),
      color: getProjectColor(p.name),
    }));

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
    .slice(0, 5)
    .map((p: any) => ({
      name: p.name,
      text: p.text,
      color: getProjectColor(p.name),
      percent: p.percent || 0,
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

  const calendarDays = (monthSummaries?.data || []).map((dayData: any) => {
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

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <DashboardSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <DashboardHeader />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: 12,
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isStatsRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
        <RankPulseCard />

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
          avgDiff={todayGoalDiffText}
        />
        <BestDayCard
          date={stats?.data?.best_day?.date}
          totalTime={stats?.data?.best_day?.text}
          totalSeconds={stats?.data?.best_day?.total_seconds}
          dailyAverage={dailyAverage}
          topProject={stats?.data?.projects?.[0]}
        />
        <MonthlyCalendarCard
          monthDate={viewingMonth}
          totalTime={monthTotal}
          days={calendarDays}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          isLoading={monthLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
