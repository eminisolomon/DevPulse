import { useTheme } from '@/hooks/useTheme';
import {
  Canvas,
  Circle,
  Path,
  Skia,
  Text as SkiaText,
  matchFont,
} from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Card } from './Card';
import { Typography } from './Typography';

export interface ClockSession {
  start: number; // seconds from 00:00:00
  duration: number; // seconds
  color?: string;
}

interface RadialClockChartProps {
  sessions: ClockSession[];
  size?: number;
}

const HOURS = [0, 6, 12, 18];
const MARGIN = 40;

export const RadialClockChart = ({
  sessions = [],
  size = 280,
}: RadialClockChartProps) => {
  if (!sessions || !Array.isArray(sessions)) {
    return null;
  }
  const { theme, isDark } = useTheme();

  const center = size / 2;
  const outerRadius = size / 2 - MARGIN;
  const innerRadius = outerRadius - 40;
  const strokeWidth = outerRadius - innerRadius;
  const midRadius = (outerRadius + innerRadius) / 2;

  const fontFamily =
    Platform.select({ ios: 'Helvetica', android: 'sans-serif' }) ||
    'sans-serif';
  const font = useMemo(
    () => matchFont({ fontFamily, fontSize: 12 }),
    [fontFamily],
  );

  const arcs = useMemo(() => {
    return sessions.map((session) => {
      const startAngle =
        (session.start / (24 * 3600)) * 2 * Math.PI - Math.PI / 2;
      const endAngle =
        startAngle + (session.duration / (24 * 3600)) * 2 * Math.PI;

      const path = Skia.Path.Make();
      path.addArc(
        {
          x: center - midRadius,
          y: center - midRadius,
          width: midRadius * 2,
          height: midRadius * 2,
        },
        (startAngle * 180) / Math.PI,
        ((endAngle - startAngle) * 180) / Math.PI,
      );

      return {
        path,
        color: session.color || theme.colors.primary,
      };
    });
  }, [sessions, center, midRadius, theme.colors.primary]);

  return (
    <Card style={styles.card}>
      <Typography variant="title" style={styles.title}>
        Activity Rhythm
      </Typography>
      <View style={[styles.canvasContainer, { height: size }]}>
        <Canvas style={{ flex: 1 }}>
          {/* Background Circle */}
          <Circle
            cx={center}
            cy={center}
            r={midRadius}
            color={theme.colors.surfaceHighlight}
            style="stroke"
            strokeWidth={strokeWidth}
          />

          {/* Hour Markers */}
          {HOURS.map((hour) => {
            const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
            const x = center + (outerRadius + 15) * Math.cos(angle);
            const y = center + (outerRadius + 15) * Math.sin(angle);
            const label =
              hour === 0
                ? '12AM'
                : hour === 12
                  ? '12PM'
                  : `${hour % 12}${hour < 12 ? 'AM' : 'PM'}`;
            const textWidth = font?.getTextWidth(label) || 0;

            return (
              <SkiaText
                key={hour}
                x={x - textWidth / 2}
                y={y + 5}
                text={label}
                font={font}
                color={theme.colors.textSecondary}
              />
            );
          })}

          {/* Activity Arcs */}
          {arcs.map((arc, index) => (
            <Path
              key={index}
              path={arc.path}
              color={arc.color}
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="round"
            />
          ))}

          {/* Center Indicator */}
          <Circle
            cx={center}
            cy={center}
            r={innerRadius - 20}
            color={theme.colors.surfaceHighlight}
            style="fill"
          />
        </Canvas>
      </View>
      <View style={styles.legend}>
        <Typography
          variant="caption"
          align="center"
          color={theme.colors.textSecondary}
        >
          Showing 24-hour coding density
        </Typography>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    alignItems: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    fontWeight: '700',
  },
  canvasContainer: {
    width: '100%',
  },
  legend: {
    marginTop: 10,
  },
});
