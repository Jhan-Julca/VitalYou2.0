import { useState, useEffect, useCallback } from 'react';
import { nutritionService, Food, Meal, CreateMealRequest, CreateFoodRequest } from '@/services/nutritionService';
import { useAuth } from './useAuth';

export function useNutrition() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load all foods
  const loadFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await nutritionService.getAllFoods();
      if (response.success && response.data) {
        setFoods(response.data);
        console.log('✅ Foods loaded:', response.data.length);
      } else {
        setError(response.error || 'Failed to load foods');
      }
    } catch (err) {
      setError('Error loading foods');
      console.error('❌ Error loading foods:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load user meals for today
  const loadTodayMeals = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await nutritionService.getMealsByDate(parseInt(user.id), today);
      if (response.success && response.data) {
        setMeals(response.data);
        console.log('✅ Today meals loaded:', response.data.length);
      } else {
        setError(response.error || 'Failed to load meals');
      }
    } catch (err) {
      setError('Error loading meals');
      console.error('❌ Error loading meals:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Search foods
  const searchFoods = async (query: string): Promise<Food[]> => {
    try {
      const response = await nutritionService.searchFoods(query);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (err) {
      console.error('❌ Error searching foods:', err);
      return [];
    }
  };

  // Create new food
  const createFood = async (foodData: CreateFoodRequest): Promise<boolean> => {
    try {
      const response = await nutritionService.createFood(foodData);
      if (response.success && response.data) {
        // Add to local foods list
        setFoods(prev => [...prev, response.data!]);
        console.log('✅ Food created:', response.data);
        return true;
      } else {
        setError(response.error || 'Failed to create food');
        return false;
      }
    } catch (err) {
      setError('Error creating food');
      console.error('❌ Error creating food:', err);
      return false;
    }
  };

  // Add meal
  const addMeal = useCallback(async (
    foodId: number,
    quantity: number,
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const mealData: CreateMealRequest = {
        userId: parseInt(user.id),
        foodId,
        quantity,
        mealType,
        date: new Date().toISOString().split('T')[0],
      };

      const response = await nutritionService.createMeal(mealData);
      if (response.success && response.data) {
        // Add to local meals list
        setMeals(prev => [...prev, response.data!]);
        console.log('✅ Meal added:', response.data);
        return true;
      } else {
        setError(response.error || 'Failed to add meal');
        return false;
      }
    } catch (err) {
      setError('Error adding meal');
      console.error('❌ Error adding meal:', err);
      return false;
    }
  }, [user]);

  // Delete meal
  const deleteMeal = async (mealId: number): Promise<boolean> => {
    try {
      const response = await nutritionService.deleteMeal(mealId);
      if (response.success) {
        // Remove from local meals list
        setMeals(prev => prev.filter(m => m.id !== mealId));
        console.log('✅ Meal deleted:', mealId);
        return true;
      } else {
        setError(response.error || 'Failed to delete meal');
        return false;
      }
    } catch (err) {
      setError('Error deleting meal');
      console.error('❌ Error deleting meal:', err);
      return false;
    }
  };

  // Auto-load on mount
  useEffect(() => {
    loadFoods();
    if (user) {
      loadTodayMeals();
    }
  }, [user]);

  return {
    foods,
    meals,
    loading,
    error,
    loadFoods,
    loadTodayMeals,
    searchFoods,
    createFood,
    addMeal,
    deleteMeal,
  };
}
