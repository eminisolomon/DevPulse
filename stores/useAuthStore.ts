import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import * as SecureStore from 'expo-secure-store';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
  ) => void;
  logout: () => void;
}

// Custom storage for secure items
const secureStorage = {
  getItem: async (name: string) => {
    return SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string) => {
    return SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    return SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken, expiresIn) => {
        const expiresAt = Date.now() + expiresIn * 1000;
        set({ accessToken, refreshToken, expiresAt, isAuthenticated: true });
      },
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
