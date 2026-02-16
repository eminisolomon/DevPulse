import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { GoalsSkeleton } from '@/components/skeletons/GoalsSkeleton';
import { Typography } from '@/components/Typography';
import { useGoals, useTheme } from '@/hooks';
import { WakaTimeGoal } from '@/interfaces/goal';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function GoalsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useGoals();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return theme.colors.success;
      case 'fail':
        return theme.colors.error;
      default:
        return theme.colors.secondary;
    }
  };

  const renderGoalItem = ({ item }: { item: WakaTimeGoal }) => {
    const latestData = item.chart_data?.[item.chart_data.length - 1];
    const progress = latestData
      ? Math.min(latestData.actual_seconds / latestData.goal_seconds, 1)
      : 0;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/goals/${item.id}`)}
        activeOpacity={0.7}
      >
        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.titleContainer}>
              <Typography variant="title" weight="bold">
                {item.title}
              </Typography>
              <Typography variant="micro" color={theme.colors.textSecondary}>
                {item.range_text}
              </Typography>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) + '20' },
              ]}
            >
              <Typography
                variant="micro"
                weight="bold"
                style={{ color: getStatusColor(item.status) }}
              >
                {item.status.toUpperCase()}
              </Typography>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Typography variant="caption" weight="semibold">
                {item.delta}
              </Typography>
              <Typography variant="micro" color={theme.colors.textSecondary}>
                {Math.round(progress * 100)}%
              </Typography>
            </View>
            <View
              style={[
                styles.progressBarBg,
                { backgroundColor: theme.colors.border },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: getStatusColor(item.status),
                    width: `${progress * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Typography variant="micro" color={theme.colors.textSecondary}>
              Average: {item.average_status.toUpperCase()}
            </Typography>
            {item.languages.length > 0 && (
              <Typography variant="micro" color={theme.colors.textSecondary}>
                {item.languages.slice(0, 2).join(', ')}
              </Typography>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading && !data) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ScreenHeader
          title="Goals"
          subtitle="Track your coding milestones"
          actions={[
            {
              icon: 'plus',
              onPress: () => router.push('/goals/create'),
            },
          ]}
        />
        <GoalsSkeleton />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScreenHeader
        title="Goals"
        subtitle="Track your coding milestones"
        actions={[
          {
            icon: 'plus',
            onPress: () => router.push('/goals/create'),
          },
        ]}
      />

      <FlatList
        data={data?.data}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]} // For Android
            progressBackgroundColor={theme.colors.surface} // For Android
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="target" size={48} color={theme.colors.border} />
            <Typography
              variant="title"
              weight="semibold"
              style={styles.emptyTitle}
            >
              No Goals Set
            </Typography>
            <Typography
              color={theme.colors.textSecondary}
              style={styles.emptySubtitle}
            >
              Create goals on the WakaTime dashboard to track them here.
            </Typography>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  goalCard: {
    marginBottom: 16,
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});
