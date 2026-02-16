import { User } from '@/interfaces/user';
import { wakaService } from '@/services/waka.service';
import { asyncStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  data: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      data: null,
      isLoading: false,
      error: null,
      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await wakaService.getUser();
          set({ data: user, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
