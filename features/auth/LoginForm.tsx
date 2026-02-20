import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { AuthConfig } from '@/features/auth/AuthConfig';
import { useTheme } from '@/hooks';
import { toastError } from '@/utilities/toast';
import { Ionicons } from '@expo/vector-icons';
import { useAuthRequest } from 'expo-auth-session';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export function LoginForm() {
  const { theme } = useTheme();

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: AuthConfig.clientId,
      scopes: AuthConfig.scopes,
      redirectUri: AuthConfig.redirectUri,
    },
    AuthConfig.discovery,
  );

  useEffect(() => {
    if (!AuthConfig.clientId) {
      console.error('LoginForm: WAKATIME_APP_ID is missing from configuration');
    }
  }, [request]);

  return (
    <View style={{ gap: 24 }}>
      <Card
        variant="elevated"
        style={{
          padding: 24,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          gap: 16,
        }}
      >
        <Typography
          variant="body"
          style={{
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginBottom: 8,
          }}
        >
          Log in to access your WakaTime coding statistics.
        </Typography>

        <Button
          variant="primary"
          size="lg"
          label={
            !request
              ? AuthConfig.clientId
                ? 'Initializing...'
                : 'Config Missing'
              : 'Log in with WakaTime'
          }
          onPress={async () => {
            try {
              const res = await promptAsync();
              if (res.type === 'cancel') {
                toastError('Cancelled', 'Login process was cancelled');
              }
            } catch (err: any) {
              toastError('Login Error', err.message || 'Failed to open login');
            }
          }}
          disabled={!request}
          loading={!request && AuthConfig.clientId !== undefined}
          leftIcon={
            <Ionicons
              name="logo-github"
              size={20}
              color={theme.colors.textInverse}
            />
          }
          fullWidth
        />

        <Typography
          variant="micro"
          style={{
            textAlign: 'center',
            color: theme.colors.textTertiary,
          }}
        >
          You will be redirected to wakatime.com to approve access.
        </Typography>
      </Card>
    </View>
  );
}
