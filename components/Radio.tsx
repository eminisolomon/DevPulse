import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from './Typography';

interface RadioProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Radio = ({ label, checked, onChange, disabled }: RadioProps) => {
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
            borderRadius: 99, // Circle
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        {checked && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
            }}
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
    marginBottom: 8,
  },
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
