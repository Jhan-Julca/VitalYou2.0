import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedButton } from '@/components/ThemedButton';
import { useTheme } from '@/hooks/useTheme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Dumbbell, Clock, Zap, Users, Play, Plus, TrendingUp, RefreshCw } from 'lucide-react-native';

export default function WorkoutsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { workouts, loading, error, loadWorkouts, loadUserWorkouts } = useWorkouts();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['Todos', 'FUERZA', 'CARDIO', 'FLEXIBILIDAD', 'HIIT'];

  useEffect(() => {
    loadWorkouts();
  }, []);

  const filteredWorkouts = selectedCategory === 'Todos' 
    ? workouts 
    : workouts.filter(workout => workout.category === selectedCategory);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const handleRefresh = async () => {
    await loadWorkouts();
  };

  const addWorkout = () => {
    router.push('/create-workout');
  };

  // Función para obtener imagen según la categoría
  const getWorkoutImage = (category: string) => {
    const imageMap = {
      'FUERZA': 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400',
      'CARDIO': 'https://images.pexels.com/photos/2294400/pexels-photo-2294400.jpeg?auto=compress&cs=tinysrgb&w=400',
      'FLEXIBILIDAD': 'https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=400',
      'HIIT': 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=400',
    };
    return imageMap[category as keyof typeof imageMap] || imageMap.FUERZA;
  };

  // Función para obtener imagen alternativa según el nombre del workout
  const getWorkoutImageByName = (name: string, category: string) => {
    const nameImages = {
      // Fuerza
      'push': 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400',
      'strength': 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=400',
      'peso': 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400',
      'fuerza': 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400',
      
      // Cardio
      'running': 'https://images.pexels.com/photos/2294400/pexels-photo-2294400.jpeg?auto=compress&cs=tinysrgb&w=400',
      'cardio': 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
      'correr': 'https://images.pexels.com/photos/2525878/pexels-photo-2525878.jpeg?auto=compress&cs=tinysrgb&w=400',
      
      // HIIT
      'hiit': 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=400',
      'intenso': 'https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=400',
      
      // Flexibilidad
      'yoga': 'https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=400',
      'flex': 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400',
      'estiramiento': 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
    };

    const lowerName = name.toLowerCase();
    
    // Buscar por palabras clave en el nombre
    for (const [key, image] of Object.entries(nameImages)) {
      if (lowerName.includes(key)) {
        return image;
      }
    }
    
    // Si no encuentra nada específico, usar imagen por categoría
    return getWorkoutImage(category);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'PRINCIPIANTE':
        return colors.success;
      case 'INTERMEDIO':
        return colors.warning;
      case 'AVANZADO':
        return colors.error;
      default:
        return colors.textMuted;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'PRINCIPIANTE':
        return 'Principiante';
      case 'INTERMEDIO':
        return 'Intermedio';
      case 'AVANZADO':
        return 'Avanzado';
      default:
        return difficulty;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'FUERZA':
        return 'Fuerza';
      case 'CARDIO':
        return 'Cardio';
      case 'FLEXIBILIDAD':
        return 'Flexibilidad';
      case 'HIIT':
        return 'HIIT';
      default:
        return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fuerza':
        return <Dumbbell size={20} color={colors.primary} />;
      case 'Cardio':
        return <Zap size={20} color={colors.accent} />;
      case 'HIIT':
        return <Clock size={20} color={colors.error} />;
      case 'Flexibilidad':
        return <Users size={20} color={colors.secondary} />;
      default:
        return <Dumbbell size={20} color={colors.primary} />;
    }
  };

  const startWorkout = (workoutId: number) => {
    router.push(`/workout/${workoutId}`);
  };

  const createCustomWorkout = () => {
    router.push('/create-workout');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText size="xlarge" weight="bold" style={{ color: colors.textPrimary }}>
            Rutinas de Ejercicio
          </ThemedText>
          <ThemedText variant="secondary" style={{ color: colors.textSecondary }}>
            Elige tu entrenamiento ideal
          </ThemedText>
          
          {/* Manual Refresh Button */}
          <TouchableOpacity 
            onPress={handleRefresh}
            style={[styles.refreshButton, { backgroundColor: colors.backgroundSecondary }]}
            accessibilityLabel="Actualizar rutinas"
            accessibilityRole="button"
          >
            <RefreshCw size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category 
                    ? colors.primary 
                    : colors.backgroundSecondary,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setSelectedCategory(category)}
              accessibilityLabel={`Filtrar por categoría ${category}`}
              accessibilityRole="button"
            >
              <ThemedText
                style={{
                  color: selectedCategory === category 
                    ? colors.textPrimary 
                    : colors.textSecondary,
                }}
                weight="medium"
              >
                {category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Workouts List */}
        <View style={styles.workoutsList}>
          {loading && (
            <Card style={styles.loadingCard}>
              <ThemedText style={{ color: colors.textSecondary, textAlign: 'center' }}>
                Cargando rutinas...
              </ThemedText>
            </Card>
          )}

          {error && (
            <Card style={styles.errorCard}>
              <ThemedText style={{ color: colors.error, textAlign: 'center' }}>
                {error}
              </ThemedText>
            </Card>
          )}

          {!loading && filteredWorkouts.length === 0 && (
            <Card style={styles.emptyCard}>
              <ThemedText style={{ color: colors.textSecondary, textAlign: 'center' }}>
                No hay rutinas disponibles en esta categoría
              </ThemedText>
            </Card>
          )}

          {filteredWorkouts.map((workout) => (
            <Card key={workout.id} variant="elevated" style={styles.workoutCard}>
              <View style={styles.workoutImageContainer}>
                <Image 
                  source={{ uri: getWorkoutImageByName(workout.name, workout.category) }}
                  style={styles.workoutImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.workoutContent}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutInfo}>
                    {getCategoryIcon(getCategoryLabel(workout.category))}
                    <View style={styles.workoutTitleContainer}>
                      <ThemedText weight="bold" size="large" style={{ color: colors.textPrimary }}>
                        {workout.name}
                      </ThemedText>
                      <ThemedText variant="secondary" style={{ color: colors.textSecondary }}>
                        {getCategoryLabel(workout.category)}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                {workout.description && (
                  <ThemedText variant="secondary" style={{ color: colors.textMuted, marginBottom: 12 }}>
                    {workout.description}
                  </ThemedText>
                )}

                <View style={styles.workoutDetails}>
                  <View style={styles.detailItem}>
                    <Clock size={16} color={colors.textMuted} />
                    <ThemedText variant="muted" style={{ color: colors.textMuted }}>
                      {workout.duration} min
                    </ThemedText>
                  </View>
                  
                  <View style={styles.difficultyBadge}>
                    <ThemedText 
                      size="small" 
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(workout.difficulty) }
                      ]}
                    >
                      {getDifficultyLabel(workout.difficulty)}
                    </ThemedText>
                  </View>
                </View>

                <ThemedButton
                  title="Comenzar"
                  variant="primary"
                  onPress={() => startWorkout(workout.id)}
                  accessibilityLabel={`Comenzar rutina ${workout.name}`}
                  style={styles.startButton}
                />
              </View>
            </Card>
          ))}
        </View>

        {/* Create Custom Workout */}
        <Card style={styles.customWorkoutCard}>
          <View style={styles.customWorkoutHeader}>
            <Play size={24} color={colors.accent} />
            <ThemedText weight="bold" size="large" style={{ color: colors.textPrimary }}>
              Crear rutina personalizada
            </ThemedText>
          </View>
          <ThemedText variant="secondary" style={[styles.customWorkoutDescription, { color: colors.textSecondary }]}>
            Diseña tu propio entrenamiento adaptado a tus objetivos específicos
          </ThemedText>
          <ThemedButton
            title="Crear rutina"
            variant="accent"
            onPress={createCustomWorkout}
            accessibilityLabel="Crear una rutina personalizada"
            style={styles.createButton}
          />
        </Card>
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
    marginBottom: 24,
  },
  categoryScroll: {
    marginBottom: 24,
  },
  categoryContainer: {
    paddingRight: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  workoutsList: {
    gap: 16,
    marginBottom: 24,
  },
  workoutCard: {
    padding: 0,
    overflow: 'hidden',
  },
  workoutImageContainer: {
    position: 'relative',
    height: 160,
  },
  workoutImage: {
    width: '100%',
    height: '100%',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 20,
    padding: 6,
  },
  workoutContent: {
    padding: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  workoutDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  difficultyBadge: {
    marginLeft: 'auto',
  },
  difficultyText: {
    fontWeight: '600',
  },
  startButton: {
    marginTop: 8,
  },
  customWorkoutCard: {
    padding: 20,
    alignItems: 'center',
  },
  customWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  customWorkoutDescription: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  createButton: {
    alignSelf: 'stretch',
  },
  refreshButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    borderRadius: 20,
  },
  loadingCard: {
    padding: 20,
  },
  errorCard: {
    padding: 20,
  },
  emptyCard: {
    padding: 20,
  },
});