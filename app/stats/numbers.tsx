import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useStats } from '@/hooks/useStats';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NumbersScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: stats, isLoading } = useStats('all_time');

  if (isLoading) {
    return (
      <View
        style={[styles.loading, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const statItems = [
    {
      label: 'All Time Total',
      value: stats?.data?.human_readable_total || '0h 0m',
      icon: 'time-outline',
      color: theme.colors.primary,
    },
    {
      label: 'Daily Average',
      value: stats?.data?.human_readable_daily_average || '0h 0m',
      icon: 'stats-chart-outline',
      color: theme.colors.secondary,
    },
    {
      label: 'Languages Used',
      value: stats?.data?.languages?.length?.toString() || '0',
      icon: 'code-slash-outline',
      color: theme.colors.accent,
    },
    {
      label: 'Projects Tracked',
      value: stats?.data?.projects?.length?.toString() || '0',
      icon: 'folder-outline',
      color: '#4CAF50',
    },
    {
      label: 'Editors Used',
      value: stats?.data?.editors?.length?.toString() || '0',
      icon: 'create-outline',
      color: '#FF9800',
    },
    {
      label: 'Operating Systems',
      value: stats?.data?.operating_systems?.length?.toString() || '0',
      icon: 'desktop-outline',
      color: '#9C27B0',
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Typography variant="headline" weight="bold">
          The Numbers
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Typography
          variant="caption"
          color={theme.colors.textSecondary}
          style={styles.subtitle}
        >
          Cumulative analytics over all time
        </Typography>

        <View style={styles.grid}>
          {statItems.map((item, index) => (
            <Card key={index} style={styles.statCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              </View>
              <View style={styles.statInfo}>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                >
                  {item.label}
                </Typography>
                <Typography variant="title" weight="bold">
                  {item.value}
                </Typography>
              </View>
            </Card>
          ))}
        </View>

        {stats?.data?.best_day && (
          <Card style={styles.bestDayCard}>
            <View style={styles.bestDayHeader}>
              <Ionicons name="trophy-outline" size={24} color="#FFD700" />
              <Typography
                variant="title"
                weight="bold"
                style={styles.bestDayTitle}
              >
                Best Day
              </Typography>
            </View>
            <View style={styles.bestDayInfo}>
              <Typography
                variant="headline"
                color={theme.colors.primary}
                weight="bold"
              >
                {stats.data.best_day.text}
              </Typography>
              <Typography variant="body" color={theme.colors.textSecondary}>
                on {stats.data.best_day.date}
              </Typography>
            </View>
          </Card>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  scrollContent: {
    padding: 16,
  },
  subtitle: {
    marginBottom: 24,
  },
  grid: {
    gap: 12,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statInfo: {
    flex: 1,
  },
  bestDayCard: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#FFD70010',
    borderWidth: 1,
    borderColor: '#FFD70030',
  },
  bestDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bestDayTitle: {
    marginLeft: 12,
  },
  bestDayInfo: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});
