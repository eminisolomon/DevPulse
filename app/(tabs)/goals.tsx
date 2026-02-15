import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GoalsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-900 justify-center items-center">
      <Text className="text-white text-lg font-bold">Goals Coming Soon</Text>
      <Text className="text-neutral-500 mt-2">
        Track your coding goals in Phase 3
      </Text>
    </SafeAreaView>
  );
}
