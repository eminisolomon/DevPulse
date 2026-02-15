import { secureStorage } from '@/utils/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  apiKey: string | null;
  apiUrl: string;
  setApiKey: (apiKey: string) => void;
  setApiUrl: (apiUrl: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      apiKey: null,
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://wakatime.com/api/v1',
      setApiKey: (apiKey) => set({ apiKey }),
      setApiUrl: (apiUrl) => set({ apiUrl }),
      reset: () =>
        set({
          apiKey: null,
          apiUrl:
            process.env.EXPO_PUBLIC_API_URL || 'https://wakatime.com/api/v1',
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
