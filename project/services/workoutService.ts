import { apiService, ApiResponse } from './api';

export interface Workout {
  id: number;
  name: string;
  description?: string;
  duration: number; // in minutes
  difficulty: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  category: 'FUERZA' | 'CARDIO' | 'FLEXIBILIDAD' | 'HIIT';
  createdAt?: string;
}

export interface CreateWorkoutRequest {
  name: string;
  description?: string;
  duration: number;
  difficulty: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  category: 'FUERZA' | 'CARDIO' | 'FLEXIBILIDAD' | 'HIIT';
  userId?: number; // Optional: if provided, creates a user-specific workout
}

class WorkoutService {
  // Get all workouts
  async getAllWorkouts(): Promise<ApiResponse<Workout[]>> {
    return apiService.get<Workout[]>('/workouts');
  }

  // Get workout by ID
  async getWorkoutById(id: number): Promise<ApiResponse<Workout>> {
    return apiService.get<Workout>(`/workouts/${id}`);
  }

  // Create workout
  async createWorkout(workoutData: CreateWorkoutRequest): Promise<ApiResponse<Workout>> {
    return apiService.post<Workout>('/workouts', workoutData);
  }

  // Update workout
  async updateWorkout(id: number, workoutData: Partial<Workout>): Promise<ApiResponse<Workout>> {
    return apiService.put<Workout>(`/workouts/${id}`, workoutData);
  }

  // Delete workout
  async deleteWorkout(id: number): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/workouts/${id}`);
  }

  // Get workouts by category
  async getWorkoutsByCategory(category: string): Promise<ApiResponse<Workout[]>> {
    return apiService.get<Workout[]>(`/workouts/category/${category}`);
  }

  // Get workouts by difficulty
  async getWorkoutsByDifficulty(difficulty: string): Promise<ApiResponse<Workout[]>> {
    return apiService.get<Workout[]>(`/workouts/difficulty/${difficulty}`);
  }

  // Get global workouts (no user assigned)
  async getGlobalWorkouts(): Promise<ApiResponse<Workout[]>> {
    return apiService.get<Workout[]>('/workouts/global');
  }

  // Get user-specific workouts
  async getUserWorkouts(userId: number): Promise<ApiResponse<Workout[]>> {
    return apiService.get<Workout[]>(`/workouts/user/${userId}`);
  }

  // Get all workouts available to a user (global + user-specific)
  async getAvailableWorkouts(userId: number): Promise<ApiResponse<Workout[]>> {
    return apiService.get<Workout[]>(`/workouts/available/${userId}`);
  }

  // Create user-specific workout
  async createUserWorkout(userId: number, workoutData: Omit<CreateWorkoutRequest, 'userId'>): Promise<ApiResponse<Workout>> {
    return apiService.post<Workout>('/workouts', { ...workoutData, userId });
  }
}

export const workoutService = new WorkoutService();
