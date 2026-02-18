import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const SIZE = 240;
const RADIUS = SIZE / 2 - 20;

interface ProjectTime {
  name: string;
  text: string;
  color?: string;
  percent?: number;
}

interface DailyProgressCardProps {
  totalTime: string;
  projects: ProjectTime[];
  percent: number;
  goalDiffText?: string;
  avgDiff?: string;
}

export const DailyProgressCard = ({
  totalTime,
  projects,
  percent = 0,
  goalDiffText,
  avgDiff,
}: DailyProgressCardProps) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const center = SIZE / 2;
  const strokeWidth = 20;
  const GAP_ANGLE = 0.05;

  const activeProjects = projects.filter((p) => (p.percent || 0) > 0);

  let currentAngle = -Math.PI / 2;

  const segments = activeProjects.map((project) => {
    const sweepAngle = ((project.percent || 0) / 100) * 2 * Math.PI;
    const drawAngle = Math.max(0, sweepAngle - GAP_ANGLE);

    const path = Skia.Path.Make();
    path.addArc(
      {
        x: center - RADIUS,
        y: center - RADIUS,
        width: RADIUS * 2,
        height: RADIUS * 2,
      },
      (currentAngle * 180) / Math.PI,
      (drawAngle * 180) / Math.PI,
    );

    currentAngle += sweepAngle;

    return {
      path,
      color: project.color,
    };
  });

  const emptyPath = Skia.Path.Make();
  emptyPath.addArc(
    {
      x: center - RADIUS,
      y: center - RADIUS,
      width: RADIUS * 2,
      height: RADIUS * 2,
    },
    0,
    360,
  );

  return (
    <Card
      style={[
        styles.card,
        {
          borderColor: theme.colors.border,
          borderWidth: 1,
          backgroundColor: theme.colors.surface,
        },
      ]}
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
          worked today {goalDiffText && `• ${goalDiffText}`}
        </Typography>
      </View>

      <View style={styles.chartContainer}>
        <Canvas style={{ width: SIZE, height: SIZE }}>
          <Circle
            cx={center}
            cy={center}
            r={RADIUS}
            color={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          {segments.length > 0 ? (
            segments.map((segment, index) => (
              <Path
                key={index}
                path={segment.path}
                color={segment.color}
                style="stroke"
                strokeWidth={strokeWidth}
                strokeCap="round"
              />
            ))
          ) : (
            <Path
              path={emptyPath}
              color={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="round"
            />
          )}
        </Canvas>
        <View style={styles.centerText}>
          <Typography variant="headline" weight="bold">
            {avgDiff || `${percent}%`}
          </Typography>
          <Typography variant="micro" color={theme.colors.textSecondary}>
            {avgDiff ? 'past week avg' : 'of average'}
          </Typography>
        </View>
      </View>

      <View
        style={[
          styles.projectsContainer,
          {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.02)',
          },
        ]}
      >
        {projects.map((project, index) => (
          <View key={index} style={styles.projectRow}>
            <View style={styles.projectInfo}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: project.color || theme.colors.primary },
                ]}
              />
              <Typography variant="body" weight="medium">
                {project.name}
              </Typography>
            </View>
            <Typography variant="body" weight="bold">
              {project.text}
            </Typography>
          </View>
        ))}

        <Button
          label="VIEW STATS FOR TODAY"
          onPress={() => router.push('/stats/daily')}
          variant="soft"
          fullWidth
          style={{ marginTop: 8 }}
          labelStyle={{
            fontSize: 10,
            letterSpacing: 0.5,
            color: isDark ? theme.colors.text : theme.colors.textInverse,
          }}
          size="sm"
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  projectsContainer: {
    borderRadius: 12,
    padding: 16,
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
