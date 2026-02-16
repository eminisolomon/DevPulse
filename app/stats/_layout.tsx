import DefaultStackLayout from '@/components/nav/DefaultStackLayout';
import { Stack } from 'expo-router';

export default function StatsLayout() {
  return (
    <DefaultStackLayout>
      <Stack.Screen name="numbers" options={{ title: 'The Numbers' }} />
      <Stack.Screen name="daily" options={{ title: '' }} />
    </DefaultStackLayout>
  );
}
