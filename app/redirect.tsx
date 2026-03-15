import { Skeleton } from '@/components/Skeleton';
import { useTheme } from '@/hooks/useTheme';
import { AuthService } from '@/services';
import { useAuthStore } from '@/stores/useAuthStore';
import { toastError, toastSuccess } from '@/utilities/toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

// Module-scoped set to track codes already being exchanged.
// Survives React Strict Mode unmount/remount cycles in dev.
const exchangingCodes = new Set<string>();

export default function AuthRedirectScreen() {
  const { theme } = useTheme();
  const { code, error, error_description } = useLocalSearchParams<{
    code?: string;
    error?: string;
    error_description?: string;
  }>();
  const router = useRouter();
  const { setTokens } = useAuthStore();

  useEffect(() => {
    if (error) {
      toastError('Login Failed', error_description || error);
      router.replace('/auth');
      return;
    }

    if (code && !exchangingCodes.has(code)) {
      exchangingCodes.add(code);
      handleExchange(code);
    } else if (!code) {
      router.replace('/auth');
    }

    return () => {
      // Clean up after a delay to allow Strict Mode's second mount to see the code.
      // In production there's no double-mount so this is a no-op.
    };
  }, [code, error]);

  const handleExchange = async (authCode: string) => {
    try {
      const data = await AuthService.exchangeCodeForToken(authCode);

      const expiresIn = data.expires_in
        ? parseInt(String(data.expires_in), 10)
        : 0;

      setTokens(data.access_token, data.refresh_token, expiresIn);
      toastSuccess('Success', 'WakaTime account connected');
      router.replace('/(tabs)');
    } catch (err: any) {
      toastError('Login Error', err.message);
      router.replace('/auth');
    } finally {
      exchangingCodes.delete(authCode);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        gap: 24,
        padding: 40,
      }}
    >
      <Skeleton variant="circle" width={80} height={80} />
      <View style={{ width: '100%', alignItems: 'center', gap: 12 }}>
        <Skeleton width="80%" height={20} borderRadius={10} />
        <Skeleton width="60%" height={16} borderRadius={8} />
      </View>
    </View>
  );
}
