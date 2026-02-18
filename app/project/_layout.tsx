import DefaultStackLayout from '@/components/nav/DefaultStackLayout';
import { Stack } from 'expo-router';

export default function ProjectLayout() {
  return (
    <DefaultStackLayout>
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </DefaultStackLayout>
  );
}
