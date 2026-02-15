import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  apiKey: string | null;
  apiUrl: string;
  setApiKey: (apiKey: string) => void;
  setApiUrl: (apiUrl: string) => void;
  reset: () => void;
}

const secureStorage = {
  getItem: async (name: string) => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      apiKey: null,
      apiUrl: 'https://wakatime.com/api/v1',
      setApiKey: (apiKey) => set({ apiKey }),
      setApiUrl: (apiUrl) => set({ apiUrl }),
      reset: () => set({ apiKey: null, apiUrl: 'https://wakatime.com/api/v1' }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
