export interface ColorPalette {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // Accent colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  accent: string;
  accentLight: string;
  accentDark: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // UI elements
  border: string;
  borderLight: string;
  shadow: string;
  
  // Tab navigation
  tabBarBackground: string;
  tabBarActiveTint: string;
  tabBarInactiveTint: string;
}

// Base light theme - Colores más contrastados
const baseLightColors: ColorPalette = {
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#E9ECEF',
  
  textPrimary: '#212529',
  textSecondary: '#495057',
  textMuted: '#6C757D',
  
  primary: '#0D6EFD',
  primaryLight: '#6EA8FE',
  primaryDark: '#0A58CA',
  
  secondary: '#198754',
  secondaryLight: '#75B798',
  secondaryDark: '#146C43',
  
  accent: '#DC3545',
  accentLight: '#F1959B',
  accentDark: '#B02A37',
  
  success: '#198754',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#0DCAF0',
  
  border: '#DEE2E6',
  borderLight: '#F8F9FA',
  shadow: 'rgba(0, 0, 0, 0.15)',
  
  tabBarBackground: '#FFFFFF',
  tabBarActiveTint: '#0D6EFD',
  tabBarInactiveTint: '#6C757D',
};

// Dark theme - Colores más contrastados
const baseDarkColors: ColorPalette = {
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  backgroundTertiary: '#2D2D2D',
  
  textPrimary: '#FFFFFF',
  textSecondary: '#E0E0E0',
  textMuted: '#BDBDBD',
  
  primary: '#6EA8FE',
  primaryLight: '#9EC5FE',
  primaryDark: '#3D8BFD',
  
  secondary: '#75B798',
  secondaryLight: '#A3D5B7',
  secondaryDark: '#52A571',
  
  accent: '#F1959B',
  accentLight: '#F5B7BB',
  accentDark: '#ED6C7A',
  
  success: '#75B798',
  warning: '#FFDA6A',
  error: '#F1959B',
  info: '#6EDFF6',
  
  border: '#404040',
  borderLight: '#2D2D2D',
  shadow: 'rgba(0, 0, 0, 0.4)',
  
  tabBarBackground: '#1E1E1E',
  tabBarActiveTint: '#6EA8FE',
  tabBarInactiveTint: '#BDBDBD',
};

// Protanopia - Dificultad para ver rojos
const protanopiaLightColors: ColorPalette = {
  ...baseLightColors,
  primary: '#0D6EFD',
  primaryLight: '#6EA8FE',
  primaryDark: '#0A58CA',
  
  accent: '#FFC107',
  accentLight: '#FFDA6A',
  accentDark: '#FFAB00',
  
  error: '#FFC107',
  success: '#198754',
  
  tabBarActiveTint: '#0D6EFD',
};

const protanopiaDarkColors: ColorPalette = {
  ...baseDarkColors,
  primary: '#6EA8FE',
  primaryLight: '#9EC5FE',
  primaryDark: '#3D8BFD',
  
  accent: '#FFDA6A',
  accentLight: '#FFE69C',
  accentDark: '#FFCD39',
  
  error: '#FFDA6A',
  success: '#75B798',
  
  tabBarActiveTint: '#6EA8FE',
};

// Deuteranopia - Dificultad para ver verdes
const deuteranopiaLightColors: ColorPalette = {
  ...baseLightColors,
  secondary: '#6F42C1',
  secondaryLight: '#A98EDA',
  secondaryDark: '#59359A',
  
  success: '#6F42C1',
  primary: '#FD7E14',
  primaryLight: '#FFA94D',
  primaryDark: '#E8590C',
  
  tabBarActiveTint: '#FD7E14',
};

const deuteranopiaDarkColors: ColorPalette = {
  ...baseDarkColors,
  secondary: '#A98EDA',
  secondaryLight: '#C29FDD',
  secondaryDark: '#9775CD',
  
  success: '#A98EDA',
  primary: '#FFA94D',
  primaryLight: '#FFB366',
  primaryDark: '#FF9500',
  
  tabBarActiveTint: '#FFA94D',
};

// Tritanopia - Dificultad para ver azules
const tritanopiaLightColors: ColorPalette = {
  ...baseLightColors,
  primary: '#DC3545',
  primaryLight: '#F1959B',
  primaryDark: '#B02A37',
  
  info: '#DC3545',
  accent: '#198754',
  accentLight: '#75B798',
  accentDark: '#146C43',
  
  tabBarActiveTint: '#DC3545',
};

const tritanopiaDarkColors: ColorPalette = {
  ...baseDarkColors,
  primary: '#F1959B',
  primaryLight: '#F5B7BB',
  primaryDark: '#ED6C7A',
  
  info: '#F1959B',
  accent: '#75B798',
  accentLight: '#A3D5B7',
  accentDark: '#52A571',
  
  tabBarActiveTint: '#F1959B',
};

export type ThemeMode = 'light' | 'dark';
export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

export const getColors = (mode: ThemeMode, colorBlindMode: ColorBlindMode): ColorPalette => {
  const isLight = mode === 'light';
  
  switch (colorBlindMode) {
    case 'protanopia':
      return isLight ? protanopiaLightColors : protanopiaDarkColors;
    case 'deuteranopia':
      return isLight ? deuteranopiaLightColors : deuteranopiaDarkColors;
    case 'tritanopia':
      return isLight ? tritanopiaLightColors : tritanopiaDarkColors;
    default:
      return isLight ? baseLightColors : baseDarkColors;
  }
};

export default {
  light: baseLightColors,
  dark: baseDarkColors,
  getColors,
};