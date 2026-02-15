import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  style?: ViewStyle;
}

export const Divider = ({
  orientation = 'horizontal',
  thickness = 1,
  color,
  style,
}: DividerProps) => {
  const { theme } = useTheme();

  const baseStyle: ViewStyle =
    orientation === 'horizontal'
      ? { width: '100%', height: thickness }
      : { height: '100%', width: thickness };

  return (
    <View
      style={[
        baseStyle,
        { backgroundColor: color || theme.colors.border },
        style,
      ]}
    />
  );
};
