import React, { useState } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from './ThemedText';

export type ThemedInputProps = TextInputProps & {
  label?: string;
  error?: string;
  accessibilityLabel: string;
};

export function ThemedInput({ 
  label,
  error,
  style,
  accessibilityLabel,
  ...rest 
}: ThemedInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText variant="secondary" style={styles.label}>
          {label}
        </ThemedText>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
            color: colors.textPrimary,
          },
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={accessibilityLabel}
        {...rest}
      />
      {error && (
        <ThemedText style={[styles.error, { color: colors.error }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 44,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});