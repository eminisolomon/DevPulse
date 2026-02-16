import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface QuickStatsProps {
  totalDuration: string;
  dailyAverage: string;
  label?: string;
}

export const QuickStats = ({
  totalDuration,
  dailyAverage,
  label = '7 Day Total',
}: QuickStatsProps) => {
  const { theme } = useTheme();

  return (
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
          {label}
        </Typography>
        <Typography variant="title" color={theme.colors.primary} weight="bold">
          {totalDuration}
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
          {dailyAverage}
        </Typography>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
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
