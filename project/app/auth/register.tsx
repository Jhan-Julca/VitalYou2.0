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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { register } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const success = await register(formData.email, formData.password, formData.name);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'No se pudo crear la cuenta');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          Crear Cuenta
        </ThemedText>
        
        <ThemedText variant="secondary" style={styles.subtitle}>
          Únete a la comunidad FitLife
        </ThemedText>

        <View style={styles.form}>
          <ThemedInput
            label="Nombre completo"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            placeholder="Tu nombre"
            error={errors.name}
            accessibilityLabel="Campo de nombre completo"
          />

          <ThemedInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="tu@email.com"
            error={errors.email}
            accessibilityLabel="Campo de email"
          />

          <ThemedInput
            label="Contraseña"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            secureTextEntry
            placeholder="••••••••"
            error={errors.password}
            accessibilityLabel="Campo de contraseña"
          />

          <ThemedInput
            label="Confirmar contraseña"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            secureTextEntry
            placeholder="••••••••"
            error={errors.confirmPassword}
            accessibilityLabel="Campo de confirmación de contraseña"
          />

          <ThemedButton
            title="Crear Cuenta"
            variant="primary"
            size="large"
            onPress={handleRegister}
            loading={loading}
            accessibilityLabel="Botón para crear cuenta"
            style={styles.registerButton}
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
  registerButton: {
    marginTop: 16,
  },
});