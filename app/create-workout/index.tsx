import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { useTheme } from '@/hooks/useTheme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Plus, Minus, Dumbbell, Clock, Target } from 'lucide-react-native';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  category: string;
}

interface WorkoutForm {
  name: string;
  category: string;
  difficulty: string;
  exercises: Exercise[];
}

const exerciseTemplates = [
  { name: 'Push-ups', category: 'Fuerza', defaultSets: 3, defaultReps: '10-15', defaultRest: 45 },
  { name: 'Squats', category: 'Fuerza', defaultSets: 3, defaultReps: '15', defaultRest: 30 },
  { name: 'Jumping Jacks', category: 'Cardio', defaultSets: 3, defaultReps: '20', defaultRest: 30 },
  { name: 'Burpees', category: 'HIIT', defaultSets: 4, defaultReps: '10', defaultRest: 45 },
  { name: 'Plancha', category: 'Core', defaultSets: 3, defaultReps: '30 seg', defaultRest: 30 },
  { name: 'Lunges', category: 'Fuerza', defaultSets: 3, defaultReps: '12 cada pierna', defaultRest: 45 },
  { name: 'Mountain Climbers', category: 'HIIT', defaultSets: 4, defaultReps: '20', defaultRest: 30 },
  { name: 'Deadlifts', category: 'Fuerza', defaultSets: 4, defaultReps: '8-10', defaultRest: 90 },
];

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { createUserWorkout } = useWorkouts();
  const { user } = useAuth();
  
  const [workoutForm, setWorkoutForm] = useState<WorkoutForm>({
    name: '',
    category: 'Fuerza',
    difficulty: 'Principiante',
    exercises: []
  });

  const categories = ['Fuerza', 'Cardio', 'HIIT', 'Flexibilidad'];
  const difficulties = ['Principiante', 'Intermedio', 'Avanzado'];

  const addExercise = (template: typeof exerciseTemplates[0]) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: template.name,
      sets: template.defaultSets,
      reps: template.defaultReps,
      restTime: template.defaultRest,
      category: template.category
    };
    
    setWorkoutForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const updateExercise = (exerciseId: string, field: keyof Exercise, value: any) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const saveWorkout = async () => {
    if (!workoutForm.name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la rutina');
      return;
    }
    
    if (workoutForm.exercises.length === 0) {
      Alert.alert('Error', 'Agrega al menos un ejercicio a la rutina');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Debes estar logueado para crear una rutina');
      return;
    }

    // Calculate estimated duration based on exercises
    const estimatedDuration = workoutForm.exercises.reduce((total, exercise) => {
      // Estimate: (sets * 30 seconds for exercise) + (sets * rest time) = total time per exercise
      const exerciseTime = (exercise.sets * 0.5) + (exercise.sets * (exercise.restTime / 60));
      return total + exerciseTime;
    }, 0);

    // Map category and difficulty to backend format
    const categoryMap: { [key: string]: 'FUERZA' | 'CARDIO' | 'FLEXIBILIDAD' | 'HIIT' } = {
      'Fuerza': 'FUERZA',
      'Cardio': 'CARDIO',
      'Flexibilidad': 'FLEXIBILIDAD',
      'HIIT': 'HIIT'
    };

    const difficultyMap: { [key: string]: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO' } = {
      'Principiante': 'PRINCIPIANTE',
      'Intermedio': 'INTERMEDIO',
      'Avanzado': 'AVANZADO'
    };

    try {
      const success = await createUserWorkout(parseInt(user.id), {
        name: workoutForm.name,
        description: `Rutina personalizada con ${workoutForm.exercises.length} ejercicios: ${workoutForm.exercises.map(e => e.name).join(', ')}`,
        duration: Math.ceil(estimatedDuration),
        category: categoryMap[workoutForm.category],
        difficulty: difficultyMap[workoutForm.difficulty]
      });

      if (success) {
        Alert.alert(
          '¡Rutina creada!',
          `Has creado la rutina "${workoutForm.name}" con ${workoutForm.exercises.length} ejercicios.`,
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('Error', 'No se pudo crear la rutina. Intenta de nuevo.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al crear la rutina.');
      console.error('Error creating workout:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Volver atrás"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <ThemedText size="large" weight="bold" style={{ color: colors.textPrimary }}>
              Crear Rutina
            </ThemedText>
            <ThemedText variant="secondary" style={{ color: colors.textSecondary }}>
              Diseña tu entrenamiento personalizado
            </ThemedText>
          </View>
        </View>

        {/* Workout Details */}
        <Card style={styles.detailsCard}>
          <ThemedText weight="bold" size="large" style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Detalles de la rutina
          </ThemedText>
          
          <ThemedInput
            label="Nombre de la rutina"
            value={workoutForm.name}
            onChangeText={(value) => setWorkoutForm(prev => ({ ...prev, name: value }))}
            placeholder="Ej: Mi rutina matutina"
            accessibilityLabel="Nombre de la rutina"
          />

          <View style={styles.selectorsContainer}>
            <View style={styles.selectorGroup}>
              <ThemedText weight="medium" style={[styles.selectorLabel, { color: colors.textPrimary }]}>
                Categoría
              </ThemedText>
              <View style={styles.selectorOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.selectorOption,
                      {
                        backgroundColor: workoutForm.category === category 
                          ? colors.primary 
                          : colors.backgroundSecondary,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setWorkoutForm(prev => ({ ...prev, category }))}
                    accessibilityLabel={`Seleccionar categoría ${category}`}
                    accessibilityRole="button"
                  >
                    <ThemedText
                      size="small"
                      style={{
                        color: workoutForm.category === category 
                          ? colors.textPrimary 
                          : colors.textSecondary,
                      }}
                    >
                      {category}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.selectorGroup}>
              <ThemedText weight="medium" style={[styles.selectorLabel, { color: colors.textPrimary }]}>
                Dificultad
              </ThemedText>
              <View style={styles.selectorOptions}>
                {difficulties.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.selectorOption,
                      {
                        backgroundColor: workoutForm.difficulty === difficulty 
                          ? colors.accent 
                          : colors.backgroundSecondary,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setWorkoutForm(prev => ({ ...prev, difficulty }))}
                    accessibilityLabel={`Seleccionar dificultad ${difficulty}`}
                    accessibilityRole="button"
                  >
                    <ThemedText
                      size="small"
                      style={{
                        color: workoutForm.difficulty === difficulty 
                          ? colors.textPrimary 
                          : colors.textSecondary,
                      }}
                    >
                      {difficulty}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Card>

        {/* Exercise Templates */}
        <Card style={styles.templatesCard}>
          <ThemedText weight="bold" size="large" style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Agregar ejercicios
          </ThemedText>
          
          <View style={styles.exerciseTemplates}>
            {exerciseTemplates.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.exerciseTemplate, { borderColor: colors.border }]}
                onPress={() => addExercise(template)}
                accessibilityLabel={`Agregar ejercicio ${template.name}`}
                accessibilityRole="button"
              >
                <View style={styles.templateInfo}>
                  <ThemedText weight="medium" style={{ color: colors.textPrimary }}>
                    {template.name}
                  </ThemedText>
                  <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                    {template.category} • {template.defaultSets} sets • {template.defaultReps} reps
                  </ThemedText>
                </View>
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Selected Exercises */}
        {workoutForm.exercises.length > 0 && (
          <Card style={styles.exercisesCard}>
            <ThemedText weight="bold" size="large" style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Ejercicios seleccionados ({workoutForm.exercises.length})
            </ThemedText>
            
            <View style={styles.exercisesList}>
              {workoutForm.exercises.map((exercise, index) => (
                <View key={exercise.id} style={[styles.exerciseItem, { borderColor: colors.border }]}>
                  <View style={styles.exerciseHeader}>
                    <View style={styles.exerciseNumber}>
                      <ThemedText weight="bold" style={{ color: colors.primary }}>
                        {index + 1}
                      </ThemedText>
                    </View>
                    <View style={styles.exerciseInfo}>
                      <ThemedText weight="bold" style={{ color: colors.textPrimary }}>
                        {exercise.name}
                      </ThemedText>
                      <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                        {exercise.category}
                      </ThemedText>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeExercise(exercise.id)}
                      style={styles.removeButton}
                      accessibilityLabel={`Eliminar ejercicio ${exercise.name}`}
                      accessibilityRole="button"
                    >
                      <Minus size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.exerciseControls}>
                    <View style={styles.controlGroup}>
                      <ThemedText size="small" style={{ color: colors.textSecondary }}>Sets</ThemedText>
                      <View style={styles.numberControl}>
                        <TouchableOpacity
                          onPress={() => updateExercise(exercise.id, 'sets', Math.max(1, exercise.sets - 1))}
                          style={[styles.controlButton, { backgroundColor: colors.error }]}
                        >
                          <Minus size={12} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <ThemedText weight="bold" style={{ color: colors.textPrimary }}>
                          {exercise.sets}
                        </ThemedText>
                        <TouchableOpacity
                          onPress={() => updateExercise(exercise.id, 'sets', exercise.sets + 1)}
                          style={[styles.controlButton, { backgroundColor: colors.success }]}
                        >
                          <Plus size={12} color={colors.textPrimary} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.controlGroup}>
                      <ThemedText size="small" style={{ color: colors.textSecondary }}>Descanso (seg)</ThemedText>
                      <View style={styles.numberControl}>
                        <TouchableOpacity
                          onPress={() => updateExercise(exercise.id, 'restTime', Math.max(15, exercise.restTime - 15))}
                          style={[styles.controlButton, { backgroundColor: colors.error }]}
                        >
                          <Minus size={12} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <ThemedText weight="bold" style={{ color: colors.textPrimary }}>
                          {exercise.restTime}
                        </ThemedText>
                        <TouchableOpacity
                          onPress={() => updateExercise(exercise.id, 'restTime', exercise.restTime + 15)}
                          style={[styles.controlButton, { backgroundColor: colors.success }]}
                        >
                          <Plus size={12} color={colors.textPrimary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Save Button */}
        <ThemedButton
          title="Guardar rutina"
          variant="primary"
          onPress={saveWorkout}
          accessibilityLabel="Guardar rutina personalizada"
          style={styles.saveButton}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
  },
  detailsCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  selectorsContainer: {
    gap: 16,
  },
  selectorGroup: {
    gap: 8,
  },
  selectorLabel: {
    marginBottom: 4,
  },
  selectorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  templatesCard: {
    marginBottom: 20,
  },
  exerciseTemplates: {
    gap: 12,
  },
  exerciseTemplate: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  templateInfo: {
    flex: 1,
  },
  exercisesCard: {
    marginBottom: 20,
  },
  exercisesList: {
    gap: 16,
  },
  exerciseItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  exerciseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  exerciseControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlGroup: {
    alignItems: 'center',
    gap: 8,
  },
  numberControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    marginTop: 20,
  },
});