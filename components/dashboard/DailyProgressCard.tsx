import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import {
  Canvas,
  Circle,
  Path,
  Skia,
  matchFont,
} from '@shopify/react-native-skia';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

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
  percent: number; // 0-100
  goalDiffText?: string;
}

export const DailyProgressCard = ({
  totalTime,
  projects,
  percent = 0,
  goalDiffText,
}: DailyProgressCardProps) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const strokeWidth = 20;
  const center = SIZE / 2;

  const fontFamily =
    Platform.select({ ios: 'Helvetica', android: 'sans-serif' }) ||
    'sans-serif';
  const font = useMemo(
    () => matchFont({ fontFamily, fontSize: 32, fontWeight: 'bold' }),
    [fontFamily],
  );

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (percent / 100) * 2 * Math.PI;

  const path = Skia.Path.Make();
  path.addArc(
    {
      x: center - RADIUS,
      y: center - RADIUS,
      width: RADIUS * 2,
      height: RADIUS * 2,
    },
    (startAngle * 180) / Math.PI,
    ((endAngle - startAngle) * 180) / Math.PI,
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
          {/* Background Circle */}
          <Circle
            cx={center}
            cy={center}
            r={RADIUS}
            color={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          {/* Progress Arc */}
          <Path
            path={path}
            color={theme.colors.primary}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
          />
        </Canvas>
        <View style={styles.centerText}>
          <Typography variant="headline" weight="bold">
            {percent}%
          </Typography>
          <Typography variant="micro" color={theme.colors.textSecondary}>
            of average
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

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.background }]}
          onPress={() => router.push('/stats/daily')}
        >
          <Typography
            variant="caption"
            weight="bold"
            color={theme.colors.textSecondary}
            style={{ textTransform: 'uppercase' }}
          >
            VIEW STATS FOR TODAY
          </Typography>
        </TouchableOpacity>
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
  button: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
