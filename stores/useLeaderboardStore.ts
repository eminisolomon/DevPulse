import { asyncStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LeaderboardState {
  selectedCountry: string | undefined;
  setSelectedCountry: (country: string | undefined) => void;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set) => ({
      selectedCountry: undefined,
      setSelectedCountry: (country) => {
        set({ selectedCountry: country });
      },
    }),
    {
      name: 'leaderboard-storage',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
