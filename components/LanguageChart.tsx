import { useTheme } from '@/hooks/useTheme';
import { WakaTimeLanguage } from '@/interfaces/stats';
import { getLanguageColor } from '@/utilities';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from './Typography';

interface LanguageChartProps {
  data: WakaTimeLanguage[];
}

export default function LanguageChart({ data }: LanguageChartProps) {
  const { theme } = useTheme();

  const chartData = useMemo(() => {
    return data.slice(0, 5).map((lang) => ({
      languageName: lang.name,
      value: lang.total_seconds,
      color: getLanguageColor(lang.name),
    }));
  }, [data]);

  const totalSeconds = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.value, 0),
    [chartData],
  );

  const arcs = useMemo(() => {
    if (totalSeconds === 0) return [];

    let currentAngle = -Math.PI / 2;
    const center = 80;
    const radius = 70;
    const innerRadius = 45;
    const midRadius = (radius + innerRadius) / 2;
    const strokeWidth = radius - innerRadius;

    return chartData.map((d) => {
      const sweepAngle = (d.value / totalSeconds) * 2 * Math.PI;
      const path = Skia.Path.Make();

      path.addArc(
        {
          x: center - midRadius,
          y: center - midRadius,
          width: midRadius * 2,
          height: midRadius * 2,
        },
        (currentAngle * 180) / Math.PI,
        (sweepAngle * 180) / Math.PI,
      );

      currentAngle += sweepAngle;
      return { path, color: d.color };
    });
  }, [chartData, totalSeconds]);

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
      <View style={styles.chartContainer}>
        <Canvas style={styles.canvas}>
          {arcs.map((arc, index) => (
            <Path
              key={index}
              path={arc.path}
              color={arc.color}
              style="stroke"
              strokeWidth={25}
            />
          ))}
        </Canvas>
      </View>

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
    paddingVertical: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
});
