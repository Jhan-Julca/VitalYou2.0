import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Vibration } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedButton } from '@/components/ThemedButton';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Play, Pause, RotateCcw, CircleCheck as CheckCircle, Timer, Dumbbell, Plus, Minus, Coffee } from 'lucide-react-native';
import { Platform } from 'react-native';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number; // seconds
  instructions: string[];
  targetMuscles: string[];
}

interface WorkoutData {
  id: string;
  name: string;
  exercises: Exercise[];
  totalDuration: number;
}

interface ExerciseProgress {
  exerciseId: string;
  completedSets: number;
  currentReps: number[];
  isCompleted: boolean;
}

const workoutData: { [key: string]: WorkoutData } = {
  '1': {
    id: '1',
    name: 'Rutina matutina energizante',
    totalDuration: 20,
    exercises: [
      {
        id: 'e1',
        name: 'Jumping Jacks',
        sets: 3,
        reps: '20',
        restTime: 30,
        instructions: [
          'Párate con los pies juntos y los brazos a los lados',
          'Salta separando las piernas y levantando los brazos',
          'Regresa a la posición inicial',
          'Mantén un ritmo constante'
        ],
        targetMuscles: ['Cardio', 'Piernas', 'Brazos']
      },
      {
        id: 'e2',
        name: 'Push-ups',
        sets: 3,
        reps: '10-15',
        restTime: 45,
        instructions: [
          'Posición de plancha con manos bajo los hombros',
          'Baja el pecho hacia el suelo',
          'Empuja hacia arriba manteniendo el cuerpo recto',
          'Modifica en rodillas si es necesario'
        ],
        targetMuscles: ['Pecho', 'Brazos', 'Core']
      },
      {
        id: 'e3',
        name: 'Squats',
        sets: 3,
        reps: '15',
        restTime: 30,
        instructions: [
          'Párate con pies separados al ancho de hombros',
          'Baja como si te fueras a sentar',
          'Mantén la espalda recta y rodillas alineadas',
          'Regresa a la posición inicial'
        ],
        targetMuscles: ['Piernas', 'Glúteos', 'Core']
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Fuerza para todo el cuerpo',
    totalDuration: 45,
    exercises: [
      {
        id: 'e4',
        name: 'Deadlifts',
        sets: 4,
        reps: '8-10',
        restTime: 90,
        instructions: [
          'Párate con pies separados al ancho de caderas',
          'Agarra la barra con manos separadas',
          'Mantén la espalda recta al levantar',
          'Extiende caderas y rodillas simultáneamente'
        ],
        targetMuscles: ['Espalda', 'Piernas', 'Glúteos']
      },
      {
        id: 'e5',
        name: 'Bench Press',
        sets: 4,
        reps: '8-12',
        restTime: 120,
        instructions: [
          'Acuéstate en el banco con pies firmes en el suelo',
          'Agarra la barra con manos separadas',
          'Baja la barra al pecho controladamente',
          'Empuja hacia arriba con fuerza'
        ],
        targetMuscles: ['Pecho', 'Brazos', 'Hombros']
      }
    ]
  },
  '3': {
    id: '3',
    name: 'HIIT quemagrasa',
    totalDuration: 30,
    exercises: [
      {
        id: 'e6',
        name: 'Burpees',
        sets: 4,
        reps: '10',
        restTime: 45,
        instructions: [
          'Comienza de pie',
          'Baja a posición de cuclillas y coloca las manos en el suelo',
          'Salta hacia atrás a posición de plancha',
          'Haz una flexión, salta hacia adelante y salta arriba'
        ],
        targetMuscles: ['Todo el cuerpo', 'Cardio']
      },
      {
        id: 'e7',
        name: 'Mountain Climbers',
        sets: 4,
        reps: '20',
        restTime: 30,
        instructions: [
          'Comienza en posición de plancha',
          'Lleva una rodilla hacia el pecho',
          'Alterna rápidamente las piernas',
          'Mantén el core activado'
        ],
        targetMuscles: ['Core', 'Cardio', 'Brazos']
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Yoga y estiramiento',
    totalDuration: 25,
    exercises: [
      {
        id: 'e8',
        name: 'Perro boca abajo',
        sets: 3,
        reps: '30 seg',
        restTime: 15,
        instructions: [
          'Comienza en cuatro patas',
          'Levanta las caderas hacia arriba',
          'Forma una V invertida con tu cuerpo',
          'Mantén la respiración profunda'
        ],
        targetMuscles: ['Flexibilidad', 'Brazos', 'Espalda']
      },
      {
        id: 'e9',
        name: 'Guerrero I',
        sets: 2,
        reps: '30 seg cada lado',
        restTime: 20,
        instructions: [
          'Da un paso largo hacia adelante',
          'Dobla la rodilla delantera 90 grados',
          'Levanta los brazos hacia arriba',
          'Mantén la postura y respira'
        ],
        targetMuscles: ['Flexibilidad', 'Piernas', 'Balance']
      }
    ]
  },
  '5': {
    id: '5',
    name: 'Cardio intenso',
    totalDuration: 35,
    exercises: [
      {
        id: 'e10',
        name: 'High Knees',
        sets: 4,
        reps: '30 seg',
        restTime: 30,
        instructions: [
          'Corre en el lugar',
          'Levanta las rodillas lo más alto posible',
          'Mantén un ritmo rápido',
          'Usa los brazos para impulso'
        ],
        targetMuscles: ['Cardio', 'Piernas', 'Core']
      },
      {
        id: 'e11',
        name: 'Jump Squats',
        sets: 4,
        reps: '15',
        restTime: 45,
        instructions: [
          'Comienza en posición de squat',
          'Salta explosivamente hacia arriba',
          'Aterriza suavemente en squat',
          'Repite inmediatamente'
        ],
        targetMuscles: ['Piernas', 'Glúteos', 'Cardio']
      }
    ]
  }
};

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  
  // Temporal: usar rutina por defecto si no se encuentra la rutina específica
  const [workout] = useState<WorkoutData | null>(() => {
    if (id && workoutData[id]) {
      return workoutData[id];
    }
    // Si no se encuentra la rutina específica, usar la primera como fallback
    return workoutData['1'];
  });

  // Mostrar mensaje si es una rutina personalizada
  const isCustomWorkout = id && !workoutData[id];
  
  useEffect(() => {
    if (isCustomWorkout) {
      Alert.alert(
        'Rutina personalizada',
        'Esta es una rutina personalizada. Usando rutina de demostración por ahora.',
        [{ text: 'Entendido' }]
      );
    }
  }, [isCustomWorkout]);
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [workoutStartTime] = useState(Date.now());
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([]);
  const [currentReps, setCurrentReps] = useState(0);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [exerciseTimeElapsed, setExerciseTimeElapsed] = useState(0);
  
  const restTimerRef = useRef<number | null>(null);
  const exerciseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (workout) {
      const initialProgress = workout.exercises.map(exercise => ({
        exerciseId: exercise.id,
        completedSets: 0,
        currentReps: [],
        isCompleted: false
      }));
      setExerciseProgress(initialProgress);
    }
  }, [workout]);

  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      restTimerRef.current = setTimeout(() => {
        setRestTimeLeft(restTimeLeft - 1);
      }, 1000);
    } else if (isResting && restTimeLeft === 0) {
      setIsResting(false);
      // Vibration feedback when rest is complete
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 500, 200, 500]);
      }
      Alert.alert('¡Descanso terminado!', 'Es hora de continuar con el siguiente set');
    }

    return () => {
      if (restTimerRef.current) {
        clearTimeout(restTimerRef.current);
      }
    };
  }, [isResting, restTimeLeft]);

  useEffect(() => {
    if (isExerciseActive) {
      exerciseTimerRef.current = setTimeout(() => {
        setExerciseTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (exerciseTimerRef.current) {
        clearTimeout(exerciseTimerRef.current);
      }
    };
  }, [isExerciseActive, exerciseTimeElapsed]);

  if (!workout) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={{ color: colors.textPrimary }}>Rutina no encontrada</ThemedText>
          <ThemedButton
            title="Volver"
            variant="primary"
            onPress={() => router.back()}
            accessibilityLabel="Volver a rutinas"
          />
        </View>
      </ThemedView>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentProgress = exerciseProgress.find(p => p.exerciseId === currentExercise?.id);

  const startExercise = () => {
    setIsExerciseActive(true);
    setExerciseTimeElapsed(0);
  };

  const pauseExercise = () => {
    setIsExerciseActive(false);
  };

  const completeSet = () => {
    if (!currentExercise || !currentProgress) return;

    const updatedProgress = exerciseProgress.map(progress => {
      if (progress.exerciseId === currentExercise.id) {
        const newCompletedSets = progress.completedSets + 1;
        const newCurrentReps = [...progress.currentReps, currentReps];
        const isCompleted = newCompletedSets >= currentExercise.sets;
        
        return {
          ...progress,
          completedSets: newCompletedSets,
          currentReps: newCurrentReps,
          isCompleted
        };
      }
      return progress;
    });

    setExerciseProgress(updatedProgress);
    setCurrentReps(0);
    setIsExerciseActive(false);
    setExerciseTimeElapsed(0);

    if (currentSet < currentExercise.sets) {
      // Start rest period
      setIsResting(true);
      setRestTimeLeft(currentExercise.restTime);
      setCurrentSet(currentSet + 1);
    } else {
      // Exercise completed, move to next
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        Alert.alert(
          '¡Ejercicio completado!',
          `Has terminado ${currentExercise.name}. ¡Excelente trabajo!`
        );
      } else {
        // Workout completed
        completeWorkout();
      }
    }
  };

  const completeWorkout = () => {
    const totalTime = Math.floor((Date.now() - workoutStartTime) / 1000 / 60);
    Alert.alert(
      '¡Rutina completada! 🎉',
      `Has terminado ${workout.name} en ${totalTime} minutos. ¡Felicitaciones!`,
      [
        {
          text: 'Volver a rutinas',
          onPress: () => router.push('/(tabs)/workouts')
        }
      ]
    );
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
    if (restTimerRef.current) {
      clearTimeout(restTimerRef.current);
      restTimerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustReps = (increment: boolean) => {
    if (increment) {
      setCurrentReps(prev => prev + 1);
    } else {
      setCurrentReps(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/workouts')}
            style={styles.backButton}
            accessibilityLabel="Volver a rutinas"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <ThemedText size="large" weight="bold" style={{ color: colors.textPrimary }}>
              {workout.name}
            </ThemedText>
            <ThemedText variant="secondary" style={{ color: colors.textSecondary }}>
              Ejercicio {currentExerciseIndex + 1} de {workout.exercises.length}
            </ThemedText>
          </View>
        </View>

        {/* Progress Bar */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <ThemedText weight="bold" style={{ color: colors.textPrimary }}>Progreso general</ThemedText>
            <ThemedText variant="secondary" style={{ color: colors.textSecondary }}>
              {Math.round(((currentExerciseIndex + (currentSet - 1) / currentExercise.sets) / workout.exercises.length) * 100)}%
            </ThemedText>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar,
                { 
                  width: `${((currentExerciseIndex + (currentSet - 1) / currentExercise.sets) / workout.exercises.length) * 100}%`,
                  backgroundColor: colors.primary 
                }
              ]} 
            />
          </View>
        </Card>

        {/* Rest Timer */}
        {isResting && (
          <Card variant="elevated" style={[styles.restCard, { backgroundColor: colors.warning + '20' }]}>
            <View style={styles.restHeader}>
              <Coffee size={24} color={colors.warning} />
              <ThemedText size="large" weight="bold" style={{ color: colors.textPrimary }}>
                Tiempo de descanso
              </ThemedText>
            </View>
            <ThemedText size="xlarge" weight="bold" style={[styles.restTimer, { color: colors.textPrimary }]}>
              {formatTime(restTimeLeft)}
            </ThemedText>
            <ThemedButton
              title="Saltar descanso"
              variant="outline"
              onPress={skipRest}
              accessibilityLabel="Saltar tiempo de descanso"
            />
          </Card>
        )}

        {/* Current Exercise */}
        {!isResting && (
          <Card variant="elevated" style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Dumbbell size={24} color={colors.primary} />
              <View style={styles.exerciseInfo}>
                <ThemedText size="large" weight="bold" style={{ color: colors.textPrimary }}>
                  {currentExercise.name}
                </ThemedText>
                <ThemedText variant="secondary" style={{ color: colors.textSecondary }}>
                  Set {currentSet} de {currentExercise.sets} • {currentExercise.reps} reps
                </ThemedText>
              </View>
            </View>

            {/* Exercise Timer */}
            <View style={[styles.timerSection, { backgroundColor: colors.backgroundTertiary }]}>
              <Timer size={20} color={colors.accent} />
              <ThemedText size="large" weight="bold" style={{ color: colors.textPrimary }}>
                {formatTime(exerciseTimeElapsed)}
              </ThemedText>
              <TouchableOpacity
                onPress={isExerciseActive ? pauseExercise : startExercise}
                style={[styles.timerButton, { backgroundColor: colors.primary }]}
                accessibilityLabel={isExerciseActive ? "Pausar ejercicio" : "Iniciar ejercicio"}
                accessibilityRole="button"
              >
                {isExerciseActive ? (
                  <Pause size={20} color={colors.textPrimary} />
                ) : (
                  <Play size={20} color={colors.textPrimary} />
                )}
              </TouchableOpacity>
            </View>

            {/* Rep Counter */}
            <View style={styles.repCounter}>
              <ThemedText weight="bold" style={[styles.repLabel, { color: colors.textPrimary }]}>
                Repeticiones completadas
              </ThemedText>
              <View style={styles.repControls}>
                <TouchableOpacity
                  onPress={() => adjustReps(false)}
                  style={[styles.repButton, { backgroundColor: colors.error }]}
                  accessibilityLabel="Disminuir repeticiones"
                  accessibilityRole="button"
                >
                  <Minus size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                
                <View style={[styles.repDisplay, { backgroundColor: colors.backgroundTertiary }]}>
                  <ThemedText size="xlarge" weight="bold" style={{ color: colors.textPrimary }}>
                    {currentReps}
                  </ThemedText>
                </View>
                
                <TouchableOpacity
                  onPress={() => adjustReps(true)}
                  style={[styles.repButton, { backgroundColor: colors.success }]}
                  accessibilityLabel="Aumentar repeticiones"
                  accessibilityRole="button"
                >
                  <Plus size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Complete Set Button */}
            <ThemedButton
              title={currentSet === currentExercise.sets ? "Completar ejercicio" : "Completar set"}
              variant="primary"
              onPress={completeSet}
              accessibilityLabel={currentSet === currentExercise.sets ? "Completar ejercicio" : "Completar set"}
              style={styles.completeButton}
            />

            {/* Target Muscles */}
            <View style={styles.targetMuscles}>
              <ThemedText weight="bold" style={[styles.musclesLabel, { color: colors.textPrimary }]}>
                Músculos objetivo:
              </ThemedText>
              <View style={styles.musclesList}>
                {currentExercise.targetMuscles.map((muscle, index) => (
                  <View 
                    key={index} 
                    style={[styles.muscleTag, { backgroundColor: colors.primary + '20' }]}
                  >
                    <ThemedText size="small" style={{ color: colors.primary }}>
                      {muscle}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <ThemedText weight="bold" style={[styles.instructionsLabel, { color: colors.textPrimary }]}>
                Instrucciones:
              </ThemedText>
              {currentExercise.instructions.map((instruction, index) => (
                <ThemedText key={index} variant="secondary" style={[styles.instruction, { color: colors.textSecondary }]}>
                  {index + 1}. {instruction}
                </ThemedText>
              ))}
            </View>
          </Card>
        )}

        {/* Exercise Progress Summary */}
        <Card style={styles.summaryCard}>
          <ThemedText weight="bold" style={[styles.summaryTitle, { color: colors.textPrimary }]}>
            Progreso de ejercicios
          </ThemedText>
          {workout.exercises.map((exercise, index) => {
            const progress = exerciseProgress.find(p => p.exerciseId === exercise.id);
            const isCurrentExercise = index === currentExerciseIndex;
            
            return (
              <View 
                key={exercise.id} 
                style={[
                  styles.exerciseSummary,
                  isCurrentExercise && { backgroundColor: colors.primary + '10' }
                ]}
              >
                <View style={styles.exerciseSummaryInfo}>
                  <ThemedText weight={isCurrentExercise ? "bold" : "medium"} style={{ color: colors.textPrimary }}>
                    {exercise.name}
                  </ThemedText>
                  <ThemedText variant="secondary" size="small" style={{ color: colors.textSecondary }}>
                    {progress?.completedSets || 0} / {exercise.sets} sets
                  </ThemedText>
                </View>
                {progress?.isCompleted && (
                  <CheckCircle size={20} color={colors.success} />
                )}
              </View>
            );
          })}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
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
  progressCard: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  restCard: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 24,
  },
  restHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  restTimer: {
    marginBottom: 20,
    fontSize: 48,
  },
  exerciseCard: {
    marginBottom: 20,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  exerciseInfo: {
    flex: 1,
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  timerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repCounter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  repLabel: {
    marginBottom: 16,
  },
  repControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  repButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repDisplay: {
    minWidth: 80,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  completeButton: {
    marginBottom: 20,
  },
  targetMuscles: {
    marginBottom: 20,
  },
  musclesLabel: {
    marginBottom: 8,
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  instructions: {
    marginBottom: 20,
  },
  instructionsLabel: {
    marginBottom: 12,
  },
  instruction: {
    marginBottom: 8,
    lineHeight: 20,
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryTitle: {
    marginBottom: 16,
  },
  exerciseSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseSummaryInfo: {
    flex: 1,
  },
});