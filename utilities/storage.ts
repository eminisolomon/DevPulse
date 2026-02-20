import { db, migrationPromise, schema } from '@/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eq } from 'drizzle-orm';
import * as SecureStore from 'expo-secure-store';
import { StateStorage } from 'zustand/middleware';

export const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const asyncStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await AsyncStorage.getItem(name);
    return value || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

export const drizzleStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      await migrationPromise;
      const result = await db.query.kvCache.findFirst({
        where: eq(schema.kvCache.key, name),
      });
      return result?.value || null;
    } catch (error) {
      console.error('drizzleStorage.getItem error:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await migrationPromise;
      await db
        .insert(schema.kvCache)
        .values({
          key: name,
          value: value,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: schema.kvCache.key,
          set: {
            value: value,
            updatedAt: new Date(),
          },
        });
    } catch (error) {
      console.error('drizzleStorage.setItem error:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await migrationPromise;
      await db.delete(schema.kvCache).where(eq(schema.kvCache.key, name));
    } catch (error) {
      console.error('drizzleStorage.removeItem error:', error);
    }
  },
};
