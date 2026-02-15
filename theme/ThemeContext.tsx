import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme } from './dark';
import { lightTheme, Theme } from './light';
import { spacing } from './spacing';
import { tokens } from './tokens';
import { typography } from './typography';

export type AppTheme = Theme & {
  spacing: typeof spacing;
  typography: typeof typography;
  tokens: typeof tokens;
};

interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
  themeMode: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>(
    'system',
  );
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getThemePreference();
      if (savedTheme) {
        setThemeModeState(savedTheme);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const themeColors = isDark ? darkTheme : lightTheme;

  const theme = {
    ...themeColors,
    spacing,
    typography,
    tokens,
  };

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setThemeModeState(mode);
    setThemePreference(mode);
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, themeMode, toggleTheme, setThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
