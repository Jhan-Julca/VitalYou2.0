package com.example.vitalyou.repository;

import com.example.vitalyou.model.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    List<WorkoutSession> findByUserIdOrderByStartedAtDesc(Long userId);
    List<WorkoutSession> findByWorkoutId(Long workoutId);
}
