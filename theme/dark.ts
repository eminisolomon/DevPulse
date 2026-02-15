import { palette } from './colors';
import { Theme } from './light';

export const darkTheme: Theme = {
  colors: {
    background: palette.neutral[900],
    surface: palette.neutral[800],
    surfaceHighlight: palette.neutral[850],

    text: '#FFFFFF',
    textSecondary: palette.gray[400],
    textTertiary: palette.neutral[500],
    textInverse: palette.neutral[900],

    primary: palette.brand[400],
    primaryForeground: '#FFFFFF',
    primaryContainer: palette.brand[900],
    primaryContainerForeground: palette.brand[300],

    secondary: palette.secondary[600],
    secondaryForeground: '#FFFFFF',
    secondaryContainer: palette.secondary[900],
    secondaryContainerForeground: palette.secondary[300],

    accent: palette.accent[500],
    accentForeground: '#FFFFFF',
    accentContainer: palette.accent[900],
    accentContainerForeground: palette.accent[300],

    border: '#2A2D35',
    borderFocus: palette.brand[500],

    success: palette.success[500],
    successContainer: palette.success[900],
    warning: palette.warning[500],
    warningContainer: palette.warning[900],
    error: palette.error[500],
    errorContainer: palette.error[900],
    info: palette.info[500],
    infoContainer: palette.info[900],

    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  dark: true,
};
