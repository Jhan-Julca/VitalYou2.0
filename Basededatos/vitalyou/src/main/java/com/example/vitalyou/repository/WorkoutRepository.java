package com.example.vitalyou.repository;

import com.example.vitalyou.model.Workout;
import com.example.vitalyou.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByCategory(Workout.Category category);
    List<Workout> findByDifficulty(Workout.Difficulty difficulty);
    List<Workout> findByNameContainingIgnoreCase(String name);
    
    // Global workouts (no user assigned)
    List<Workout> findByUserIsNull();
    List<Workout> findByUserIsNullAndCategory(Workout.Category category);
    List<Workout> findByUserIsNullAndDifficulty(Workout.Difficulty difficulty);
    
    // User-specific workouts
    List<Workout> findByUser(User user);
    List<Workout> findByUserAndCategory(User user, Workout.Category category);
    List<Workout> findByUserAndDifficulty(User user, Workout.Difficulty difficulty);
    
    // Combined: global + user workouts
    List<Workout> findByUserIsNullOrUser(User user);
}
