import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export const ScreenHeader = ({ title, subtitle, style }: ScreenHeaderProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.header, style]}>
      <Typography variant="headline" weight="bold">
        {title}
      </Typography>
      {subtitle && (
        <Typography color={theme.colors.textSecondary} style={styles.subtitle}>
          {subtitle}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 2,
  },
});
