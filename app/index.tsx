import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Globe,
  Key,
  Server as ServerIcon,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/useAuthStore';

// UI Components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Typography } from '@/components/ui/Typography';

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
      Alert.alert('Error', 'Please enter your API Key');
      return;
    }

    if (isCustomServer && !customUrl.trim()) {
      Alert.alert('Error', 'Please enter your Wakapi URL');
      return;
    }

    const finalUrl = isCustomServer ? customUrl : 'https://wakatime.com/api/v1';

    // Save to store
    setApiKey(keyInput.trim());
    setApiUrl(finalUrl.trim());
  };

  const handleWebConnect = () => {
    // Placeholder for OAuth/Web flow
    Alert.alert('Coming Soon', 'Web authentication flow is under development.');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-6"
        >
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-primary/10 rounded-3xl items-center justifyContent-center mb-6 shadow-sm border border-primary/20">
              <Key size={40} className="text-primary" />
            </View>
            <Typography variant="h1" className="mb-2 text-center">
              DevPulse
            </Typography>
            <Typography variant="lead" className="text-center">
              Your coding stats, beautifully visualized.
            </Typography>
          </View>

          <View className="space-y-6">
            <View className="space-y-6">
              <Card className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center space-x-3">
                  <ServerIcon size={24} className="text-primary" />
                  <View>
                    <Typography variant="large">Custom Server</Typography>
                    <Typography variant="muted">
                      Use a self-hosted Wakapi instance
                    </Typography>
                  </View>
                </View>
                <Switch
                  value={isCustomServer}
                  onValueChange={setIsCustomServer}
                />
              </Card>

              {isCustomServer && (
                <View className="space-y-2">
                  <Typography variant="small" className="ml-1">
                    Server URL
                  </Typography>
                  <Input
                    icon={<Globe size={20} className="text-muted-foreground" />}
                    placeholder="https://wakapi.dev/api/v1"
                    value={customUrl}
                    onChangeText={setCustomUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              )}

              <View className="space-y-2">
                <Typography variant="small" className="ml-1">
                  API Key
                </Typography>
                <Input
                  icon={<Key size={20} className="text-muted-foreground" />}
                  placeholder="waka_..."
                  value={keyInput}
                  onChangeText={setKeyInput}
                  secureTextEntry
                  autoCapitalize="none"
                  textClassName="font-mono"
                  rightElement={
                    <View className="bg-primary/10 p-1.5 rounded-md active:bg-primary/20">
                      <ArrowRight size={20} className="text-primary" />
                    </View>
                  }
                  onRightElementPress={handleApiKeySubmit}
                />
              </View>

              <View className="flex-row items-center space-x-4 my-2">
                <View className="h-[1px] flex-1 bg-border" />
                <Typography variant="muted" className="text-xs uppercase">
                  Or continue with
                </Typography>
                <View className="h-[1px] flex-1 bg-border" />
              </View>

              <Button
                variant="outline"
                size="lg"
                onPress={handleWebConnect}
                className="w-full flex-row space-x-2"
              >
                <Globe size={20} className="text-foreground" />
                <Typography className="font-semibold">
                  Connect with WakaTime
                </Typography>
              </Button>

            <Typography
              variant="muted"
              className="text-center text-xs mt-4 px-4"
            >
              Your API key is stored securely on your device using Expo
              SecureStore.
            </Typography>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
