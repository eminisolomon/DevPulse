import { AppProviders, ThemedToaster } from '@/components';
import { db } from '@/db';
import migrations from '@/drizzle/migrations';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  requestNotificationPermissions,
  scheduleSmartDailyReminders,
  setupNotificationHandler,
} from '@/utilities';
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const { success: migrationsLoaded, error: migrationError } = useMigrations(
    db,
    migrations,
  );

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useEffect(() => {
    if (migrationError) {
      console.error('Migration error:', migrationError);
    }

    if (fontsLoaded && migrationsLoaded) {
      SplashScreen.hideAsync();

      setupNotificationHandler();
      requestNotificationPermissions().then((granted: boolean) => {
        if (granted) {
          scheduleSmartDailyReminders();
        }
      });
    }
  }, [fontsLoaded, migrationsLoaded, migrationError]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <RootNavigation />
      <StatusBar style="auto" />
      <ThemedToaster />
    </AppProviders>
  );
}

function RootNavigation() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inAuthGroup) {
      router.replace('/');
    } else if (isAuthenticated && !inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
