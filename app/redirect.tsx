import { Skeleton } from '@/components/Skeleton';
import { useTheme } from '@/hooks/useTheme';
import { View } from 'react-native';

export default function AuthRedirectScreen() {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        gap: 16,
        padding: 40,
      }}
    >
      <Skeleton variant="circle" width={64} height={64} />
      <Skeleton width="60%" height={16} borderRadius={8} />
      <Skeleton width="40%" height={12} borderRadius={6} />
    </View>
  );
}
