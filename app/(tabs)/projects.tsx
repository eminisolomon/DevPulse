import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProjectsScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Typography variant="headline" weight="bold" style={styles.title}>
          Projects Coming Soon
        </Typography>
        <Typography color={theme.colors.textSecondary} style={styles.subtitle}>
          Detailed project analytics in Phase 2
        </Typography>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});
