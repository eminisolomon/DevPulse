import { WakaTimeLeaderboard } from '@/interfaces/leaderboard';
import { wakaService } from '@/services/waka.service';
import { asyncStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LeaderboardState {
  data: WakaTimeLeaderboard[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  error: string | null;
  selectedCountry: string | undefined;
  page: number;
  hasMore: boolean;
  setSelectedCountry: (country: string | undefined) => void;
  fetchLeaderboard: (reset?: boolean) => Promise<void>;
  fetchNextPage: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      data: [],
      isLoading: false,
      isFetchingNextPage: false,
      error: null,
      selectedCountry: undefined,
      page: 1,
      hasMore: true,
      setSelectedCountry: (country) => {
        set({ selectedCountry: country });
        get().fetchLeaderboard(true);
      },
      fetchLeaderboard: async (reset = false) => {
        const { selectedCountry } = get();
        set({
          isLoading: true,
          error: null,
          ...(reset ? { data: [], page: 1, hasMore: true } : {}),
        });

        try {
          const response = await wakaService.getLeaderboard(
            undefined,
            selectedCountry,
            1,
          );
          set({
            data: [response],
            isLoading: false,
            page: 1,
            hasMore: response.total_pages > 1,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      fetchNextPage: async () => {
        const {
          page,
          hasMore,
          selectedCountry,
          isFetchingNextPage,
          isLoading,
          data,
        } = get();
        if (!hasMore || isFetchingNextPage || isLoading) return;

        set({ isFetchingNextPage: true });
        try {
          const nextPage = page + 1;
          const response = await wakaService.getLeaderboard(
            undefined,
            selectedCountry,
            nextPage,
          );
          set({
            data: [...data, response],
            page: nextPage,
            hasMore: response.page < response.total_pages,
            isFetchingNextPage: false,
          });
        } catch (error: any) {
          set({ error: error.message, isFetchingNextPage: false });
        }
      },
    }),
    {
      name: 'leaderboard-storage',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
