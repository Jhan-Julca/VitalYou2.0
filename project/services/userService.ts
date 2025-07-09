import { apiService, ApiResponse } from './api';

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  weight?: number;
  height?: number;
  age?: number;
  fitnessGoal?: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessGoal?: string;
}

class UserService {
  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<User>> {
    return apiService.post<User>('/users/login', credentials);
  }

  // Register
  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return apiService.post<User>('/users/register', userData);
  }

  // Get all users
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>('/users');
  }

  // Get user by ID
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return apiService.get<User>(`/users/${id}`);
  }

  // Update user
  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put<User>(`/users/${id}`, userData);
  }

  // Delete user
  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/users/${id}`);
  }
}

export const userService = new UserService();
