import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { AuthConfig } from '@/features/auth/AuthConfig';
import { useTheme } from '@/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { toastError, toastSuccess } from '@/utilities/toast';
import { Ionicons } from '@expo/vector-icons';
import { useAuthRequest } from 'expo-auth-session';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export function LoginForm() {
  const { theme } = useTheme();
  const { setTokens, isAuthenticated } = useAuthStore();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: AuthConfig.clientId,
      scopes: AuthConfig.scopes,
      redirectUri: AuthConfig.redirectUri,
    },
    AuthConfig.discovery,
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      exchangeCodeForToken(code);
    } else if (response?.type === 'error') {
      toastError(
        'Login Failed',
        response.error?.message || 'Something went wrong',
      );
    }
  }, [response]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const tokenResponse = await fetch(AuthConfig.discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: AuthConfig.clientId,
          client_secret: AuthConfig.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: AuthConfig.redirectUri,
        }).toString(),
      });

      const data = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(data.error_description || 'Failed to exchange token');
      }

      setTokens(data.access_token, data.refresh_token, data.expires_in);
      toastSuccess('Success', 'Logged in successfully');
    } catch (error: any) {
      toastError('Login Error', error.message);
    }
  };

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
          label="Log in with WakaTime"
          onPress={() => promptAsync()}
          disabled={!request}
          leftIcon={
            <Ionicons
              name="logo-github" // WakaTime often associated with GitHub, or use a generic login icon
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
