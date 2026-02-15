import { useRouter } from 'expo-router';
import { ArrowRight, Globe, Key, Server } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/useAuthStore';

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

  const handleConnect = () => {
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

    // Navigation happens automatically via useEffect
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-6"
        >
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-emerald-500 rounded-3xl items-center justifyContent-center mb-6 shadow-lg shadow-emerald-500/20">
              <Key size={40} color="#000" />
            </View>
            <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
              DevPulse
            </Text>
            <Text className="text-neutral-400 text-lg">
              Your coding stats, beautifully visualized.
            </Text>
          </View>

          <View className="space-y-6">
            {/* Server Toggle */}
            <View className="flex-row items-center justify-between bg-neutral-800 p-4 rounded-2xl border border-neutral-700">
              <View className="flex-row items-center space-x-3">
                <Server size={24} color="#10b981" />
                <View>
                  <Text className="text-white font-semibold text-base">
                    Custom Server
                  </Text>
                  <Text className="text-neutral-400 text-xs">
                    Use a self-hosted Wakapi instance
                  </Text>
                </View>
              </View>
              <Switch
                value={isCustomServer}
                onValueChange={setIsCustomServer}
                trackColor={{ false: '#262626', true: '#10b981' }}
                thumbColor={isCustomServer ? '#fff' : '#404040'}
              />
            </View>

            {/* Custom URL Input */}
            {isCustomServer && (
              <View className="space-y-2">
                <Text className="text-neutral-400 ml-1 text-sm font-medium">
                  Server URL
                </Text>
                <View className="flex-row items-center bg-neutral-800 rounded-xl border border-neutral-700 px-4 h-14">
                  <Globe size={20} color="#9ca3af" />
                  <TextInput
                    className="flex-1 text-white ml-3 text-base h-full"
                    placeholder="https://wakapi.dev/api/v1"
                    placeholderTextColor="#525252"
                    value={customUrl}
                    onChangeText={setCustomUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            )}

            {/* API Key Input */}
            <View className="space-y-2">
              <Text className="text-neutral-400 ml-1 text-sm font-medium">
                API Key
              </Text>
              <View className="flex-row items-center bg-neutral-800 rounded-xl border border-neutral-700 px-4 h-14">
                <Key size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 text-white ml-3 text-base h-full font-mono"
                  placeholder="waka_..."
                  placeholderTextColor="#525252"
                  value={keyInput}
                  onChangeText={setKeyInput}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Connect Button */}
            <TouchableOpacity
              onPress={handleConnect}
              className="bg-emerald-500 h-14 rounded-xl items-center justify-center flex-row space-x-2 shadow-lg shadow-emerald-500/20 active:bg-emerald-600"
            >
              <Text className="text-black font-bold text-lg">
                Connect Account
              </Text>
              <ArrowRight size={20} color="#000" strokeWidth={2.5} />
            </TouchableOpacity>

            <Text className="text-neutral-500 text-center text-xs mt-4">
              Your API key is stored securely on your device using Expo
              SecureStore.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
