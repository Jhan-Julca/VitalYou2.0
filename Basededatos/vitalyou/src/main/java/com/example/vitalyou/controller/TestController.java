package com.example.vitalyou.controller;

import com.example.vitalyou.repository.UserRepository;
import com.example.vitalyou.repository.WorkoutRepository;
import com.example.vitalyou.repository.WorkoutSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    @GetMapping("/test")
    public Map<String, Object> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "VitalYou API funcionando correctamente");
        response.put("timestamp", java.time.LocalDateTime.now());
        
        // Estadísticas de la base de datos
        Map<String, Object> stats = new HashMap<>();
        stats.put("users", userRepository.count());
        stats.put("workouts", workoutRepository.count());
        stats.put("sessions", workoutSessionRepository.count());
        response.put("database_stats", stats);

        // Enlaces útiles
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("users", "/api/users");
        endpoints.put("workouts", "/api/workouts");
        endpoints.put("sessions", "/api/workout-sessions");
        endpoints.put("h2_console", "/h2-console");
        response.put("available_endpoints", endpoints);

        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "VitalYou Backend");
        response.put("version", "1.0.0");
        return response;
    }
}
