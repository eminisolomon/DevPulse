import { WakaTimeSummaries } from '@/interfaces/summary';
import { wakaService } from '@/services/waka.service';
import { drizzleStorage } from '@/utilities/storage';
import { format } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SummariesCache {
  [key: string]: WakaTimeSummaries;
}

interface SummariesState {
  data: SummariesCache;
  isLoading: boolean;
  error: string | null;
  fetchSummaries: (start: Date, end: Date, orgId?: string) => Promise<void>;
  clearCache: () => void;
}

const MAX_CACHE_SIZE = 10;

export const useSummariesStore = create<SummariesState>()(
  persist(
    (set, get) => ({
      data: {},
      isLoading: false,
      error: null,
      fetchSummaries: async (start, end, orgId) => {
        const startStr = format(start, 'yyyy-MM-dd');
        const endStr = format(end, 'yyyy-MM-dd');
        const key = orgId
          ? `${startStr}_${endStr}_${orgId}`
          : `${startStr}_${endStr}`;

        set({ isLoading: true, error: null });
        try {
          if (orgId) {
            set((state) => {
              const newData = { ...state.data, [key]: [] as any };
              const keys = Object.keys(newData);
              if (keys.length > MAX_CACHE_SIZE) {
                const oldestKey = keys[0];
                delete newData[oldestKey];
              }
              return { data: newData, isLoading: false };
            });
            return;
          }

          const summaries = await wakaService.getSummaries(startStr, endStr);
          set((state) => {
            const newData = { ...state.data, [key]: summaries };
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
      name: 'summaries-storage',
      storage: createJSONStorage(() => drizzleStorage),
    },
  ),
);
