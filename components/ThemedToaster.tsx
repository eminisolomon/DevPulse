import { useTheme } from '@/hooks/useTheme';
import { Toaster } from 'sonner-native';

export const ThemedToaster = () => {
  const { isDark } = useTheme();

  return <Toaster theme={isDark ? 'dark' : 'light'} />;
};
