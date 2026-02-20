import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import * as SecureStore from 'expo-secure-store';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  tokenType: 'bearer' | 'basic' | null;
  isAuthenticated: boolean;
  setTokens: (
    accessToken: string,
    refreshToken: string | null,
    expiresIn: number | null,
    tokenType?: 'bearer' | 'basic',
  ) => void;
  logout: () => void;
}

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
      tokenType: null,
      isAuthenticated: false,
      setTokens: (
        accessToken,
        refreshToken,
        expiresIn,
        tokenType = 'bearer',
      ) => {
        const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;
        set({
          accessToken,
          refreshToken,
          expiresAt,
          tokenType,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          tokenType: null,
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
