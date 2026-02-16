import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TextInput } from '@/components/Input';
import { Select, SelectOption } from '@/components/Select';
import { useTheme } from '@/hooks/useTheme';
import { WakaTimeGoal } from '@/interfaces/goal';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { GoalFormData, goalSchema } from './schemas';

interface GoalFormProps {
  initialData?: Partial<WakaTimeGoal>;
  onSubmit: (data: Partial<WakaTimeGoal>) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const DELTA_OPTIONS: SelectOption[] = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

export const GoalForm = ({
  initialData,
  onSubmit,
  isLoading,
  isEdit,
}: GoalFormProps) => {
  const { theme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: initialData?.title || '',
      hours: initialData?.seconds
        ? (initialData.seconds / 3600).toString()
        : '1',
      delta: (initialData?.delta as any) || 'day',
    },
  });

  const onFormSubmit = (data: GoalFormData) => {
    onSubmit({
      title: data.title,
      seconds: parseFloat(data.hours) * 3600,
      delta: data.delta,
      is_enabled: true,
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.formContent}>
        <Card style={styles.card}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Title"
                placeholder="e.g. My Coding Goal"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="hours"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Target Hours"
                placeholder="e.g. 5"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                error={errors.hours?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="delta"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Frequency"
                value={value}
                options={DELTA_OPTIONS}
                onSelect={onChange}
                title="Select Frequency"
              />
            )}
          />
        </Card>

        <Button
          label={isEdit ? 'Update Goal' : 'Create Goal'}
          onPress={handleSubmit(onFormSubmit)}
          loading={isLoading}
          style={styles.button}
          size="lg"
          fullWidth
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  formContent: {
    gap: 16,
  },
  card: {
    padding: 20,
  },
  button: {
    marginTop: 8,
  },
});
