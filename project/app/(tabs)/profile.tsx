import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Eye, 
  LogOut, 
  Edit3, 
  Save,
  X 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { colors, themeMode, colorBlindMode, setThemeMode, setColorBlindMode, toggleTheme } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    weight: user?.weight?.toString() || '',
    height: user?.height?.toString() || '',
    age: user?.age?.toString() || '',
    fitnessGoal: user?.fitnessGoal || '',
  });

  const colorBlindOptions = [
    { value: 'none', label: 'Normal' },
    { value: 'protanopia', label: 'Protanopía' },
    { value: 'deuteranopia', label: 'Deuteranopía' },
    { value: 'tritanopia', label: 'Tritanopía' },
  ];

  const handleSave = async () => {
    try {
      await updateUser({
        name: editData.name,
        weight: editData.weight ? parseFloat(editData.weight) : undefined,
        height: editData.height ? parseFloat(editData.height) : undefined,
        age: editData.age ? parseInt(editData.age) : undefined,
        fitnessGoal: editData.fitnessGoal,
      });
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      weight: user?.weight?.toString() || '',
      height: user?.height?.toString() || '',
      age: user?.age?.toString() || '',
      fitnessGoal: user?.fitnessGoal || '',
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    const confirm = await new Promise((resolve) => {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que quieres cerrar sesión?',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Cerrar sesión', style: 'destructive', onPress: () => resolve(true) },
        ]
      );
    });
    if (confirm) {
      await logout();
      router.replace('/auth/login');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <User size={32} color={colors.textPrimary} />
          </View>
          <ThemedText size="xlarge" weight="bold">
            {user?.name || 'Usuario'}
          </ThemedText>
          <ThemedText variant="secondary">
            {user?.email}
          </ThemedText>
        </View>

        {/* Profile Information */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <ThemedText size="large" weight="bold">
              Información personal
            </ThemedText>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              accessibilityLabel={isEditing ? "Cancelar edición" : "Editar perfil"}
              accessibilityRole="button"
            >
              {isEditing ? (
                <X size={20} color={colors.textMuted} />
              ) : (
                <Edit3 size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <ThemedInput
                label="Nombre"
                value={editData.name}
                onChangeText={(value) => setEditData(prev => ({ ...prev, name: value }))}
                accessibilityLabel="Campo de nombre"
              />
              <ThemedInput
                label="Peso (kg)"
                value={editData.weight}
                onChangeText={(value) => setEditData(prev => ({ ...prev, weight: value }))}
                keyboardType="numeric"
                accessibilityLabel="Campo de peso en kilogramos"
              />
              <ThemedInput
                label="Altura (cm)"
                value={editData.height}
                onChangeText={(value) => setEditData(prev => ({ ...prev, height: value }))}
                keyboardType="numeric"
                accessibilityLabel="Campo de altura en centímetros"
              />
              <ThemedInput
                label="Edad"
                value={editData.age}
                onChangeText={(value) => setEditData(prev => ({ ...prev, age: value }))}
                keyboardType="numeric"
                accessibilityLabel="Campo de edad"
              />
              <ThemedInput
                label="Objetivo fitness"
                value={editData.fitnessGoal}
                onChangeText={(value) => setEditData(prev => ({ ...prev, fitnessGoal: value }))}
                placeholder="Ej: Perder peso, ganar músculo..."
                accessibilityLabel="Campo de objetivo fitness"
              />
              
              <View style={styles.editButtons}>
                <ThemedButton
                  title="Cancelar"
                  variant="outline"
                  onPress={handleCancel}
                  accessibilityLabel="Cancelar edición de perfil"
                  style={{ flex: 1 }}
                />
                <ThemedButton
                  title="Guardar"
                  variant="primary"
                  onPress={handleSave}
                  accessibilityLabel="Guardar cambios del perfil"
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <ThemedText variant="secondary">Peso:</ThemedText>
                <ThemedText weight="medium">
                  {user?.weight ? `${user.weight} kg` : 'No especificado'}
                </ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText variant="secondary">Altura:</ThemedText>
                <ThemedText weight="medium">
                  {user?.height ? `${user.height} cm` : 'No especificado'}
                </ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText variant="secondary">Edad:</ThemedText>
                <ThemedText weight="medium">
                  {user?.age ? `${user.age} años` : 'No especificado'}
                </ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText variant="secondary">Objetivo:</ThemedText>
                <ThemedText weight="medium">
                  {user?.fitnessGoal || 'No especificado'}
                </ThemedText>
              </View>
            </View>
          )}
        </Card>

        {/* Theme Settings */}
        <Card style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Settings size={20} color={colors.primary} />
            <ThemedText size="large" weight="bold">
              Configuración de tema
            </ThemedText>
          </View>

          {/* Theme Toggle */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={toggleTheme}
            accessibilityLabel={`Cambiar a modo ${themeMode === 'light' ? 'oscuro' : 'claro'}`}
            accessibilityRole="button"
          >
            <View style={styles.settingLeft}>
              {themeMode === 'light' ? (
                <Moon size={20} color={colors.textMuted} />
              ) : (
                <Sun size={20} color={colors.textMuted} />
              )}
              <ThemedText>Modo oscuro</ThemedText>
            </View>
            <View style={[
              styles.toggle,
              { backgroundColor: themeMode === 'dark' ? colors.primary : colors.borderLight }
            ]}>
              <View style={[
                styles.toggleButton,
                {
                  backgroundColor: colors.background,
                  transform: [{ translateX: themeMode === 'dark' ? 20 : 2 }]
                }
              ]} />
            </View>
          </TouchableOpacity>

          {/* Color Blind Mode */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Eye size={20} color={colors.textMuted} />
              <ThemedText>Modo de daltonismo</ThemedText>
            </View>
          </View>
          
          <View style={styles.colorBlindOptions}>
            {colorBlindOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.colorBlindOption,
                  {
                    backgroundColor: colorBlindMode === option.value 
                      ? colors.primary 
                      : colors.backgroundSecondary,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => setColorBlindMode(option.value as any)}
                accessibilityLabel={`Seleccionar modo ${option.label}`}
                accessibilityRole="button"
              >
                <ThemedText
                  style={{
                    color: colorBlindMode === option.value 
                      ? colors.textPrimary 
                      : colors.textSecondary,
                  }}
                  weight="medium"
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* App Info */}
        <Card style={styles.infoCard}>
          <ThemedText size="large" weight="bold" style={styles.cardTitle}>
            Acerca de la app
          </ThemedText>
          <ThemedText variant="secondary" style={styles.appInfo}>
            FitLife v1.0.0
          </ThemedText>
          <ThemedText variant="secondary" style={styles.appInfo}>
            Tu compañero perfecto para un estilo de vida saludable
          </ThemedText>
        </Card>

        {/* Logout */}
        <ThemedButton
          title="Cerrar sesión"
          variant="outline"
          onPress={handleLogout}
          accessibilityLabel="Cerrar sesión de la aplicación"
          style={[styles.logoutButton, { borderColor: colors.error }]}
        />
        <ThemedButton
          title="Registrar"
          variant="primary"
          onPress={() => router.push('/auth/register')}
          accessibilityLabel="Ir a la pantalla de registro"
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileCard: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  profileInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editForm: {
    gap: 8,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  settingsCard: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  colorBlindOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  colorBlindOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  infoCard: {
    marginBottom: 20,
  },
  appInfo: {
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 20,
  },
});