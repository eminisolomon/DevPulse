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
import { formatDisplayDuration, formatDuration } from '@/utilities';
import { Ionicons } from '@expo/vector-icons';
import { subDays } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { shareCardRef, handleShare } = useShareScreenshot();
  const router = useRouter();

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

  const formattedTotal7d = formatDuration(totalSeconds7d);
  const formattedAverage7d = formatDuration(dailyAverage7d);
  const heroFormattedTotal7d = formatDisplayDuration(totalSeconds7d);

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

  const projectAllTime = getProjectSpecificData(statsAllTime?.data, projectId);

  const displayedAllTimeSeconds = Math.max(
    projectAllTime?.totalSeconds || 0,
    totalSeconds7d,
  );
  const formattedAllTime = formatDisplayDuration(displayedAllTimeSeconds);

  // Aggregated project-specific languages and editors from summaries
  const aggregatedStats = useMemo(() => {
    if (!summariesData?.data) return { languages: [], editors: [] };

    const langMap = new Map<string, { name: string; total_seconds: number }>();
    const editMap = new Map<string, { name: string; total_seconds: number }>();

    summariesData.data.forEach((day) => {
      day.languages?.forEach((lang) => {
        const current = langMap.get(lang.name) || {
          name: lang.name,
          total_seconds: 0,
        };
        current.total_seconds += lang.total_seconds;
        langMap.set(lang.name, current);
      });

      day.editors?.forEach((editor) => {
        const current = editMap.get(editor.name) || {
          name: editor.name,
          total_seconds: 0,
        };
        current.total_seconds += editor.total_seconds;
        editMap.set(editor.name, current);
      });
    });

    const languages = Array.from(langMap.values())
      .map((l) => {
        const h = Math.floor(l.total_seconds / 3600);
        const m = Math.floor((l.total_seconds % 3600) / 60);
        return {
          name: l.name,
          total_seconds: l.total_seconds,
          percent:
            totalSeconds7d > 0 ? (l.total_seconds / totalSeconds7d) * 100 : 0,
          text: formatDuration(l.total_seconds),
          digital: `${h}:${m.toString().padStart(2, '0')}`,
          hours: h,
          minutes: m,
        };
      })
      .sort((a, b) => b.total_seconds - a.total_seconds);

    const editors = Array.from(editMap.values())
      .map((e) => {
        const h = Math.floor(e.total_seconds / 3600);
        const m = Math.floor((e.total_seconds % 3600) / 60);
        return {
          name: e.name,
          total_seconds: e.total_seconds,
          percent:
            totalSeconds7d > 0 ? (e.total_seconds / totalSeconds7d) * 100 : 0,
          text: formatDuration(e.total_seconds),
          digital: `${h}:${m.toString().padStart(2, '0')}`,
          hours: h,
          minutes: m,
        };
      })
      .sort((a, b) => b.total_seconds - a.total_seconds);

    return { languages, editors };
  }, [summariesData, totalSeconds7d]);

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
    return aggregatedStats.languages.slice(0, 5).map((l) => ({
      name: l.name,
      percent: l.percent,
    }));
  }, [aggregatedStats.languages]);

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
          <View style={styles.heroContent}>
            <Typography
              variant="micro"
              weight="bold"
              align="center"
              style={[
                {
                  color: theme.colors.primary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 2,
                },
              ]}
            >
              PROJECT TOTAL TIME
            </Typography>
            <Typography
              variant="display"
              weight="bold"
              align="center"
              style={{ fontSize: 32, lineHeight: 40, marginVertical: 4 }}
            >
              {formattedAllTime}
            </Typography>

            <View
              style={[
                styles.heroBadge,
                {
                  backgroundColor: theme.colors.successContainer,
                },
              ]}
            >
              <Ionicons
                name="trending-up"
                size={12}
                color={theme.colors.success}
                style={{ marginRight: 4 }}
              />
              <Typography
                variant="caption"
                weight="bold"
                align="center"
                style={{ color: theme.colors.success }}
              >
                7-DAY TOTAL: {heroFormattedTotal7d}
              </Typography>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Card style={styles.chartCard}>
            {aggregatedStats.languages.length > 0 ? (
              <LanguageChart
                data={aggregatedStats.languages}
                showLegend={true}
                footerLabel="VIEW ALL TIME STATS"
                onFooterPress={() => router.push('/stats/numbers')}
                title="Languages"
                centerTitle={formattedAverage7d}
                centerSubtitle="WEEKLY AVG"
              />
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

        {aggregatedStats.editors.length > 0 && (
          <SegmentedStatsCard
            title="Editors"
            segments={aggregatedStats.editors.slice(0, 5).map((e: any) => ({
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
