import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  startOfMonth,
} from 'date-fns';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface DailySummary {
  date: string;
  totalTime: string;
  hasActivity: boolean;
  activityLevel: number;
}

interface MonthlyCalendarCardProps {
  currentMonth: string;
  totalTime: string;
  days: DailySummary[];
}

export const MonthlyCalendarCard = ({
  currentMonth,
  totalTime,
  days,
}: MonthlyCalendarCardProps) => {
  const { theme } = useTheme();
  const router = useRouter();

  // Generate calendar days
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const calendarDays = eachDayOfInterval({ start, end });
  const startDay = getDay(start);

  // Determine weeks
  const weeks = [];
  let week = Array(7).fill(null);

  // Fill initial empty days
  for (let i = 0; i < startDay; i++) {
    week[i] = null;
  }

  calendarDays.forEach((day, index) => {
    const dayOfWeek = getDay(day);
    if (dayOfWeek === 0 && week.some((d) => d !== null)) {
      weeks.push([...week]);
      week = Array(7).fill(null);
    }

    // Find matching summary data
    const summary = days.find((d) => isSameDay(new Date(d.date), day));

    week[dayOfWeek] = {
      day: format(day, 'd'),
      date: day,
      summary,
    };
  });
  weeks.push(week);

  const renderDay = (dayData: any | null, index: number) => {
    if (!dayData) return <View key={index} style={styles.dayCell} />;

    const { summary, day } = dayData;
    const hasActivity = summary?.hasActivity;
    const activityColor = hasActivity ? theme.colors.primary : 'transparent';
    const textColor = hasActivity ? '#000' : theme.colors.text;

    return (
      <TouchableOpacity
        key={index}
        style={styles.dayCell}
        onPress={() => {
          const dateStr = format(dayData.date, 'yyyy-MM-dd');
          router.push(`/stats/daily?date=${dateStr}`);
        }}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.dayCircle,
            hasActivity && { backgroundColor: theme.colors.surfaceHighlight },
          ]}
        >
          {hasActivity && (
            <View
              style={[
                styles.activityBackground,
                { backgroundColor: theme.colors.surfaceHighlight },
              ]}
            />
          )}
          <Typography
            variant="body"
            weight="medium"
            color={theme.colors.text}
            align="center"
          >
            {day}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.card, { backgroundColor: theme.colors.surfaceHighlight }]}
    >
      <View style={styles.header}>
        <Typography variant="title" weight="bold" align="center">
          {totalTime}
        </Typography>
        <Typography
          variant="caption"
          color={theme.colors.textSecondary}
          align="center"
          style={{ marginTop: 4 }}
        >
          worked in {currentMonth}
        </Typography>
      </View>

      <View
        style={[
          styles.calendarContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.daysHeader}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <Typography
              key={day}
              variant="caption"
              weight="bold"
              color={theme.colors.textSecondary}
              style={{ width: '14.28%', textAlign: 'center' }}
            >
              {day}
            </Typography>
          ))}
        </View>

        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => renderDay(day, dayIndex))}
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.colors.surfaceHighlight },
          ]}
          onPress={() => router.push('/stats/numbers?range=30_days' as any)}
        >
          <Typography
            variant="caption"
            weight="bold"
            color={theme.colors.textSecondary}
            style={{ textTransform: 'uppercase' }}
          >
            VIEW DETAILS OF THIS MONTH
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  calendarContainer: {
    borderRadius: 16,
    padding: 16,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    opacity: 0.5,
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
