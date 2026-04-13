import { useEffect } from 'react';
import { syncDailyStats, StatsData } from '@/widgets';

export const useWidgetSync = (stats: StatsData | undefined) => {
  useEffect(() => {
    if (stats) {
      syncDailyStats(stats);
    }
  }, [stats]);
};
