import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TextInput } from '@/components/Input';
import { Switch } from '@/components/Switch';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { toastError, toastInfo } from '@/utilities/toast';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const router = useRouter();
  const { apiKey, setApiKey, setApiUrl, apiUrl } = useAuthStore();

  const [keyInput, setKeyInput] = useState('');
  const [isCustomServer, setIsCustomServer] = useState(false);
  const [customUrl, setCustomUrl] = useState('https://wakapi.dev/api/v1');
  const { theme } = useTheme();

  useEffect(() => {
    if (apiKey) {
      router.replace('/(tabs)');
    }
  }, [apiKey]);

  const handleApiKeySubmit = () => {
    if (!keyInput.trim()) {
      toastError('Error', 'Please enter your API Key');
      return;
    }

    if (isCustomServer && !customUrl.trim()) {
      toastError('Error', 'Please enter your Wakapi URL');
      return;
    }

    const finalUrl = isCustomServer ? customUrl : 'https://wakatime.com/api/v1';

    // Save to store
    setApiKey(keyInput.trim());
    setApiUrl(finalUrl.trim());
  };

  const handleWebConnect = () => {
    toastInfo('Coming Soon', 'Web authentication flow is under development.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          style={{ paddingHorizontal: 24 }}
        >
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
              <Ionicons
                name="key-outline"
                size={40}
                color={theme.colors.primary}
              />
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

          <View style={{ gap: 24 }}>
            <View style={{ gap: 24 }}>
              <Card
                variant="elevated"
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Ionicons
                    name="server-outline"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <View>
                    <Typography
                      variant="body"
                      weight="medium"
                      style={{ color: theme.colors.text }}
                    >
                      Custom Server
                    </Typography>
                    <Typography
                      variant="caption"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Use a self-hosted Wakapi instance
                    </Typography>
                  </View>
                </View>
                <Switch checked={isCustomServer} onChange={setIsCustomServer} />
              </Card>

              {isCustomServer && (
                <View style={{ gap: 8 }}>
                  <Typography
                    variant="caption"
                    style={{ marginLeft: 4, color: theme.colors.textSecondary }}
                  >
                    Server URL
                  </Typography>
                  <TextInput
                    leftIcon={
                      <Ionicons
                        name="globe-outline"
                        size={20}
                        color={theme.colors.textTertiary}
                      />
                    }
                    placeholder="https://wakapi.dev/api/v1"
                    value={customUrl}
                    onChangeText={setCustomUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              )}

              <View style={{ gap: 8 }}>
                <Typography
                  variant="caption"
                  style={{ marginLeft: 4, color: theme.colors.textSecondary }}
                >
                  API Key
                </Typography>
                <TextInput
                  leftIcon={
                    <Ionicons
                      name="key-outline"
                      size={20}
                      color={theme.colors.textTertiary}
                    />
                  }
                  placeholder="waka_..."
                  value={keyInput}
                  onChangeText={setKeyInput}
                  secureTextEntry
                  autoCapitalize="none"
                  style={{ fontFamily: 'monospace' }}
                  rightIcon={
                    <View
                      style={{
                        backgroundColor: theme.colors.primaryContainer,
                        padding: 6,
                        borderRadius: 6,
                      }}
                    >
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color={theme.colors.primary}
                        onPress={handleApiKeySubmit}
                      />
                    </View>
                  }
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  marginVertical: 8,
                }}
              >
                <View
                  style={{
                    height: 1,
                    flex: 1,
                    backgroundColor: theme.colors.border,
                  }}
                />
                <Typography
                  variant="micro"
                  style={{
                    textTransform: 'uppercase',
                    color: theme.colors.textTertiary,
                  }}
                >
                  Or continue with
                </Typography>
                <View
                  style={{
                    height: 1,
                    flex: 1,
                    backgroundColor: theme.colors.border,
                  }}
                />
              </View>

              <Button
                variant="outline"
                size="lg"
                label="Connect with WakaTime"
                onPress={handleWebConnect}
                leftIcon={
                  <Ionicons
                    name="globe-outline"
                    size={20}
                    color={theme.colors.text}
                  />
                }
                fullWidth
                style={{ borderColor: theme.colors.border }}
                labelStyle={{ color: theme.colors.text }}
              />

              <Typography
                variant="micro"
                style={{
                  textAlign: 'center',
                  marginTop: 16,
                  paddingHorizontal: 16,
                  color: theme.colors.textSecondary,
                }}
              >
                Your API key is stored securely on your device using Expo
                SecureStore.
              </Typography>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
