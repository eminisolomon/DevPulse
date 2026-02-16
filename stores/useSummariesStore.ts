import { WakaTimeSummaries } from '@/interfaces/summary';
import { wakaService } from '@/services/waka.service';
import { asyncStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SummariesCache {
  [key: string]: WakaTimeSummaries;
}

interface SummariesState {
  data: SummariesCache;
  isLoading: boolean;
  error: string | null;
  fetchSummaries: (start: Date, end: Date) => Promise<void>;
}

export const useSummariesStore = create<SummariesState>()(
  persist(
    (set, get) => ({
      data: {},
      isLoading: false,
      error: null,
      fetchSummaries: async (start, end) => {
        const key = `${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}`;
        set({ isLoading: true, error: null });
        try {
          const summaries = await wakaService.getSummaries(
            start.toISOString().split('T')[0],
            end.toISOString().split('T')[0],
          );
          set((state) => ({
            data: { ...state.data, [key]: summaries },
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: 'summaries-storage',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
