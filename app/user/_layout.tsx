import DefaultStackLayout from '@/components/nav/DefaultStackLayout';
import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <DefaultStackLayout screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </DefaultStackLayout>
  );
}
