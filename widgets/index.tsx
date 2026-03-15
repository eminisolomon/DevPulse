import React from 'react';
import { updateAndroidWidget } from 'voltra/android/client';
import { startLiveActivity } from 'voltra/client';
import { DailyStatsWidget, StatsData } from './DailyStatsWidget';

export { DailyStatsWidget, StatsData };

/**
 * Helper to update the Android widget and iOS Live Activity with real stats.
 *
 * @param stats - The stats data to sync.
 */
export const syncDailyStats = async (stats: StatsData) => {
  try {
    await updateAndroidWidget('devpulse_widget', [
      {
        size: { width: 150, height: 150 },
        content: <DailyStatsWidget stats={stats} />,
      },
    ]);

    await startLiveActivity({
      lockScreen: <DailyStatsWidget stats={stats} />,
    });
  } catch (error) {
    console.warn('Failed to sync daily stats to widgets:', error);
  }
};
