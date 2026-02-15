import { Platform } from 'react-native';

/**
 * Typography system including font families, sizes, and weights.
 */
export const typography = {
  families: {
    regular: 'Outfit_400Regular',
    medium: 'Outfit_500Medium',
    bold: 'Outfit_700Bold',
    mono: Platform.select({ ios: 'Courier New', android: 'monospace' }),
  },
  sizes: {
    xs: 12,
    sm: 14,
    sub: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 40,
    '4xl': 44,
    '5xl': 64,
  },
};
