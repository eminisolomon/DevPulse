import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { SessionTimeline } from '@/features/stats/SessionTimeline';
import { useDurations, useTheme } from '@/hooks';
import { format, subDays } from 'date-fns';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

const DAYS_TO_SHOW = 7;

export default function SessionHistoryScreen() {
  const { theme } = useTheme();
  const days = Array.from({ length: DAYS_TO_SHOW }, (_, i) =>
    subDays(new Date(), i),
  );

  const renderDayItem = ({ item: date }: { item: Date }) => {
    return <DaySessionRow date={date} />;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={days}
        renderItem={renderDayItem}
        keyExtractor={(item) => item.toISOString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const DaySessionRow = ({ date }: { date: Date }) => {
  const { data: sessions, isLoading } = useDurations(date);
  const { theme } = useTheme();

  return (
    <Card style={styles.dayCard}>
      <Typography variant="body" weight="bold" style={styles.dateLabel}>
        {format(date, 'EEEE, MMM d')}
      </Typography>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.primary}
          style={styles.loader}
        />
      ) : sessions && sessions.length > 0 ? (
        <SessionTimeline sessions={sessions} height={60} />
      ) : (
        <Typography
          variant="caption"
          color={theme.colors.textTertiary}
          style={styles.emptyText}
        >
          No activity recorded
        </Typography>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  dayCard: {
    marginBottom: 16,
    padding: 12,
  },
  dateLabel: {
    marginBottom: 8,
    marginLeft: 8,
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    marginVertical: 12,
    textAlign: 'center',
  },
});
