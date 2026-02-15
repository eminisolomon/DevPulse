import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from './Typography';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox = ({
  label,
  checked,
  onChange,
  disabled,
}: CheckboxProps) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      style={[styles.container, disabled && { opacity: 0.5 }]}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? theme.colors.primary : theme.colors.border,
            backgroundColor: checked ? theme.colors.primary : 'transparent',
            borderRadius: 10,
            width: 20,
            height: 20,
          },
        ]}
      >
        {checked && (
          <Ionicons
            name="checkmark"
            size={14}
            color={theme.colors.primaryForeground}
          />
        )}
      </View>
      {label && (
        <Typography variant="body" style={{ marginLeft: theme.spacing[3] }}>
          {label}
        </Typography>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
