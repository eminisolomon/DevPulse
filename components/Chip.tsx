import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { Typography } from './Typography';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  style?: ViewStyle;
}

export const Chip = ({
  label,
  selected,
  onPress,
  onClose,
  style,
}: ChipProps) => {
  const { theme } = useTheme();

  const bg = selected
    ? theme.colors.primaryContainer
    : theme.colors.surfaceHighlight;
  const text = selected
    ? theme.colors.primaryContainerForeground
    : theme.colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: bg,
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[1],
          borderRadius: 99,
          alignSelf: 'flex-start',
          borderWidth: 1,
          borderColor: selected ? theme.colors.primary : 'transparent',
        },
        style,
      ]}
    >
      <Typography variant="caption" weight="medium" style={{ color: text }}>
        {label}
      </Typography>
      {onClose && (
        <Pressable
          onPress={onClose}
          hitSlop={8}
          style={{ marginLeft: theme.spacing[2] }}
        >
          <Ionicons name="close-circle" size={16} color={text} />
        </Pressable>
      )}
    </Pressable>
  );
};
