import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export type ThemedViewProps = ViewProps & {
  variant?: 'primary' | 'secondary' | 'tertiary';
};

export function ThemedView({ 
  style, 
  variant = 'primary',
  ...rest 
}: ThemedViewProps) {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.backgroundSecondary;
      case 'tertiary':
        return colors.backgroundTertiary;
      default:
        return colors.background;
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: getBackgroundColor(),
        },
        style,
      ]}
      {...rest}
    />
  );
}