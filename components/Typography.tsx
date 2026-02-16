import { useTheme } from '@/hooks/useTheme';
import { Platform, Text, TextProps } from 'react-native';

type TypographyVariant =
  | 'display'
  | 'headline'
  | 'subtitle'
  | 'title'
  | 'body'
  | 'lg'
  | 'caption'
  | 'micro';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography = ({
  variant = 'body',
  color,
  weight,
  align,
  style,
  ...props
}: TypographyProps) => {
  const { theme } = useTheme();

  const getVariantStyle = () => {
    const { sizes, lineHeights, families } = theme.typography;

    switch (variant) {
      case 'display':
        return {
          fontSize: sizes['5xl'],
          lineHeight: lineHeights['5xl'],
          fontFamily: families.bold,
        };
      case 'headline':
        return {
          fontSize: sizes['4xl'],
          lineHeight: lineHeights['4xl'],
          fontFamily: families.medium,
          letterSpacing: -0.56,
          textTransform: 'capitalize' as const,
        };
      case 'subtitle':
        return {
          fontSize: sizes['sub'],
          lineHeight: 24,
          fontFamily: families.regular,
          letterSpacing: 0,
        };
      case 'title':
        return {
          fontSize: sizes['2xl'],
          lineHeight: lineHeights['2xl'],
          fontFamily: families.bold,
        };
      case 'body':
        return {
          fontSize: sizes.md,
          lineHeight: lineHeights.md,
          fontFamily: families.regular,
        };
      case 'lg':
        return {
          fontSize: sizes.lg,
          lineHeight: lineHeights.lg,
          fontFamily: families.medium,
        };
      case 'caption':
        return {
          fontSize: sizes.sm,
          lineHeight: lineHeights.sm,
          fontFamily: families.medium,
        };
      case 'micro':
        return {
          fontSize: sizes.xs,
          lineHeight: lineHeights.xs,
          fontFamily: families.regular,
        };
      default:
        return {};
    }
  };

  const getWeightStyle = () => {
    const families = theme.typography.families;
    if (weight === 'bold') return { fontFamily: families.bold };
    if (weight === 'medium' || weight === 'semibold')
      return { fontFamily: families.medium };
    return { fontFamily: families.regular };
  };

  return (
    <Text
      style={[
        getVariantStyle(),
        { color: color || theme.colors.text },
        align && { textAlign: align },
        getWeightStyle(),
        style,
      ]}
      {...((Platform.OS === 'android'
        ? { includeFontPadding: false }
        : {}) as any)}
      {...props}
    />
  );
};
