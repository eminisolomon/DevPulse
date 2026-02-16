import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TextInput } from '@/components/Input';
import { Select, SelectOption } from '@/components/Select';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { WakaTimeGoal } from '@/interfaces/goal';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

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
  const [title, setTitle] = useState(initialData?.title || '');
  const [seconds, setSeconds] = useState(
    initialData?.seconds ? (initialData.seconds / 3600).toString() : '1',
  );
  const [delta, setDelta] = useState(initialData?.delta || 'day');

  const handleSubmit = () => {
    if (!title || !seconds) return;

    onSubmit({
      title,
      seconds: parseFloat(seconds) * 3600,
      delta,
      is_enabled: true,
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        <Typography variant="title" weight="bold" style={styles.title}>
          {isEdit ? 'Edit Goal' : 'New Goal'}
        </Typography>

        <TextInput
          label="Title"
          placeholder="e.g. My Coding Goal"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          label="Target Hours"
          placeholder="e.g. 5"
          value={seconds}
          onChangeText={setSeconds}
          keyboardType="numeric"
        />

        <Select
          label="Frequency"
          value={delta}
          options={DELTA_OPTIONS}
          onSelect={setDelta}
          title="Select Frequency"
        />

        <Button
          label={isEdit ? 'Update Goal' : 'Create Goal'}
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.button}
          size="lg"
          fullWidth
        />
      </Card>
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
  card: {
    padding: 20,
  },
  title: {
    marginBottom: 24,
  },
  button: {
    marginTop: 24,
  },
});
