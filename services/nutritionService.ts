import { apiService, ApiResponse } from './api';

export interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export interface Meal {
  id: number;
  userId: number;
  foodId: number;
  food?: Food;
  quantity: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  date: string;
  totalCalories: number;
}

export interface CreateMealRequest {
  userId: number;
  foodId: number;
  quantity: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  date: string;
}

export interface CreateFoodRequest {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

class NutritionService {
  // Foods
  async getAllFoods(): Promise<ApiResponse<Food[]>> {
    return apiService.get<Food[]>('/foods');
  }

  async getFoodById(id: number): Promise<ApiResponse<Food>> {
    return apiService.get<Food>(`/foods/${id}`);
  }

  async createFood(foodData: CreateFoodRequest): Promise<ApiResponse<Food>> {
    return apiService.post<Food>('/foods', foodData);
  }

  async searchFoods(query: string): Promise<ApiResponse<Food[]>> {
    return apiService.get<Food[]>(`/foods/search?q=${encodeURIComponent(query)}`);
  }

  // Meals
  async getAllMeals(): Promise<ApiResponse<Meal[]>> {
    return apiService.get<Meal[]>('/meals');
  }

  async getMealsByUserId(userId: number): Promise<ApiResponse<Meal[]>> {
    return apiService.get<Meal[]>(`/meals/user/${userId}`);
  }

  async getMealsByDate(userId: number, date: string): Promise<ApiResponse<Meal[]>> {
    return apiService.get<Meal[]>(`/meals/user/${userId}/date/${date}`);
  }

  async createMeal(mealData: CreateMealRequest): Promise<ApiResponse<Meal>> {
    return apiService.post<Meal>('/meals', mealData);
  }

  async updateMeal(id: number, mealData: Partial<Meal>): Promise<ApiResponse<Meal>> {
    return apiService.put<Meal>(`/meals/${id}`, mealData);
  }

  async deleteMeal(id: number): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/meals/${id}`);
  }

  // Nutrition summary
  async getDailyNutrition(userId: number, date: string): Promise<ApiResponse<any>> {
    return apiService.get(`/nutrition/daily/${userId}/${date}`);
  }
}

export const nutritionService = new NutritionService();
