import { WakaTimeSummaries } from '@/interfaces/summary';
import { wakaService } from '@/services/waka.service';
import { asyncStorage } from '@/utilities/storage';
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
}

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
            set((state) => ({
              data: { ...state.data, [key]: [] as any },
              isLoading: false,
            }));
            return;
          }

          const summaries = await wakaService.getSummaries(startStr, endStr);
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
