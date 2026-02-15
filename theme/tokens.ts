/**
 * Design tokens for consistent UI properties across the application.
 */
export const tokens = {
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },

  zIndex: {
    base: 0,
    elevated: 10,
    header: 50,
    drawer: 100,
    modal: 200,
    toast: 300,
    loading: 999,
  },

  opacity: {
    disabled: 0.5,
    faint: 0.3,
    active: 0.8,
  },

  iconSize: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    opacity: {
      active: 0.7,
    },
  },
} as const;

export type Tokens = typeof tokens;
