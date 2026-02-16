import { Card, Typography } from '@/components';
import {
  DailyProgressCard,
  MonthlyCalendarCard,
  TotalTimeCard,
} from '@/features/dashboard';
import { useStats } from '@/hooks/useStats';
import { useSummaries } from '@/hooks/useSummaries';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatDuration } from '@/utilities/formatters';
import { Ionicons } from '@expo/vector-icons';
import { endOfMonth, startOfMonth } from 'date-fns';
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

export default function Dashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const { apiKey } = useAuthStore();

  if (!apiKey) {
    return <Redirect href="/" />;
  }

  const { data: user, isLoading: userLoading } = useUser();

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

  const {
    data: allTimeStats,
    isLoading: allTimeLoading,
    refetch: refetchAllTime,
  } = useStats('all_time');

  const {
    data: recentStats,
    isLoading: recentLoading,
    refetch: refetchRecent,
  } = useStats('last_7_days');

  const {
    data: todaySummaries,
    isLoading: todayLoading,
    refetch: refetchToday,
  } = useSummaries(today, today);

  const {
    data: monthSummaries,
    isLoading: monthLoading,
    refetch: refetchMonth,
  } = useSummaries(startMonth, endMonth);

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
      activityLevel = 2; // Default if no average
    }

    return {
      date: dayData.range.date,
      totalTime: dayData.grand_total.text,
      hasActivity: totalSeconds > 0,
      activityLevel,
    };
  });

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
              Tap for detailed analytics & charts
            </Typography>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <Card
            style={[
              styles.statCard,
              {
                borderColor: theme.colors.border,
                borderWidth: 1,
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
          </Card>
          <Card
            style={[
              styles.statCard,
              {
                borderColor: theme.colors.border,
                borderWidth: 1,
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
          </Card>
        </View>
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
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  statLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});
