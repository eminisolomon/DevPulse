import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface PunchCardProps {
  data: {
    day: number;
    hour: number;
    seconds: number;
  }[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const PunchCard = ({ data }: PunchCardProps) => {
  const { theme } = useTheme();

  const maxSeconds = Math.max(...data.map((d) => d.seconds), 1);

  const getBubbleSize = (seconds: number) => {
    if (seconds === 0) return 0;
    const minSize = 4;
    const maxSize = 16;
    return minSize + (seconds / maxSeconds) * (maxSize - minSize);
  };

  return (
    <View style={styles.container}>
      <Typography variant="caption" weight="bold" style={styles.title}>
        Activity Insights
      </Typography>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.grid}>
          {/* Header with hours */}
          <View style={styles.row}>
            <View style={styles.dayLabel} />
            {[0, 4, 8, 12, 16, 20].map((h) => (
              <View key={h} style={styles.hourLabel}>
                <Typography variant="micro" color={theme.colors.textSecondary}>
                  {h}h
                </Typography>
              </View>
            ))}
          </View>

          {DAYS.map((day, dayIdx) => (
            <View key={day} style={styles.row}>
              <View style={styles.dayLabel}>
                <Typography
                  variant="micro"
                  weight="bold"
                  color={theme.colors.textSecondary}
                >
                  {day}
                </Typography>
              </View>
              <View style={styles.bubblesRow}>
                {Array.from({ length: 24 }).map((_, hour) => {
                  const entry = data.find(
                    (d) => d.day === dayIdx && d.hour === hour,
                  );
                  const seconds = entry ? entry.seconds : 0;
                  const size = getBubbleSize(seconds);

                  return (
                    <View key={hour} style={styles.bubbleContainer}>
                      <View
                        style={[
                          styles.bubble,
                          {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            backgroundColor:
                              seconds > 0
                                ? theme.colors.primary
                                : 'transparent',
                          },
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    marginBottom: 16,
    marginLeft: 4,
  },
  grid: {
    paddingRight: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayLabel: {
    width: 35,
    marginRight: 8,
  },
  hourLabel: {
    width: 60,
    alignItems: 'center',
  },
  bubblesRow: {
    flexDirection: 'row',
  },
  bubbleContainer: {
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    opacity: 0.8,
  },
});
