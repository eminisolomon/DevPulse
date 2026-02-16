import { Typography } from '@/components/Typography';
import { DailyProgressCard } from '@/components/dashboard/DailyProgressCard';
import { MonthlyCalendarCard } from '@/components/dashboard/MonthlyCalendarCard';
import { TotalTimeCard } from '@/components/dashboard/TotalTimeCard';
import { useStats } from '@/hooks/useStats';
import { useSummaries } from '@/hooks/useSummaries';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
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
  const startMonth = useMemo(() => startOfMonth(today), [today]);
  const endMonth = useMemo(() => endOfMonth(today), [today]);

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

  // Helper to format time
  const formatTime = (
    text: string | undefined,
    seconds: number | undefined,
  ) => {
    if (text) return text;
    if (seconds === undefined) return '0 mins';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs} hrs ${mins} mins`;
    return `${mins} mins`;
  };

  // Derived Data
  const totalTimeDisplay =
    allTimeStats?.data.human_readable_total || '0 HRS 0 MINS';
  const totalProjects = allTimeStats?.data.projects?.length || 0;

  const recentProjects = (recentStats?.data.projects || [])
    .slice(0, 3)
    .map((p) => ({
      name: p.name,
      text: p.text || formatTime(undefined, p.total_seconds),
    }));

  const todayTotal = todaySummaries?.cumulative_total?.text || '0 mins';
  const todayPercent = 0; // TODO: Calculate based on goal if available
  const todayProjects = (todaySummaries?.data?.[0]?.projects || [])
    .slice(0, 3)
    .map((p) => ({
      name: p.name,
      text: p.text,
      color: theme.colors.primary,
    }));

  const monthTotal = monthSummaries?.cumulative_total?.text || '0 hrs 0 mins';
  const currentMonthName = format(today, 'MMMM');

  // Transform Month Summary Data for Calendar
  const calendarDays = (monthSummaries?.data || []).map((dayData) => ({
    date: dayData.range.date,
    totalTime: dayData.grand_total.text,
    hasActivity: dayData.grand_total.total_seconds > 0,
    activityLevel: 0,
  }));

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
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
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
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
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
          </View>
        </View>

        {/* SECTION 1: Total Time & Recent Projects */}
        <TotalTimeCard
          totalTime={totalTimeDisplay}
          totalProjectsCount={totalProjects}
          recentProjects={recentProjects}
        />

        {/* SECTION 2: Today's Progress */}
        <DailyProgressCard
          totalTime={todayTotal}
          projects={todayProjects}
          percent={todayPercent}
        />

        {/* SECTION 3: Monthly Calendar */}
        <MonthlyCalendarCard
          currentMonth={currentMonthName}
          totalTime={monthTotal}
          days={calendarDays}
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
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});
