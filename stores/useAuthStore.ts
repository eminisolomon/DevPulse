import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import * as SecureStore from 'expo-secure-store';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  tokenType: 'bearer' | 'basic' | null;
  isAuthenticated: boolean;
  user: {
    photo: string | null;
    display_name: string | null;
    username: string | null;
  } | null;
  hasHydrated: boolean;
  setTokens: (
    accessToken: string,
    refreshToken: string | null,
    expiresIn: number | null,
    tokenType?: 'bearer' | 'basic',
  ) => void;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
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
      user: null,
      hasHydrated: false,
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
      setUser: (user) => set({ user }),
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          tokenType: null,
          isAuthenticated: false,
          user: null,
        });
      },
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: (state) => {
        return () => {
          state.setHasHydrated(true);
        };
      },
    },
  ),
);
