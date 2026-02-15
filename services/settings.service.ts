import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface AppSettings {
  themeMode: 'light' | 'dark' | 'system';
  accentColor: string;
  collectCrashes: boolean;
  collectPerformance: boolean;
  collectAnalytics: boolean;
}

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    try {
      const result = await db.query.settings.findFirst({
        where: eq(settings.id, 1),
      });

      if (!result) {
        const [newSettings] = await db
          .insert(settings)
          .values({
            id: 1,
            themeMode: 'system',
            accentColor: '#3B82F6',
            collectCrashes: true,
            collectPerformance: true,
            collectAnalytics: true,
            lastUpdatedAt: new Date(),
          })
          .returning();

        return {
          themeMode: newSettings.themeMode as 'light' | 'dark' | 'system',
          accentColor: newSettings.accentColor,
          collectCrashes: !!newSettings.collectCrashes,
          collectPerformance: !!newSettings.collectPerformance,
          collectAnalytics: !!newSettings.collectAnalytics,
        };
      }

      return {
        themeMode: result.themeMode as 'light' | 'dark' | 'system',
        accentColor: result.accentColor,
        collectCrashes: !!result.collectCrashes,
        collectPerformance: !!result.collectPerformance,
        collectAnalytics: !!result.collectAnalytics,
      };
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      return {
        themeMode: 'system',
        accentColor: '#3B82F6',
        collectCrashes: true,
        collectPerformance: true,
        collectAnalytics: true,
      };
    }
  },

  updateSettings: async (update: Partial<AppSettings>) => {
    try {
      await db
        .update(settings)
        .set({
          ...update,
          lastUpdatedAt: new Date(),
        })
        .where(eq(settings.id, 1));
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  },
};
