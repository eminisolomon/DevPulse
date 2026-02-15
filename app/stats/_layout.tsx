import { DefaultStackLayout } from '@/components';
import { Stack } from 'expo-router';
import React from 'react';

export default function StatsLayout() {
  return (
    <DefaultStackLayout>
      <Stack.Screen name="index" options={{ title: 'Stats' }} />
    </DefaultStackLayout>
  );
}
