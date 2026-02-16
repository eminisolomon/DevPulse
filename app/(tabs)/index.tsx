import { Typography } from '@/components/Typography';
import { useStats } from '@/hooks/useStats';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import React from 'react';
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

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    isRefetching: isStatsRefetching,
  } = useStats('last_7_days');

  const isLoading = userLoading || statsLoading;

  const handleRefresh = () => {
    refetchStats();
  };

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
