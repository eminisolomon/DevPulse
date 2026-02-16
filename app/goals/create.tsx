import { GoalForm } from '@/features/goals/GoalForm';
import { useGoalMutation, useTheme } from '@/hooks';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function CreateGoalScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { createGoal } = useGoalMutation();

  const handleSubmit = async (data: any) => {
    try {
      await createGoal.mutateAsync(data);
      router.back();
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <GoalForm onSubmit={handleSubmit} isLoading={createGoal.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
