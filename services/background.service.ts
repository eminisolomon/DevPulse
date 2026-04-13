import { darkTheme } from '@/theme/dark';
import { lightTheme } from '@/theme/light';
import { formatDuration } from '@/utilities';
import { syncDailyStats } from '@/widgets';
import { format } from 'date-fns';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { Appearance } from 'react-native';
import { settingsService } from './settings.service';
import { wakaService } from './waka.service';

const WAKATIME_WIDGET_SYNC_TASK = 'WAKATIME_WIDGET_SYNC';

const resolveWidgetTheme = async () => {
  const settings = await settingsService.getSettings();
  const { themeMode, accentColor } = settings;

  let useDark: boolean;
  if (themeMode === 'system') {
    useDark = Appearance.getColorScheme() === 'dark';
  } else {
    useDark = themeMode === 'dark';
  }

  const themeColors = useDark ? darkTheme : lightTheme;
  return {
    background: themeColors.colors.background,
    surface: themeColors.colors.surface,
    surfaceSubtle: themeColors.colors.surfaceSubtle,
    border: themeColors.colors.border,
    text: themeColors.colors.text,
    textSecondary: themeColors.colors.textSecondary,
    primary: accentColor,
  };
};

TaskManager.defineTask(WAKATIME_WIDGET_SYNC_TASK, async () => {
  try {
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');

    const summaries = await wakaService.getSummaries(todayStr, todayStr);
    const todayData = summaries.data[0];

    if (!todayData) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const topProjectData = todayData.projects?.[0];
    const topLanguageData = todayData.languages?.[0];

    const summariesData = summaries as any;
    const widgetTheme = await resolveWidgetTheme();
    const statsForWidget = {
      todayTotalText: formatDuration(todayData.grand_total.total_seconds || 0),
      todayPercent: Math.round(
        (todayData.grand_total.total_seconds /
          (summariesData.cumulative_total?.average_seconds || 1)) *
          100,
      ),
      theme: widgetTheme,
      topLanguage: topLanguageData
        ? {
            name: topLanguageData.name,
            percent: topLanguageData.percent,
            color: widgetTheme.primary,
          }
        : undefined,
      topProject: topProjectData
        ? {
            name: topProjectData.name,
            text: formatDuration(topProjectData.total_seconds || 0),
            color: widgetTheme.primary,
          }
        : undefined,
    };

    await syncDailyStats(statsForWidget);

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('[BackgroundSync] Task failed:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export const registerBackgroundSync = async (minimumInterval: number = 15) => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      WAKATIME_WIDGET_SYNC_TASK,
    );
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(WAKATIME_WIDGET_SYNC_TASK, {
        minimumInterval,
      });
    }
  } catch (err) {
    console.error('[BackgroundSync] Registration failed:', err);
  }
};
