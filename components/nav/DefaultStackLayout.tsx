import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';
import { BackButton } from './BackButton';

interface DefaultStackLayoutProps {
  children: React.ReactNode;
}

export default function DefaultStackLayout({
  children,
}: DefaultStackLayoutProps) {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerBackTitle: '',
        headerTransparent: false,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontFamily: theme.typography.families.bold,
          fontSize: theme.typography.sizes.xl,
        },
        headerShadowVisible: false,
        animation: 'slide_from_bottom',
        headerLeft: (props) => <BackButton {...props} />,
      }}
    >
      {children}
    </Stack>
  );
}
