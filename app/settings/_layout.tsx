import DefaultStackLayout from '@/components/nav/DefaultStackLayout';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <DefaultStackLayout screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="theme" />
    </DefaultStackLayout>
  );
}
