import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TextInput } from '@/components/Input';
import { Switch } from '@/components/Switch';
import { Typography } from '@/components/Typography';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
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
                borderColor: 'rgba(57, 189, 248, 0.2)', // brand-400 with opacity
                backgroundColor: 'rgba(57, 189, 248, 0.1)', // brand-400 with opacity
              }}
            >
              <Ionicons name="key-outline" size={40} color="#38BDF8" />
            </View>
            <Typography
              variant="display"
              style={{ marginBottom: 8, textAlign: 'center' }}
            >
              DevPulse
            </Typography>
            <Typography
              variant="body"
              color="#94A3B8"
              style={{ textAlign: 'center' }}
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
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Ionicons name="server-outline" size={24} color="#38BDF8" />
                  <View>
                    <Typography variant="body" weight="medium">
                      Custom Server
                    </Typography>
                    <Typography variant="caption" color="#94A3B8">
                      Use a self-hosted Wakapi instance
                    </Typography>
                  </View>
                </View>
                <Switch checked={isCustomServer} onChange={setIsCustomServer} />
              </Card>

              {isCustomServer && (
                <View style={{ gap: 8 }}>
                  <Typography variant="caption" style={{ marginLeft: 4 }}>
                    Server URL
                  </Typography>
                  <TextInput
                    leftIcon={
                      <Ionicons
                        name="globe-outline"
                        size={20}
                        color="#94A3B8"
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
                <Typography variant="caption" style={{ marginLeft: 4 }}>
                  API Key
                </Typography>
                <TextInput
                  leftIcon={
                    <Ionicons name="key-outline" size={20} color="#94A3B8" />
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
                        backgroundColor: 'rgba(57, 189, 248, 0.1)',
                        padding: 6,
                        borderRadius: 6,
                      }}
                    >
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#38BDF8"
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
                  style={{ height: 1, flex: 1, backgroundColor: '#E2E8F0' }}
                />
                <Typography
                  variant="micro"
                  color="#94A3B8"
                  style={{ textTransform: 'uppercase' }}
                >
                  Or continue with
                </Typography>
                <View
                  style={{ height: 1, flex: 1, backgroundColor: '#E2E8F0' }}
                />
              </View>

              <Button
                variant="outline"
                size="lg"
                label="Connect with WakaTime"
                onPress={handleWebConnect}
                leftIcon={
                  <Ionicons name="globe-outline" size={20} color="#0F172A" />
                }
                fullWidth
              />

              <Typography
                variant="micro"
                color="#94A3B8"
                style={{
                  textAlign: 'center',
                  marginTop: 16,
                  paddingHorizontal: 16,
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
