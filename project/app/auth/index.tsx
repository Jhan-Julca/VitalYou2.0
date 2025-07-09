import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { Heart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function AuthIndexScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Heart size={64} color={colors.primary} />
        <ThemedText size="xlarge" weight="bold" style={styles.title}>
          FitLife
        </ThemedText>
        <ThemedText variant="secondary" style={styles.subtitle}>
          Tu compañero perfecto para un estilo de vida saludable
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Iniciar Sesión"
          variant="primary"
          size="large"
          onPress={() => router.push('/auth/login')}
          accessibilityLabel="Ir a la pantalla de inicio de sesión"
          style={styles.button}
        />
        
        <ThemedButton
          title="Crear Cuenta"
          variant="outline"
          size="large"
          onPress={() => router.push('/auth/register')}
          accessibilityLabel="Ir a la pantalla de registro"
          style={styles.button}
        />
      </View>

      <ThemedText variant="muted" style={styles.footer}>
        Comienza tu transformación hoy mismo
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  button: {
    width: '100%',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
  },
});