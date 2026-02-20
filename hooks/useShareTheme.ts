import { useTheme } from '@/hooks/useTheme';

export const useShareTheme = () => {
  const { isDark, theme } = useTheme();

  const textColor = isDark ? '#FFFFFF' : '#111111';
  const mutedColor = isDark ? '#A1A1AA' : '#666666';
  const surfaceColor = isDark ? '#18181B' : '#F3F4F6';
  const accent = theme.colors.primary;

  return {
    textColor,
    mutedColor,
    surfaceColor,
    accent,
    isDark,
    theme,
  };
};
