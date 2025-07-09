package com.example.vitalyou.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "meals")
public class Meal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_id", nullable = false)
    private Food food;
    
    @Column(nullable = false)
    private Double quantity; // serving size multiplier
    
    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false)
    private MealType mealType;
    
    @Column(name = "meal_date", nullable = false)
    private LocalDate date;
    
    @Column(name = "total_calories")
    private Double totalCalories;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public enum MealType {
        BREAKFAST, LUNCH, DINNER, SNACK
    }
    
    // Constructors
    public Meal() {}
    
    public Meal(User user, Food food, Double quantity, MealType mealType, LocalDate date) {
        this.user = user;
        this.food = food;
        this.quantity = quantity;
        this.mealType = mealType;
        this.date = date;
        this.calculateTotalCalories();
        this.createdAt = LocalDateTime.now();
    }
    
    // Calculate total calories based on quantity and food calories
    public void calculateTotalCalories() {
        if (food != null && food.getCalories() != null && quantity != null) {
            this.totalCalories = food.getCalories() * quantity;
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Food getFood() { return food; }
    public void setFood(Food food) { this.food = food; }
    
    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { 
        this.quantity = quantity;
        calculateTotalCalories();
    }
    
    public MealType getMealType() { return mealType; }
    public void setMealType(MealType mealType) { this.mealType = mealType; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public Double getTotalCalories() { return totalCalories; }
    public void setTotalCalories(Double totalCalories) { this.totalCalories = totalCalories; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        calculateTotalCalories();
    }
    
    @PreUpdate
    protected void onUpdate() {
        calculateTotalCalories();
    }
}
