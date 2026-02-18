import { WakaTimeLeaderboard } from '@/interfaces/leaderboard';
import { wakaService } from '@/services/waka.service';
import { drizzleStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LeaderboardState {
  data: WakaTimeLeaderboard[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  error: string | null;
  selectedCountry: string | undefined;
  userRanks: {
    global?: number;
    country?: number;
    isLoading: boolean;
  };
  page: number;
  hasMore: boolean;
  setSelectedCountry: (country: string | undefined) => void;
  fetchLeaderboard: (reset?: boolean, orgId?: string) => Promise<void>;
  fetchNextPage: (orgId?: string) => Promise<void>;
  fetchUserRanks: (countryCode?: string) => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      data: [],
      isLoading: false,
      isFetchingNextPage: false,
      error: null,
      selectedCountry: undefined,
      userRanks: {
        isLoading: false,
      },
      page: 1,
      hasMore: true,
      setSelectedCountry: (country) => {
        set({ selectedCountry: country });
        get().fetchLeaderboard(true);
      },
      fetchLeaderboard: async (reset = false, orgId?: string) => {
        const { selectedCountry } = get();
        set({
          isLoading: true,
          error: null,
          ...(reset ? { data: [], page: 1, hasMore: true } : {}),
        });

        try {
          if (orgId) {
            set({
              data: [],
              isLoading: false,
              page: 1,
              hasMore: false,
            });
            return;
          }

          const countryCode =
            selectedCountry === 'GLOBAL' ? undefined : selectedCountry;
          const response = await wakaService.getLeaderboard(
            undefined,
            countryCode,
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
      fetchNextPage: async (orgId?: string) => {
        const {
          page,
          hasMore,
          selectedCountry,
          isFetchingNextPage,
          isLoading,
          data,
        } = get();
        if (!hasMore || isFetchingNextPage || isLoading) return;
        if (orgId) return;

        set({ isFetchingNextPage: true });
        try {
          const nextPage = page + 1;
          const countryCode =
            selectedCountry === 'GLOBAL' ? undefined : selectedCountry;
          const response = await wakaService.getLeaderboard(
            undefined,
            countryCode,
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
      fetchUserRanks: async (countryCode) => {
        set((state) => ({
          userRanks: { ...state.userRanks, isLoading: true },
        }));

        try {
          const globalResponse = await wakaService.getLeaderboard(
            undefined,
            undefined,
            1,
          );
          const globalRank = globalResponse.current_user?.rank;

          let countryRank;
          if (countryCode) {
            const countryResponse = await wakaService.getLeaderboard(
              undefined,
              countryCode,
              1,
            );
            countryRank = countryResponse.current_user?.rank;
          }

          set({
            userRanks: {
              global: globalRank,
              country: countryRank,
              isLoading: false,
            },
          });
        } catch (error) {
          set((state) => ({
            userRanks: { ...state.userRanks, isLoading: false },
          }));
        }
      },
    }),
    {
      name: 'leaderboard-storage',
      storage: createJSONStorage(() => drizzleStorage),
    },
  ),
);
