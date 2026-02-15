import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Typography } from './Typography';

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default';

interface BadgeProps {
  label: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge = ({
  label,
  variant = 'default',
  size = 'sm',
  style,
}: BadgeProps) => {
  const { theme } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: theme.colors.successContainer,
          text: theme.colors.success,
        };
      case 'warning':
        return {
          bg: theme.colors.warningContainer,
          text: theme.colors.warning,
        };
      case 'error':
        return { bg: theme.colors.errorContainer, text: theme.colors.error };
      case 'info':
        return { bg: theme.colors.infoContainer, text: theme.colors.info };
      default:
        return {
          bg: theme.colors.surfaceHighlight,
          text: theme.colors.textSecondary,
        };
    }
  };

  const { bg, text } = getColors();

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          paddingHorizontal: theme.spacing[2],
          paddingVertical: theme.spacing[1] / 2,
          borderRadius: theme.spacing[1],
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Typography variant="micro" weight="medium" style={{ color: text }}>
        {label}
      </Typography>
    </View>
  );
};
