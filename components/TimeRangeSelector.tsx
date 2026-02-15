import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip } from './Chip';

export type TimeRange = '7_days' | '30_days' | 'year' | 'all_time';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const RANGES: { label: string; value: TimeRange }[] = [
  { label: 'Week', value: '7_days' },
  { label: 'Month', value: '30_days' },
  { label: 'Year', value: 'year' },
  { label: 'All', value: 'all_time' },
];

export const TimeRangeSelector = ({
  value,
  onChange,
}: TimeRangeSelectorProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: theme.spacing[4] },
        ]}
      >
        {RANGES.map((range) => (
          <Chip
            key={range.value}
            label={range.label}
            selected={value === range.value}
            onPress={() => onChange(range.value)}
            style={styles.chip}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    gap: 8,
  },
  chip: {
    minWidth: 80,
  },
});
