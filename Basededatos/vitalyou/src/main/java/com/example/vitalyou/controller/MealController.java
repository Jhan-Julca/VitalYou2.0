package com.example.vitalyou.controller;

import com.example.vitalyou.model.Meal;
import com.example.vitalyou.model.User;
import com.example.vitalyou.model.Food;
import com.example.vitalyou.repository.MealRepository;
import com.example.vitalyou.repository.UserRepository;
import com.example.vitalyou.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "*")
public class MealController {

    @Autowired
    private MealRepository mealRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FoodRepository foodRepository;

    // Get all meals
    @GetMapping
    public ResponseEntity<List<Meal>> getAllMeals() {
        try {
            List<Meal> meals = mealRepository.findAll();
            return ResponseEntity.ok(meals);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get meals by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Meal>> getMealsByUserId(@PathVariable Long userId) {
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                List<Meal> meals = mealRepository.findByUserOrderByCreatedAtDesc(user.get());
                return ResponseEntity.ok(meals);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get meals by user and date
    @GetMapping("/user/{userId}/date/{date}")
    public ResponseEntity<List<Meal>> getMealsByUserAndDate(
            @PathVariable Long userId, 
            @PathVariable String date) {
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                LocalDate mealDate = LocalDate.parse(date);
                List<Meal> meals = mealRepository.findByUserAndDateOrderByCreatedAtDesc(user.get(), mealDate);
                return ResponseEntity.ok(meals);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Create new meal
    @PostMapping
    public ResponseEntity<Meal> createMeal(@RequestBody Map<String, Object> mealData) {
        try {
            Long userId = Long.valueOf(mealData.get("userId").toString());
            Long foodId = Long.valueOf(mealData.get("foodId").toString());
            Double quantity = Double.valueOf(mealData.get("quantity").toString());
            String mealTypeStr = mealData.get("mealType").toString();
            String dateStr = mealData.get("date").toString();
            
            Optional<User> user = userRepository.findById(userId);
            Optional<Food> food = foodRepository.findById(foodId);
            
            if (user.isPresent() && food.isPresent()) {
                Meal.MealType mealType = Meal.MealType.valueOf(mealTypeStr);
                LocalDate date = LocalDate.parse(dateStr);
                
                Meal meal = new Meal(user.get(), food.get(), quantity, mealType, date);
                Meal savedMeal = mealRepository.save(meal);
                return ResponseEntity.ok(savedMeal);
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Update meal
    @PutMapping("/{id}")
    public ResponseEntity<Meal> updateMeal(@PathVariable Long id, @RequestBody Map<String, Object> mealData) {
        try {
            Optional<Meal> optionalMeal = mealRepository.findById(id);
            if (optionalMeal.isPresent()) {
                Meal meal = optionalMeal.get();
                
                if (mealData.containsKey("quantity")) {
                    meal.setQuantity(Double.valueOf(mealData.get("quantity").toString()));
                }
                if (mealData.containsKey("mealType")) {
                    meal.setMealType(Meal.MealType.valueOf(mealData.get("mealType").toString()));
                }
                if (mealData.containsKey("date")) {
                    meal.setDate(LocalDate.parse(mealData.get("date").toString()));
                }
                
                Meal updatedMeal = mealRepository.save(meal);
                return ResponseEntity.ok(updatedMeal);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete meal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        try {
            if (mealRepository.existsById(id)) {
                mealRepository.deleteById(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Get daily nutrition summary
    @GetMapping("/nutrition/daily/{userId}/{date}")
    public ResponseEntity<Map<String, Object>> getDailyNutrition(
            @PathVariable Long userId, 
            @PathVariable String date) {
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                LocalDate mealDate = LocalDate.parse(date);
                List<Meal> meals = mealRepository.findByUserAndDateOrderByCreatedAtDesc(user.get(), mealDate);
                
                double totalCalories = 0;
                double totalProtein = 0;
                double totalCarbs = 0;
                double totalFat = 0;
                
                for (Meal meal : meals) {
                    if (meal.getTotalCalories() != null) {
                        totalCalories += meal.getTotalCalories();
                    }
                    if (meal.getFood() != null && meal.getQuantity() != null) {
                        Food food = meal.getFood();
                        double quantity = meal.getQuantity();
                        
                        if (food.getProtein() != null) {
                            totalProtein += food.getProtein() * quantity;
                        }
                        if (food.getCarbs() != null) {
                            totalCarbs += food.getCarbs() * quantity;
                        }
                        if (food.getFat() != null) {
                            totalFat += food.getFat() * quantity;
                        }
                    }
                }
                
                Map<String, Object> nutrition = new HashMap<>();
                nutrition.put("totalCalories", totalCalories);
                nutrition.put("totalProtein", totalProtein);
                nutrition.put("totalCarbs", totalCarbs);
                nutrition.put("totalFat", totalFat);
                nutrition.put("mealsCount", meals.size());
                nutrition.put("date", date);
                
                return ResponseEntity.ok(nutrition);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
