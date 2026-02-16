import { WakaTimeStats } from '@/interfaces/stats';
import { wakaService } from '@/services/waka.service';
import { asyncStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StatsCache {
  [range: string]: WakaTimeStats;
}

interface StatsState {
  data: StatsCache;
  isLoading: boolean;
  error: string | null;
  fetchStats: (range: string) => Promise<void>;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      data: {},
      isLoading: false,
      error: null,
      fetchStats: async (range) => {
        set({ isLoading: true, error: null });
        try {
          const stats = await wakaService.getStats(range);
          set((state) => ({
            data: { ...state.data, [range]: stats },
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: 'stats-storage',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
