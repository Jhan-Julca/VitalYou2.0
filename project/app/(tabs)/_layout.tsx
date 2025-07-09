import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Home, Dumbbell, TrendingUp, Apple, User } from 'lucide-react-native';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: colors.tabBarActiveTint,
        tabBarInactiveTintColor: colors.tabBarInactiveTint,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Pantalla de inicio',
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Rutinas',
          tabBarIcon: ({ size, color }) => (
            <Dumbbell size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Pantalla de rutinas de ejercicio',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Pantalla de progreso',
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrición',
          tabBarIcon: ({ size, color }) => (
            <Apple size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Pantalla de nutrición',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Pantalla de perfil de usuario',
        }}
      />
    </Tabs>
  );
}