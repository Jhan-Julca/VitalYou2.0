import { useState, useEffect } from 'react';
import { workoutService, Workout, CreateWorkoutRequest } from '@/services/workoutService';
import { useAuth } from './useAuth';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all workouts
  const loadWorkouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await workoutService.getAllWorkouts();
      if (response.success && response.data) {
        setWorkouts(response.data);
        console.log('✅ Workouts loaded:', response.data.length);
      } else {
        setError(response.error || 'Failed to load workouts');
      }
    } catch (err) {
      setError('Error loading workouts');
      console.error('❌ Error loading workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load workouts by category
  const loadWorkoutsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await workoutService.getWorkoutsByCategory(category);
      if (response.success && response.data) {
        setWorkouts(response.data);
      } else {
        setError(response.error || 'Failed to load workouts');
      }
    } catch (err) {
      setError('Error loading workouts by category');
      console.error('❌ Error loading workouts by category:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load workouts by difficulty
  const loadWorkoutsByDifficulty = async (difficulty: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await workoutService.getWorkoutsByDifficulty(difficulty);
      if (response.success && response.data) {
        setWorkouts(response.data);
      } else {
        setError(response.error || 'Failed to load workouts');
      }
    } catch (err) {
      setError('Error loading workouts by difficulty');
      console.error('❌ Error loading workouts by difficulty:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create workout
  const createWorkout = async (workoutData: CreateWorkoutRequest): Promise<boolean> => {
    try {
      const response = await workoutService.createWorkout(workoutData);
      if (response.success && response.data) {
        // Refresh the workouts list
        await loadWorkouts();
        console.log('✅ Workout created:', response.data);
        return true;
      } else {
        setError(response.error || 'Failed to create workout');
        return false;
      }
    } catch (err) {
      setError('Error creating workout');
      console.error('❌ Error creating workout:', err);
      return false;
    }
  };

  // Delete workout
  const deleteWorkout = async (id: number): Promise<boolean> => {
    try {
      const response = await workoutService.deleteWorkout(id);
      if (response.success) {
        // Remove from local state
        setWorkouts(prev => prev.filter(w => w.id !== id));
        console.log('✅ Workout deleted:', id);
        return true;
      } else {
        setError(response.error || 'Failed to delete workout');
        return false;
      }
    } catch (err) {
      setError('Error deleting workout');
      console.error('❌ Error deleting workout:', err);
      return false;
    }
  };

  // Load available workouts for current user (global + user-specific)
  const loadAvailableWorkouts = async (userId?: number) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await workoutService.getAvailableWorkouts(userId);
      if (response.success && response.data) {
        setWorkouts(response.data);
        console.log('✅ Available workouts loaded:', response.data.length);
      } else {
        setError(response.error || 'Failed to load available workouts');
      }
    } catch (err) {
      setError('Error loading available workouts');
      console.error('❌ Error loading available workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load only user-specific workouts
  const loadUserWorkouts = async (userId?: number) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await workoutService.getUserWorkouts(userId);
      if (response.success && response.data) {
        setWorkouts(response.data);
        console.log('✅ User workouts loaded:', response.data.length);
      } else {
        setError(response.error || 'Failed to load user workouts');
      }
    } catch (err) {
      setError('Error loading user workouts');
      console.error('❌ Error loading user workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create user-specific workout
  const createUserWorkout = async (userId: number, workoutData: Omit<CreateWorkoutRequest, 'userId'>): Promise<boolean> => {
    try {
      const response = await workoutService.createUserWorkout(userId, workoutData);
      if (response.success && response.data) {
        // Add to local workouts list
        setWorkouts(prev => [...prev, response.data!]);
        console.log('✅ User workout created:', response.data);
        return true;
      } else {
        setError(response.error || 'Failed to create user workout');
        return false;
      }
    } catch (err) {
      setError('Error creating user workout');
      console.error('❌ Error creating user workout:', err);
      return false;
    }
  };

  // Auto-load workouts on mount
  useEffect(() => {
    loadWorkouts();
  }, []);

  return {
    workouts,
    loading,
    error,
    loadWorkouts,
    loadWorkoutsByCategory,
    loadWorkoutsByDifficulty,
    loadAvailableWorkouts,
    loadUserWorkouts,
    createWorkout,
    createUserWorkout,
    deleteWorkout,
  };
}
