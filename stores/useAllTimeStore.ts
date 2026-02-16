import { WakaTimeAllTime } from '@/interfaces/stats';
import { wakaService } from '@/services/waka.service';
import { asyncStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AllTimeState {
  data: WakaTimeAllTime | null;
  isLoading: boolean;
  error: string | null;
  fetchAllTime: (force?: boolean) => Promise<void>;
}

export const useAllTimeStore = create<AllTimeState>()(
  persist(
    (set, get) => ({
      data: null,
      isLoading: false,
      error: null,
      fetchAllTime: async (force = false) => {
        if (!force && get().data) return;

        set({ isLoading: true, error: null });
        try {
          const allTime = await wakaService.getAllTimeSinceToday();
          set({ data: allTime, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: 'all-time-storage',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
