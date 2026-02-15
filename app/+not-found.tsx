import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <View className="flex-1 items-center justify-center bg-neutral-900 p-5">
        <Text className="text-white text-4xl font-bold mb-4 font-sans">
          404
        </Text>
        <Text className="text-neutral-400 text-lg mb-8 text-center font-sans">
          This screen doesn't exist.
        </Text>
        <Link href="/" className="bg-emerald-500 px-6 py-3 rounded-xl">
          <Text className="text-black font-bold font-sans">Go to Home</Text>
        </Link>
      </View>
    </>
  );
}
