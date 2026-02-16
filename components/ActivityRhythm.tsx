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
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { Card } from './Card';
import { Typography } from './Typography';

export interface ClockSession {
  start: number; // seconds from 00:00:00
  duration: number; // seconds
  color?: string;
}

interface ActivityRhythmProps {
  sessions?: ClockSession[];
  isLoading?: boolean;
  size?: number;
  title?: string;
  subtitle?: string;
}

const HOURS = [0, 6, 12, 18];
const MARGIN = 40;

export const ActivityRhythm = ({
  sessions = [],
  isLoading = false,
  size = 280,
  title = 'Activity Rhythm',
  subtitle = 'Showing 24-hour coding density',
}: ActivityRhythmProps) => {
  const { theme } = useTheme();

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
    if (isLoading || !sessions.length) return [];
    return sessions.map((session) => {
      // Normalize start and duration to 24-hour circle
      const startAngle =
        (session.start / (24 * 3600)) * 2 * Math.PI - Math.PI / 2;
      const sweepAngle = (session.duration / (24 * 3600)) * 2 * Math.PI;

      const path = Skia.Path.Make();
      path.addArc(
        {
          x: center - midRadius,
          y: center - midRadius,
          width: midRadius * 2,
          height: midRadius * 2,
        },
        (startAngle * 180) / Math.PI,
        (sweepAngle * 180) / Math.PI,
      );

      return {
        path,
        color: session.color || theme.colors.primary,
      };
    });
  }, [sessions, center, midRadius, theme.colors.primary, isLoading]);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Typography variant="title" weight="bold">
          {title}
        </Typography>
        {isLoading && (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        )}
      </View>

      <View style={[styles.canvasContainer, { height: size }]}>
        <Canvas style={{ width: size, height: size }}>
          {/* Background Track */}
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
          {!isLoading &&
            arcs.map((arc, index) => (
              <Path
                key={index}
                path={arc.path}
                color={arc.color}
                style="stroke"
                strokeWidth={strokeWidth}
                strokeCap="round"
              />
            ))}

          {/* Empty State Indicator */}
          {!isLoading && sessions.length === 0 && (
            <SkiaText
              x={center - 35}
              y={center + 5}
              text="No Activity"
              font={font}
              color={theme.colors.textSecondary}
              opacity={0.5}
            />
          )}

          {/* Center Indicator */}
          <Circle
            cx={center}
            cy={center}
            r={innerRadius - 20}
            color={theme.colors.surfaceHighlight}
            style="fill"
            opacity={0.3}
          />
        </Canvas>
      </View>

      <View style={styles.legend}>
        <Typography
          variant="caption"
          align="center"
          color={theme.colors.textSecondary}
        >
          {subtitle}
        </Typography>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  canvasContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    marginTop: 10,
  },
});
