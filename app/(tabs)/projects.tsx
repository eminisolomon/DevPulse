import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProjectsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-900 justify-center items-center">
      <Text className="text-white text-lg font-bold">Projects Coming Soon</Text>
      <Text className="text-neutral-500 mt-2">
        Detailed project analytics in Phase 2
      </Text>
    </SafeAreaView>
  );
}
