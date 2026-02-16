import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

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
  const { width } = useWindowDimensions();
  const containerPadding = 4;
  const segmentWidth = (width - 32 - containerPadding * 2) / 4; // 32 is screen padding

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const index = RANGES.findIndex((r) => r.value === value);
    Animated.spring(animatedValue, {
      toValue: index * segmentWidth,
      useNativeDriver: true,
      friction: 12,
      tension: 50,
    }).start();
  }, [value, segmentWidth]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceHighlight },
      ]}
    >
      <Animated.View
        style={[
          styles.activeSegment,
          {
            width: segmentWidth,
            transform: [{ translateX: animatedValue }],
            backgroundColor: theme.colors.surface,
          },
        ]}
      />
      <View style={styles.segmentsContainer}>
        {RANGES.map((range) => {
          const isSelected = value === range.value;
          return (
            <TouchableOpacity
              key={range.value}
              style={[styles.segment, { width: segmentWidth }]}
              onPress={() => onChange(range.value)}
              activeOpacity={0.7}
            >
              <Typography
                variant="caption"
                weight={isSelected ? 'bold' : 'medium'}
                color={
                  isSelected ? theme.colors.primary : theme.colors.textSecondary
                }
                align="center"
              >
                {range.label}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    borderRadius: 12,
    marginVertical: 12,
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
  segmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segment: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 1,
  },
  activeSegment: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
