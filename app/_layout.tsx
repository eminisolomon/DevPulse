import { AppProviders, ThemedToaster } from '@/components';
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
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';

if (Platform.OS === 'web' && typeof window === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  } as any;
}

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();

      setupNotificationHandler();
      requestNotificationPermissions().then((granted: boolean) => {
        if (granted) {
          scheduleSmartDailyReminders();
        }
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
        <ThemedToaster />
      </View>
    </AppProviders>
  );
}
