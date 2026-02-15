import { useTheme } from '@/hooks/useTheme';
import { WakaTimeSummary } from '@/interfaces/summary';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';

interface ActivityChartProps {
  data: WakaTimeSummary[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const { theme } = useTheme();
  // Map data for Victory
  // x: day index or timestamp, y: hours
  const chartData = data.map((day) => ({
    x: format(parseISO(day.range.date), 'EEE'), // Mon, Tue...
    y: day.grand_total.total_seconds / 3600, // Convert to hours
    tooltip: day.grand_total.text,
  }));

  // Simple hardcoded max Y for scaling if needed, or let Victory handle it
  // But we want nice rounded numbers on Y axis usually.

  // Font for axis labels
  // Note: Loading fonts in component might be slow - ideally load in root.
  // For now we rely on system font or just basic rendering.
  // CartesianChart usually requires a font object for axes.
  // Let's assume a basic setup without custom font loading inside component for now if unnecessary,
  // or use `useFont` with a require if we have a font file.
  // For simplicity, I'll omit axis labels temporarily if font loading is complex,
  // or try to use a default system font approach if victory-native supports it out of the box.
  // Recent victory-native versions usually need a font object for axis.

  // I'll skip axis labels for this iteration to avoid font loading complexity unless I add it to hooks.

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={['y']}
        padding={16}
        domainPadding={{ left: 20, right: 20, top: 20 }}
        axisOptions={{
          lineColor: theme.colors.border,
          labelColor: theme.colors.textSecondary,
        }}
      >
        {({ points, chartBounds }) => (
          <Bar
            points={points.y}
            chartBounds={chartBounds}
            color={theme.colors.primary}
            roundedCorners={{ topLeft: 4, topRight: 4 }}
            animate={{ type: 'spring' }}
          />
        )}
      </CartesianChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 192,
    width: '100%',
    borderRadius: 16,
    padding: 16,
  },
});
