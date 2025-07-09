import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export type ThemedTextProps = TextProps & {
  variant?: 'primary' | 'secondary' | 'muted';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  weight?: 'normal' | 'medium' | 'bold';
};

export function ThemedText({ 
  style, 
  variant = 'primary', 
  size = 'medium',
  weight = 'normal',
  ...rest 
}: ThemedTextProps) {
  const { colors } = useTheme();

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.textSecondary;
      case 'muted':
        return colors.textMuted;
      default:
        return colors.textPrimary;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 18;
      case 'xlarge':
        return 24;
      default:
        return 16;
    }
  };

  const getFontWeight = (): any => {
    switch (weight) {
      case 'medium':
        return '500';
      case 'bold':
        return '700';
      default:
        return '400';
    }
  };

  return (
    <Text
      style={[
        {
          color: getTextColor(),
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
        },
        style,
      ]}
      {...rest}
    />
  );
}