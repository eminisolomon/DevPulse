import { Typography } from '@/components/Typography';
import { DailyProgressCard } from '@/components/dashboard/DailyProgressCard';
import { MonthlyCalendarCard } from '@/components/dashboard/MonthlyCalendarCard';
import { TotalTimeCard } from '@/components/dashboard/TotalTimeCard';
import { useStats } from '@/hooks/useStats';
import { useSummaries } from '@/hooks/useSummaries';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/useAuthStore';
import { Feather } from '@expo/vector-icons';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  const { theme } = useTheme();
  const { data: user } = useUser();
  const { logout } = useAuthStore();

  const today = useMemo(() => new Date(), []);
  const startMonth = useMemo(() => startOfMonth(today), [today]);
  const endMonth = useMemo(() => endOfMonth(today), [today]);

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

  const isLoading =
    allTimeLoading || recentLoading || todayLoading || monthLoading;

  const onRefresh = () => {
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <View>
          <Typography
            variant="caption"
            color={theme.colors.textSecondary}
            style={{ textTransform: 'uppercase', letterSpacing: 1 }}
          >
            WELCOME BACK
          </Typography>
          <Typography variant="headline" weight="bold">
            {user?.data?.display_name || user?.data?.username || 'User'}
          </Typography>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={logout} style={styles.iconButton}>
            <Feather
              name="log-out"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          <Link href="/user/settings" asChild>
            <TouchableOpacity>
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: theme.colors.surfaceHighlight },
                ]}
              >
                <Typography variant="caption" weight="bold">
                  {user?.data?.display_name?.[0] ||
                    user?.data?.username?.[0] ||
                    'U'}
                </Typography>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
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

        {/* Navigation to Detailed Stats */}
        <Link href="/stats/numbers" asChild>
          <TouchableOpacity
            style={[
              styles.numbersBanner,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <View>
              <Typography variant="body" weight="bold" color="#000">
                The Numbers
              </Typography>
              <Typography variant="caption" color="rgba(0,0,0,0.7)">
                Deep dive into your analytics
              </Typography>
            </View>
            <Feather name="arrow-right" size={20} color="#000" />
          </TouchableOpacity>
        </Link>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  numbersBanner: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});
