import { useEffect } from 'react';
import { syncDailyStats, StatsData } from '@/widgets';

/**
 * Hook to synchronize dashboard stats with Voltra widgets.
 *
 * @param stats - The stats data to sync.
 */
export const useWidgetSync = (stats: StatsData | undefined) => {
  useEffect(() => {
    if (stats) {
      syncDailyStats(stats);
    }
  }, [stats]);
};
