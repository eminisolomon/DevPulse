import { Card, SegmentedStatsCard, Typography } from '@/components';
import LanguageChart from '@/components/LanguageChart';
import { ProjectDetailsHeader } from '@/components/nav/ProjectDetailsHeader';
import { ProjectShareCard } from '@/components/share';
import { ProjectDetailsSkeleton } from '@/components/skeletons';
import { getEditorColor } from '@/constants';
import {
  useProjectStats,
  useProjectSummaries,
  useShareScreenshot,
  useTheme,
} from '@/hooks';
import { projectDetailStyles as styles } from '@/theme';
import { formatDisplayDuration } from '@/utilities';
import { subDays } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { shareCardRef, handleShare } = useShareScreenshot();

  const projectId = id as string;
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6);

  const {
    data: summariesData,
    isLoading: loadingSummaries,
    refetch: refetchSummaries,
  } = useProjectSummaries(projectId, sevenDaysAgo, today);

  const {
    data: stats7d,
    isLoading: loading7d,
    refetch: refetch7d,
  } = useProjectStats(projectId, 'last_7_days');

  const {
    data: statsAllTime,
    isLoading: loadingAllTime,
    refetch: refetchAllTime,
  } = useProjectStats(projectId, 'all_time');

  const isLoading = loadingSummaries || loading7d || loadingAllTime;

  // Calculate total duration from summaries
  const totalSeconds7d = useMemo(() => {
    if (!summariesData?.data) return 0;
    return summariesData.data.reduce(
      (acc, day) => acc + day.grand_total.total_seconds,
      0,
    );
  }, [summariesData]);

  const dailyAverage7d = useMemo(() => {
    if (!summariesData?.data || summariesData.data.length === 0) return 0;
    return totalSeconds7d / summariesData.data.length;
  }, [totalSeconds7d, summariesData]);

  const formattedTotal7d = formatDisplayDuration(totalSeconds7d);
  const formattedAverage7d = formatDisplayDuration(dailyAverage7d);

  const getProjectSpecificData = (statsData: any, projectName: string) => {
    if (!statsData) return null;

    const projectEntry = statsData.projects?.find(
      (p: any) => p.name.toLowerCase() === projectName.toLowerCase(),
    );

    return {
      total: projectEntry?.text || statsData.human_readable_total || '0h 0m',
      totalSeconds: projectEntry?.total_seconds || statsData.total_seconds || 0,
      dailyAvg:
        projectEntry?.daily_average_text ||
        statsData.human_readable_daily_average ||
        '0h 0m',
      languages: statsData.languages || [],
      editors: statsData.editors || [],
    };
  };

  const project7d = getProjectSpecificData(stats7d?.data, projectId);
  const projectAllTime = getProjectSpecificData(statsAllTime?.data, projectId);

  const displayedAllTimeSeconds = Math.max(
    projectAllTime?.totalSeconds || 0,
    totalSeconds7d,
  );
  const formattedAllTime = formatDisplayDuration(displayedAllTimeSeconds);

  if (isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ProjectDetailsHeader title={projectId} onShare={handleShare} />
        <ProjectDetailsSkeleton />
      </View>
    );
  }

  const shareLanguages = useMemo(() => {
    return (
      project7d?.languages?.slice(0, 5).map((l: any) => ({
        name: l.name,
        percent: l.percent,
      })) || []
    );
  }, [project7d]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ProjectDetailsHeader title={projectId} onShare={handleShare} />

      {/* Hidden share card for capture */}
      <ProjectShareCard
        ref={shareCardRef}
        projectName={projectId}
        allTimeTotal={formattedAllTime}
        total7d={formattedTotal7d}
        dailyAvg={formattedAverage7d}
        topLanguages={shareLanguages}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              refetchSummaries();
              refetch7d();
              refetchAllTime();
            }}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
        <Card style={styles.allTimeCard}>
          <Typography variant="micro" color={theme.colors.textSecondary}>
            ALL TIME TOTAL
          </Typography>
          <Typography
            variant="headline"
            weight="bold"
            color={theme.colors.primary}
          >
            {formattedAllTime}
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
              {formattedTotal7d}
            </Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography variant="micro" color={theme.colors.textSecondary}>
              DAILY AVG
            </Typography>
            <Typography variant="title" weight="bold">
              {formattedAverage7d}
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
          <SegmentedStatsCard
            title="Editors"
            segments={project7d.editors.slice(0, 5).map((e: any) => ({
              label: e.name,
              percent: e.percent,
              color: getEditorColor(e.name),
              valueText: e.text,
            }))}
          />
        )}
      </ScrollView>
    </View>
  );
}
