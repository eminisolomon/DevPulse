import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

export const AuthHeader = () => {
  const { theme } = useTheme();

  return (
    <View style={{ alignItems: 'center', marginBottom: 48 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          borderWidth: 1,
          borderColor: theme.colors.primaryContainer,
          backgroundColor: theme.colors.primaryContainer,
        }}
      >
        <Ionicons name="key-outline" size={40} color={theme.colors.primary} />
      </View>
      <Typography
        variant="display"
        style={{
          marginBottom: 8,
          textAlign: 'center',
          color: theme.colors.text,
        }}
      >
        DevPulse
      </Typography>
      <Typography
        variant="body"
        style={{ textAlign: 'center', color: theme.colors.textSecondary }}
      >
        Your coding stats, beautifully visualized.
      </Typography>
    </View>
  );
};
