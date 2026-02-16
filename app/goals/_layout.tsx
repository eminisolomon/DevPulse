import DefaultStackLayout from '@/components/nav/DefaultStackLayout';
import { Stack } from 'expo-router';

export default function GoalsLayout() {
  return (
    <DefaultStackLayout>
      <Stack.Screen name="create" options={{ title: 'Create Goal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Edit Goal' }} />
    </DefaultStackLayout>
  );
}
