package com.example.vitalyou.controller;

import com.example.vitalyou.model.Food;
import com.example.vitalyou.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;

    // Get all foods
    @GetMapping
    public ResponseEntity<List<Food>> getAllFoods() {
        try {
            List<Food> foods = foodRepository.findByOrderByNameAsc();
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get food by ID
    @GetMapping("/{id}")
    public ResponseEntity<Food> getFoodById(@PathVariable Long id) {
        try {
            Optional<Food> food = foodRepository.findById(id);
            return food.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Create new food
    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody Food food) {
        try {
            Food savedFood = foodRepository.save(food);
            return ResponseEntity.ok(savedFood);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Update food
    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFood(@PathVariable Long id, @RequestBody Food foodDetails) {
        try {
            Optional<Food> optionalFood = foodRepository.findById(id);
            if (optionalFood.isPresent()) {
                Food food = optionalFood.get();
                
                if (foodDetails.getName() != null) {
                    food.setName(foodDetails.getName());
                }
                if (foodDetails.getCalories() != null) {
                    food.setCalories(foodDetails.getCalories());
                }
                if (foodDetails.getProtein() != null) {
                    food.setProtein(foodDetails.getProtein());
                }
                if (foodDetails.getCarbs() != null) {
                    food.setCarbs(foodDetails.getCarbs());
                }
                if (foodDetails.getFat() != null) {
                    food.setFat(foodDetails.getFat());
                }
                if (foodDetails.getServingSize() != null) {
                    food.setServingSize(foodDetails.getServingSize());
                }
                
                Food updatedFood = foodRepository.save(food);
                return ResponseEntity.ok(updatedFood);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete food
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        try {
            if (foodRepository.existsById(id)) {
                foodRepository.deleteById(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Search foods by name
    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFoods(@RequestParam("q") String query) {
        try {
            List<Food> foods = foodRepository.findByNameContainingIgnoreCase(query);
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
