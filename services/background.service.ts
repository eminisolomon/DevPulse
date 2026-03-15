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

    const statsForWidget = {
      todayTotalText: todayData.grand_total.text,
      todayPercent: Math.round(
        (todayData.grand_total.total_seconds /
          (summaries.cumulative_total as any).average_seconds || 1) * 100,
      ),
      topLanguage: todayData.languages?.[0]
        ? {
            name: todayData.languages[0].name,
            percent: todayData.languages[0].percent,
          }
        : undefined,
      topProject: todayData.projects?.[0]
        ? {
            name: todayData.projects[0].name,
            text: todayData.projects[0].text,
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
