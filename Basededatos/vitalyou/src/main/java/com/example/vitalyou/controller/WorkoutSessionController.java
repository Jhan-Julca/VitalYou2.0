package com.example.vitalyou.controller;

import com.example.vitalyou.model.WorkoutSession;
import com.example.vitalyou.repository.WorkoutSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workout-sessions")
@CrossOrigin(origins = "*")
public class WorkoutSessionController {

    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    // Obtener todas las sesiones
    @GetMapping
    public List<WorkoutSession> getAllWorkoutSessions() {
        return workoutSessionRepository.findAll();
    }

    // Obtener sesión por ID
    @GetMapping("/{id}")
    public ResponseEntity<WorkoutSession> getWorkoutSessionById(@PathVariable Long id) {
        Optional<WorkoutSession> session = workoutSessionRepository.findById(id);
        return session.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Obtener sesiones por usuario
    @GetMapping("/user/{userId}")
    public List<WorkoutSession> getWorkoutSessionsByUserId(@PathVariable Long userId) {
        return workoutSessionRepository.findByUserIdOrderByStartedAtDesc(userId);
    }

    // Crear nueva sesión
    @PostMapping
    public WorkoutSession createWorkoutSession(@RequestBody WorkoutSession session) {
        return workoutSessionRepository.save(session);
    }

    // Actualizar sesión
    @PutMapping("/{id}")
    public ResponseEntity<WorkoutSession> updateWorkoutSession(@PathVariable Long id, @RequestBody WorkoutSession sessionDetails) {
        Optional<WorkoutSession> optionalSession = workoutSessionRepository.findById(id);
        if (optionalSession.isPresent()) {
            WorkoutSession session = optionalSession.get();
            session.setStartedAt(sessionDetails.getStartedAt());
            session.setFinishedAt(sessionDetails.getFinishedAt());
            session.setDurationMinutes(sessionDetails.getDurationMinutes());
            session.setCaloriesBurned(sessionDetails.getCaloriesBurned());
            session.setNotes(sessionDetails.getNotes());
            return ResponseEntity.ok(workoutSessionRepository.save(session));
        }
        return ResponseEntity.notFound().build();
    }

    // Eliminar sesión
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkoutSession(@PathVariable Long id) {
        if (workoutSessionRepository.existsById(id)) {
            workoutSessionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Marcar sesión como completada
    @PutMapping("/{id}/complete")
    public ResponseEntity<WorkoutSession> completeWorkoutSession(@PathVariable Long id) {
        Optional<WorkoutSession> optionalSession = workoutSessionRepository.findById(id);
        if (optionalSession.isPresent()) {
            WorkoutSession session = optionalSession.get();
            session.setFinishedAt(java.time.LocalDateTime.now());
            return ResponseEntity.ok(workoutSessionRepository.save(session));
        }
        return ResponseEntity.notFound().build();
    }
}
