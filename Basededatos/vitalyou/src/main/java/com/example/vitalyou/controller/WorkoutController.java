package com.example.vitalyou.controller;

import com.example.vitalyou.model.Workout;
import com.example.vitalyou.model.User;
import com.example.vitalyou.repository.WorkoutRepository;
import com.example.vitalyou.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*")
public class WorkoutController {

    @Autowired
    private WorkoutRepository workoutRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Obtener todos los workouts
    @GetMapping
    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAll();
    }

    // Obtener workout por ID
    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long id) {
        Optional<Workout> workout = workoutRepository.findById(id);
        return workout.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Crear nuevo workout
    @PostMapping
    public ResponseEntity<Workout> createWorkout(@RequestBody Map<String, Object> workoutData) {
        try {
            Workout workout = new Workout();
            workout.setName((String) workoutData.get("name"));
            workout.setDescription((String) workoutData.get("description"));
            workout.setDuration((Integer) workoutData.get("duration"));
            
            // Set category and difficulty
            if (workoutData.get("category") != null) {
                workout.setCategory(Workout.Category.valueOf(workoutData.get("category").toString().toUpperCase()));
            }
            if (workoutData.get("difficulty") != null) {
                workout.setDifficulty(Workout.Difficulty.valueOf(workoutData.get("difficulty").toString().toUpperCase()));
            }
            
            // Set user if provided (for personal workouts)
            if (workoutData.get("userId") != null) {
                Long userId = Long.valueOf(workoutData.get("userId").toString());
                Optional<User> user = userRepository.findById(userId);
                if (user.isPresent()) {
                    workout.setUser(user.get());
                }
            }
            
            Workout savedWorkout = workoutRepository.save(workout);
            return ResponseEntity.ok(savedWorkout);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Actualizar workout
    @PutMapping("/{id}")
    public ResponseEntity<Workout> updateWorkout(@PathVariable Long id, @RequestBody Workout workoutDetails) {
        Optional<Workout> optionalWorkout = workoutRepository.findById(id);
        if (optionalWorkout.isPresent()) {
            Workout workout = optionalWorkout.get();
            workout.setName(workoutDetails.getName());
            workout.setDescription(workoutDetails.getDescription());
            workout.setCategory(workoutDetails.getCategory());
            workout.setDifficulty(workoutDetails.getDifficulty());
            workout.setDuration(workoutDetails.getDuration());
            workout.setExercises(workoutDetails.getExercises());
            return ResponseEntity.ok(workoutRepository.save(workout));
        }
        return ResponseEntity.notFound().build();
    }

    // Eliminar workout
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        if (workoutRepository.existsById(id)) {
            workoutRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Buscar workouts por categoría
    @GetMapping("/category/{category}")
    public List<Workout> getWorkoutsByCategory(@PathVariable String category) {
        try {
            Workout.Category categoryEnum = Workout.Category.valueOf(category.toUpperCase());
            return workoutRepository.findByCategory(categoryEnum);
        } catch (IllegalArgumentException e) {
            return List.of(); // Retorna lista vacía si la categoría no existe
        }
    }

    // Buscar workouts por nivel de dificultad
    @GetMapping("/difficulty/{difficulty}")
    public List<Workout> getWorkoutsByDifficulty(@PathVariable String difficulty) {
        try {
            Workout.Difficulty difficultyEnum = Workout.Difficulty.valueOf(difficulty.toUpperCase());
            return workoutRepository.findByDifficulty(difficultyEnum);
        } catch (IllegalArgumentException e) {
            return List.of(); // Retorna lista vacía si la dificultad no existe
        }
    }
    
    // Get all global workouts (no user assigned)
    @GetMapping("/global")
    public ResponseEntity<List<Workout>> getGlobalWorkouts() {
        try {
            List<Workout> workouts = workoutRepository.findByUserIsNull();
            return ResponseEntity.ok(workouts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Get user-specific workouts
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Workout>> getUserWorkouts(@PathVariable Long userId) {
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                List<Workout> workouts = workoutRepository.findByUser(user.get());
                return ResponseEntity.ok(workouts);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Get all workouts available to a user (global + user-specific)
    @GetMapping("/available/{userId}")
    public ResponseEntity<List<Workout>> getAvailableWorkouts(@PathVariable Long userId) {
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                List<Workout> workouts = workoutRepository.findByUserIsNullOrUser(user.get());
                return ResponseEntity.ok(workouts);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
