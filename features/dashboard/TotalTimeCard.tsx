import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ProjectTime {
  name: string;
  text: string;
}

interface TotalTimeCardProps {
  totalTime: string; // e.g., "4,846 HRS 10 MINS"
  totalProjectsCount: number;
  recentProjects: ProjectTime[];
}

export const TotalTimeCard = ({
  totalTime,
  totalProjectsCount,
  recentProjects,
}: TotalTimeCardProps) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();

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
          worked in total over {totalProjectsCount} projects
        </Typography>
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
        <Typography
          variant="micro"
          weight="bold"
          color={theme.colors.textSecondary}
          style={styles.projectsTitle}
        >
          LAST PROJECTS WORKED ON
        </Typography>

        {recentProjects.map((project, index) => (
          <View key={index} style={styles.projectRow}>
            <View style={styles.projectInfo}>
              <View
                style={[styles.dot, { backgroundColor: theme.colors.primary }]}
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
          onPress={() => router.push('/projects' as any)}
        >
          <Typography
            variant="caption"
            weight="bold"
            color={theme.colors.textSecondary}
            style={{ textTransform: 'uppercase' }}
          >
            VIEW ALL PROJECTS
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
  projectsContainer: {
    borderRadius: 12, // Slightly smaller radius for inner container
    padding: 16,
  },
  projectsTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
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
