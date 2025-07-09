package com.example.vitalyou.repository;

import com.example.vitalyou.model.Meal;
import com.example.vitalyou.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    
    List<Meal> findByUserOrderByCreatedAtDesc(User user);
    
    List<Meal> findByUserAndDateOrderByCreatedAtDesc(User user, LocalDate date);
    
    List<Meal> findByUserAndMealTypeOrderByCreatedAtDesc(User user, Meal.MealType mealType);
    
    @Query("SELECT m FROM Meal m WHERE m.user = :user AND m.date BETWEEN :startDate AND :endDate ORDER BY m.date DESC, m.createdAt DESC")
    List<Meal> findByUserAndDateBetween(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(m.totalCalories) FROM Meal m WHERE m.user = :user AND m.date = :date")
    Double getTotalCaloriesByUserAndDate(@Param("user") User user, @Param("date") LocalDate date);
}
