import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityLabel="Volver atrás"
        accessibilityRole="button"
      >
        <ArrowLeft size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <ThemedText size="xlarge" weight="bold" style={styles.title}>
          Iniciar Sesión
        </ThemedText>
        
        <ThemedText variant="secondary" style={styles.subtitle}>
          Bienvenido de vuelta a FitLife
        </ThemedText>

        <View style={styles.form}>
          <ThemedInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="tu@email.com"
            error={errors.email}
            accessibilityLabel="Campo de email"
          />

          <ThemedInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            error={errors.password}
            accessibilityLabel="Campo de contraseña"
          />

          <ThemedButton
            title="Iniciar Sesión"
            variant="primary"
            size="large"
            onPress={handleLogin}
            loading={loading}
            accessibilityLabel="Botón para iniciar sesión"
            style={styles.loginButton}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  backButton: {
    marginLeft: 24,
    marginBottom: 24,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  form: {
    gap: 8,
  },
  loginButton: {
    marginTop: 16,
  },
});