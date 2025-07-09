import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService, User as ApiUser, LoginRequest, RegisterRequest } from '@/services/userService';

export interface User {
  id: string;
  email: string;
  name: string;
  weight?: number;
  height?: number;
  age?: number;
  fitnessGoal?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@fitness_app_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const credentials: LoginRequest = { email, password };
      const response = await userService.login(credentials);
      
      if (response.success && response.data) {
        // Convert API user to local user format
        const apiUser = response.data;
        const localUser: User = {
          id: apiUser.id.toString(),
          email: apiUser.email,
          name: apiUser.name,
          weight: apiUser.weight,
          height: apiUser.height,
          age: apiUser.age,
          fitnessGoal: apiUser.fitnessGoal,
        };
        
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));
        setUser(localUser);
        console.log('✅ Login successful:', localUser);
        return true;
      } else {
        console.error('❌ Login failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const registerData: RegisterRequest = {
        email,
        password,
        name,
      };
      
      const response = await userService.register(registerData);
      
      if (response.success && response.data) {
        // Convert API user to local user format
        const apiUser = response.data;
        const localUser: User = {
          id: apiUser.id.toString(),
          email: apiUser.email,
          name: apiUser.name,
          weight: apiUser.weight,
          height: apiUser.height,
          age: apiUser.age,
          fitnessGoal: apiUser.fitnessGoal,
        };
        
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));
        setUser(localUser);
        console.log('✅ Registration successful:', localUser);
        return true;
      } else {
        console.error('❌ Registration failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Register error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (user) {
        // Update on server first
        const userId = parseInt(user.id);
        const response = await userService.updateUser(userId, {
          name: userData.name,
          weight: userData.weight,
          height: userData.height,
          age: userData.age,
          fitnessGoal: userData.fitnessGoal,
        });

        if (response.success && response.data) {
          // Convert API response back to local format
          const apiUser = response.data;
          const updatedLocalUser: User = {
            id: apiUser.id.toString(),
            email: apiUser.email,
            name: apiUser.name,
            weight: apiUser.weight,
            height: apiUser.height,
            age: apiUser.age,
            fitnessGoal: apiUser.fitnessGoal,
          };
          
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedLocalUser));
          setUser(updatedLocalUser);
          console.log('✅ User updated successfully:', updatedLocalUser);
        } else {
          console.error('❌ User update failed:', response.error);
        }
      }
    } catch (error) {
      console.error('❌ Update user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}