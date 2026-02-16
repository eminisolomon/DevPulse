import { Card } from '@/components/Card';
import LanguageChart from '@/components/LanguageChart';
import { Typography } from '@/components/Typography';
import { useProjectStats, useTheme } from '@/hooks';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();

  const { data: stats7d, isLoading: loading7d } = useProjectStats(
    id as string,
    'last_7_days',
  );

  const { data: statsAllTime, isLoading: loadingAllTime } = useProjectStats(
    id as string,
    'all_time',
  );

  const isLoading = loading7d || loadingAllTime;

  if (isLoading) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getProjectSpecificData = (statsData: any, projectName: string) => {
    if (!statsData) return null;

    const projectEntry = statsData.projects?.find(
      (p: any) => p.name.toLowerCase() === projectName.toLowerCase(),
    );

    return {
      total: projectEntry?.text || statsData.human_readable_total || '0h 0m',
      dailyAvg:
        projectEntry?.daily_average_text ||
        statsData.human_readable_daily_average ||
        '0h 0m',
      languages: statsData.languages || [],
      editors: statsData.editors || [],
    };
  };

  const project7d = getProjectSpecificData(stats7d?.data, id as string);
  const projectAllTime = getProjectSpecificData(
    statsAllTime?.data,
    id as string,
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen options={{ title: id as string }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.allTimeCard}>
          <Typography variant="micro" color={theme.colors.textSecondary}>
            ALL TIME TOTAL
          </Typography>
          <Typography
            variant="headline"
            weight="bold"
            color={theme.colors.primary}
          >
            {projectAllTime?.total || '0 hrs 0 mins'}
          </Typography>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Typography variant="micro" color={theme.colors.textSecondary}>
              TOTAL (7D)
            </Typography>
            <Typography
              variant="title"
              weight="bold"
              color={theme.colors.primary}
            >
              {project7d?.total || '0h 0m'}
            </Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography variant="micro" color={theme.colors.textSecondary}>
              DAILY AVG
            </Typography>
            <Typography variant="title" weight="bold">
              {project7d?.dailyAvg || '0h 0m'}
            </Typography>
          </Card>
        </View>

        <View style={styles.section}>
          <Typography variant="title" weight="bold" style={styles.sectionTitle}>
            Languages
          </Typography>
          <Card style={styles.chartCard}>
            {project7d?.languages && project7d.languages.length > 0 ? (
              <LanguageChart data={project7d.languages} />
            ) : (
              <Typography
                color={theme.colors.textSecondary}
                style={styles.noData}
              >
                No language data for this project
              </Typography>
            )}
          </Card>
        </View>

        {project7d?.editors && project7d.editors.length > 0 && (
          <View style={styles.section}>
            <Typography
              variant="title"
              weight="bold"
              style={styles.sectionTitle}
            >
              Editors
            </Typography>
            <Card style={styles.listCard}>
              {project7d.editors.map((editor: any) => (
                <View key={editor.name} style={styles.listItem}>
                  <Typography weight="medium">{editor.name}</Typography>
                  <Typography color={theme.colors.textSecondary}>
                    {editor.text}
                  </Typography>
                </View>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  allTimeCard: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  chartCard: {
    padding: 16,
    minHeight: 280,
    justifyContent: 'center',
  },
  listCard: {
    padding: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  noData: {
    textAlign: 'center',
    paddingVertical: 40,
  },
});
