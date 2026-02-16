import { AuthHeader, LoginForm } from '@/features/auth';
import { useTheme } from '@/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  const isTablet = width > 768;
  const contentMaxWidth = isTablet ? 500 : '100%';
  const paddingHorizontal = isTablet ? 0 : 24;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 40,
          }}
          style={{ paddingHorizontal }}
        >
          <View style={{ width: '100%', maxWidth: contentMaxWidth }}>
            <AuthHeader />
            <LoginForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
