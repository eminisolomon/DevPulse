import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  themeMode: 'light' | 'dark' | 'system';
  accentColor: string;
  collectCrashes: boolean;
  collectPerformance: boolean;
  collectAnalytics: boolean;
}

const SETTINGS_STORAGE_KEY = '@app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'system',
  accentColor: '#3B82F6',
  collectCrashes: true,
  collectPerformance: true,
  collectAnalytics: true,
};

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    try {
      const jsonValue = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (jsonValue != null) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(jsonValue) };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings: async (update: Partial<AppSettings>) => {
    try {
      const currentSettings = await settingsService.getSettings();
      const newSettings = { ...currentSettings, ...update };
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(newSettings),
      );
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  },
};
