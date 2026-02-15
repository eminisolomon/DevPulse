import { useTheme } from '@/hooks/useTheme';
import { WakaTimeLanguage } from '@/interfaces/stats';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import { Typography } from './Typography';

interface LanguageChartProps {
  data: WakaTimeLanguage[];
}

const COLORS = [
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#6b7280',
];

export default function LanguageChart({ data }: LanguageChartProps) {
  const { theme } = useTheme();

  // prepare data for Victory
  const chartData = data.slice(0, 5).map((lang, index) => ({
    languageName: lang.name,
    value: lang.total_seconds,
    color: COLORS[index % COLORS.length],
  }));

  const totalSeconds = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (totalSeconds === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Typography color={theme.colors.textSecondary}>
          No data available
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.center]}>
      <PolarChart
        data={chartData}
        colorKey="color"
        valueKey="value"
        labelKey="languageName"
      >
        <Pie.Chart>
          {({ slice }) => {
            const { label, ...restSlice } = slice;
            return (
              // @ts-ignore
              <Pie.Slice {...restSlice} />
            );
          }}
        </Pie.Chart>
      </PolarChart>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {chartData.map((d) => (
          <View key={d.languageName} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: d.color }]} />
            <Typography
              variant="micro"
              color={theme.colors.textSecondary}
              weight="medium"
            >
              {d.languageName}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 256,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});
