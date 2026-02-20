import { Typography } from '@/components/Typography';
import { LoginForm } from '@/features/auth';
import { useTheme } from '@/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  const isTablet = width > 768;
  const contentMaxWidth = isTablet ? 500 : '100%';
  const paddingHorizontal = isTablet ? 0 : theme.spacing[5];

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleOpenLink = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      edges={['top']}
    >
      <KeyboardAwareScrollView
        bottomOffset={62}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingTop: Platform.OS === 'ios' ? 60 : 80,
          paddingHorizontal: paddingHorizontal,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: '100%',
            maxWidth: contentMaxWidth,
          }}
        >
          <LoginForm />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <Typography
          variant="micro"
          color={theme.colors.textSecondary}
          style={styles.footerText}
        >
          By continuing, you agree to WakaTime's{' '}
          <Typography
            variant="micro"
            weight="bold"
            color={theme.colors.primary}
            onPress={() => handleOpenLink('https://wakatime.com/privacy')}
          >
            Privacy Policy
          </Typography>{' '}
          and{' '}
          <Typography
            variant="micro"
            weight="bold"
            color={theme.colors.primary}
            onPress={() =>
              handleOpenLink('https://wakatime.com/legal/terms-of-service')
            }
          >
            Terms of Service
          </Typography>
          .
        </Typography>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    paddingHorizontal: 60,
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
