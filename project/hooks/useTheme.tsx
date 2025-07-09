import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors, ThemeMode, ColorBlindMode, ColorPalette } from '@/constants/Colors';

interface ThemeContextType {
  colors: ColorPalette;
  themeMode: ThemeMode;
  colorBlindMode: ColorBlindMode;
  setThemeMode: (mode: ThemeMode) => void;
  setColorBlindMode: (mode: ColorBlindMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@fitness_app_theme';
const COLORBLIND_STORAGE_KEY = '@fitness_app_colorblind';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [colorBlindMode, setColorBlindModeState] = useState<ColorBlindMode>('none');
  const [colors, setColors] = useState<ColorPalette>(getColors('light', 'none'));

  // Load saved preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const savedColorBlind = await AsyncStorage.getItem(COLORBLIND_STORAGE_KEY);
        
        if (savedTheme) {
          setThemeModeState(savedTheme as ThemeMode);
        }
        if (savedColorBlind) {
          setColorBlindModeState(savedColorBlind as ColorBlindMode);
        }
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  // Update colors when theme or colorblind mode changes
  useEffect(() => {
    setColors(getColors(themeMode, colorBlindMode));
  }, [themeMode, colorBlindMode]);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const setColorBlindMode = async (mode: ColorBlindMode) => {
    try {
      setColorBlindModeState(mode);
      await AsyncStorage.setItem(COLORBLIND_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving colorblind mode:', error);
    }
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    colors,
    themeMode,
    colorBlindMode,
    setThemeMode,
    setColorBlindMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}