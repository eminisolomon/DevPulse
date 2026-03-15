'use no memo';

import React from 'react';
import { Platform } from 'react-native';
import { updateAndroidWidget } from 'voltra/android/client';
import { startLiveActivity } from 'voltra/client';
import { DailyStatsWidgetAndroid } from './DailyStatsWidgetAndroid';
import { DailyStatsWidgetIOS, type StatsData } from './DailyStatsWidgetIOS';

export { DailyStatsWidgetAndroid, DailyStatsWidgetIOS };
export type { StatsData };

/**
 * Helper to update the Android widget and iOS Live Activity with real stats.
 *
 * @param stats - The stats data to sync.
 */
export const syncDailyStats = async (stats: StatsData) => {
  try {
    if (Platform.OS === 'android') {
      await updateAndroidWidget('devpulse_widget', [
        {
          size: { width: 170, height: 170 },
          content: <DailyStatsWidgetAndroid stats={stats} />,
        },
        {
          size: { width: 330, height: 170 },
          content: <DailyStatsWidgetAndroid stats={stats} />,
        },
        {
          size: { width: 330, height: 330 },
          content: <DailyStatsWidgetAndroid stats={stats} />,
        },
      ]);
    } else {
      await startLiveActivity({
        lockScreen: <DailyStatsWidgetIOS stats={stats} />,
      });
    }
  } catch (error) {
    console.warn('Failed to sync daily stats to widgets:', error);
  }
};
