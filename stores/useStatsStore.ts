import { StatsRange } from '@/constants/wakatime';
import { WakaTimeStats } from '@/interfaces/stats';
import { wakaService } from '@/services/waka.service';
import { asyncStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StatsCache {
  [key: string]: WakaTimeStats;
}

interface StatsState {
  data: StatsCache;
  isLoading: boolean;
  error: string | null;
  fetchStats: (range: StatsRange, orgId?: string) => Promise<void>;
  clearCache: () => void;
}

const MAX_CACHE_SIZE = 10;

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      data: {},
      isLoading: false,
      error: null,
      fetchStats: async (range, orgId) => {
        const cacheKey = orgId ? `${range}_${orgId}` : range;
        set({ isLoading: true, error: null });
        try {
          const stats = orgId
            ? await wakaService.getOrgStats(orgId, range)
            : await wakaService.getStats(range);

          set((state) => {
            const newData = { ...state.data, [cacheKey]: stats };
            const keys = Object.keys(newData);
            if (keys.length > MAX_CACHE_SIZE) {
              const oldestKey = keys[0];
              delete newData[oldestKey];
            }
            return { data: newData, isLoading: false };
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      clearCache: () => set({ data: {} }),
    }),
    {
      name: 'stats-storage',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
