import { apiService, ApiResponse } from './api';
import { User } from './userService';
import { Workout } from './workoutService';

export interface WorkoutSession {
  id: number;
  user?: User;
  workout?: Workout;
  startedAt?: string;
  finishedAt?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  notes?: string;
}

export interface CreateWorkoutSessionRequest {
  user: { id: number };
  workout: { id: number };
  durationMinutes?: number;
  caloriesBurned?: number;
  notes?: string;
}

class WorkoutSessionService {
  // Get all workout sessions
  async getAllSessions(): Promise<ApiResponse<WorkoutSession[]>> {
    return apiService.get<WorkoutSession[]>('/workout-sessions');
  }

  // Get session by ID
  async getSessionById(id: number): Promise<ApiResponse<WorkoutSession>> {
    return apiService.get<WorkoutSession>(`/workout-sessions/${id}`);
  }

  // Get sessions by user ID
  async getSessionsByUserId(userId: number): Promise<ApiResponse<WorkoutSession[]>> {
    return apiService.get<WorkoutSession[]>(`/workout-sessions/user/${userId}`);
  }

  // Create workout session
  async createSession(sessionData: CreateWorkoutSessionRequest): Promise<ApiResponse<WorkoutSession>> {
    return apiService.post<WorkoutSession>('/workout-sessions', sessionData);
  }

  // Update workout session
  async updateSession(id: number, sessionData: Partial<WorkoutSession>): Promise<ApiResponse<WorkoutSession>> {
    return apiService.put<WorkoutSession>(`/workout-sessions/${id}`, sessionData);
  }

  // Delete workout session
  async deleteSession(id: number): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/workout-sessions/${id}`);
  }

  // Complete workout session
  async completeSession(id: number): Promise<ApiResponse<WorkoutSession>> {
    return apiService.put<WorkoutSession>(`/workout-sessions/${id}/complete`, {});
  }
}

export const workoutSessionService = new WorkoutSessionService();
