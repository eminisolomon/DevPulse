import { Card } from '@/components/Card';
import LanguageChart from '@/components/LanguageChart';
import { Typography } from '@/components/Typography';
import { useProjectStats, useTheme } from '@/hooks';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { data, isLoading } = useProjectStats(id as string);

  if (isLoading) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const stats = data?.data;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Typography variant="micro" color={theme.colors.textSecondary}>
              TOTAL TIME (7D)
            </Typography>
            <Typography
              variant="title"
              weight="bold"
              color={theme.colors.primary}
            >
              {stats?.human_readable_total || '0h 0m'}
            </Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography variant="micro" color={theme.colors.textSecondary}>
              DAILY AVG
            </Typography>
            <Typography variant="title" weight="bold">
              {stats?.human_readable_daily_average || '0h 0m'}
            </Typography>
          </Card>
        </View>

        {/* Languages Chart */}
        <View style={styles.section}>
          <Typography variant="title" weight="bold" style={styles.sectionTitle}>
            Languages
          </Typography>
          <Card style={styles.chartCard}>
            {stats?.languages ? (
              <LanguageChart data={stats.languages} />
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

        {/* Categories / Editors if needed */}
        {stats?.editors && stats.editors.length > 0 && (
          <View style={styles.section}>
            <Typography
              variant="title"
              weight="bold"
              style={styles.sectionTitle}
            >
              Editors
            </Typography>
            <Card style={styles.listCard}>
              {stats.editors.map((editor) => (
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
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  chartCard: {
    padding: 16,
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
