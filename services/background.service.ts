import { formatDuration } from '@/utilities';
import { syncDailyStats } from '@/widgets';
import { format } from 'date-fns';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { wakaService } from './waka.service';

const WAKATIME_WIDGET_SYNC_TASK = 'WAKATIME_WIDGET_SYNC';

/**
 * Defines the background task for syncing WakaTime stats.
 */
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
    const statsForWidget = {
      todayTotalText: formatDuration(todayData.grand_total.total_seconds || 0),
      todayPercent: Math.round(
        (todayData.grand_total.total_seconds /
          (summariesData.cumulative_total?.average_seconds || 1)) *
          100,
      ),
      theme: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        surfaceSubtle: '#F1F5F9',
        border: '#E2E8F0',
        text: '#0F172A',
        textSecondary: '#64748B',
        primary: '#38BDF8',
      },
      topLanguage: topLanguageData
        ? {
            name: topLanguageData.name,
            percent: topLanguageData.percent,
            color: '#38BDF8',
          }
        : undefined,
      topProject: topProjectData
        ? {
            name: topProjectData.name,
            text: formatDuration(topProjectData.total_seconds || 0),
            color: '#38BDF8',
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

/**
 * Registers the background sync task.
 *
 * @param minimumInterval - The minimum interval in MINUTES between task executions (default: 15 mins).
 */
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
