import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface StatBoxProps {
  label: string;
  value: string | number;
  variant?: 'subtle' | 'accent' | 'flat';
  valueColor?: string;
  style?: ViewStyle;
}

export const StatBox = ({
  label,
  value,
  variant = 'subtle',
  valueColor,
  style,
}: StatBoxProps) => {
  const { theme } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'accent':
        return {
          backgroundColor: theme.colors.primary + '15',
        };
      case 'flat':
        return {
          backgroundColor: 'transparent',
          padding: 0,
        };
      case 'subtle':
      default:
        return {
          backgroundColor: theme.colors.surfaceSubtle,
        };
    }
  };

  return (
    <View style={[styles.container, getVariantStyle(), style]}>
      <Typography
        variant="micro"
        weight="bold"
        color={theme.colors.textMuted}
        style={styles.label}
      >
        {label}
      </Typography>
      <Typography
        variant="title"
        weight="bold"
        style={{ color: valueColor || theme.colors.text }}
      >
        {value}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
});
