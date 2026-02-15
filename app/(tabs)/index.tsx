import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { subDays } from 'date-fns';
import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityChart from '@/components/ActivityChart';
import LanguageChart from '@/components/LanguageChart';
import { PunchCard } from '@/components/PunchCard';
import { usePunchCardData } from '@/hooks/usePunchCardData';
import { useStats } from '@/hooks/useStats';
import { useSummaries } from '@/hooks/useSummaries';
import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Dashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const { apiKey } = useAuthStore();

  if (!apiKey) {
    return <Redirect href="/" />;
  }

  const { data: user, isLoading: userLoading } = useUser();

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    isRefetching: isStatsRefetching,
  } = useStats();

  const today = new Date();
  const start = subDays(today, 6);

  const {
    data: summaries,
    isLoading: summariesLoading,
    refetch: refetchSummaries,
    isRefetching: isSummariesRefetching,
  } = useSummaries(start, today);

  const { data: punchData, isLoading: punchLoading } = usePunchCardData(7);

  const isLoading = userLoading || statsLoading || summariesLoading;
  const isRefetching = isStatsRefetching || isSummariesRefetching;

  const handleRefresh = () => {
    refetchStats();
    refetchSummaries();
  };

  if (isLoading && !stats && !summaries) {
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
            refreshing={isRefetching}
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
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              style={[
                styles.settingsButton,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

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

        <View style={styles.chartSection}>
          <Typography variant="title" weight="bold" style={styles.chartTitle}>
            Top Languages
          </Typography>
          <View
            style={[
              styles.chartCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            {stats?.data?.languages ? (
              <LanguageChart data={stats.data.languages} />
            ) : (
              <Typography
                color={theme.colors.textSecondary}
                style={styles.noDataText}
              >
                No language data available
              </Typography>
            )}
          </View>
        </View>

        {!punchLoading && punchData && <PunchCard data={punchData} />}

        <View style={styles.chartSection}>
          <Typography variant="title" weight="bold" style={styles.chartTitle}>
            Daily Activity
          </Typography>
          <View
            style={[
              styles.chartCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                padding: 16,
              },
            ]}
          >
            {summaries?.data ? (
              <ActivityChart data={summaries.data} />
            ) : (
              <Typography
                color={theme.colors.textSecondary}
                style={styles.noDataText}
              >
                Loading activity data...
              </Typography>
            )}
          </View>
        </View>
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
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
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
  chartSection: {
    marginBottom: 32,
  },
  chartTitle: {
    marginBottom: 16,
  },
  chartCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 40,
  },
});
