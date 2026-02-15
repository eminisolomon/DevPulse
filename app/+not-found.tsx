import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Typography variant="display" style={{ marginBottom: 16 }}>
          404
        </Typography>
        <Typography
          variant="body"
          style={{ marginBottom: 32, textAlign: 'center' }}
          color={theme.colors.textSecondary}
        >
          This screen doesn't exist.
        </Typography>
        <Link href="/" asChild>
          <Button label="Go to Home" />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
