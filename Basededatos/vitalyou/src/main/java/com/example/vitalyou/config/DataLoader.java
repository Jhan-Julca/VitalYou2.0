package com.example.vitalyou.config;

import com.example.vitalyou.model.*;
import com.example.vitalyou.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Override
    public void run(String... args) throws Exception {
        
        // Solo cargar datos si la base de datos está vacía
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println("🔄 Cargando datos de ejemplo en MySQL...");

        // Crear usuarios de ejemplo
        User user1 = new User("juan@example.com", "Juan Pérez", "password123");
        user1.setAge(25);
        user1.setWeight(70.0);
        user1.setHeight(175.0);
        user1.setFitnessGoal("Ganar músculo");

        User user2 = new User("maria@example.com", "María García", "password456");
        user2.setAge(30);
        user2.setWeight(60.0);
        user2.setHeight(165.0);
        user2.setFitnessGoal("Perder peso");

        User user3 = new User("carlos@example.com", "Carlos López", "password789");
        user3.setAge(28);
        user3.setWeight(80.0);
        user3.setHeight(180.0);
        user3.setFitnessGoal("Mantener forma física");

        userRepository.saveAll(Arrays.asList(user1, user2, user3));

        // Crear workouts de ejemplo
        Workout workout1 = new Workout("Rutina de Fuerza Principiante", 
            "Ejercicios básicos para desarrollar fuerza corporal", 
            45, 
            Workout.Difficulty.PRINCIPIANTE, 
            Workout.Category.FUERZA);

        Workout workout2 = new Workout("Cardio HIIT Intermedio", 
            "Entrenamiento de alta intensidad para quemar calorías", 
            30, 
            Workout.Difficulty.INTERMEDIO, 
            Workout.Category.HIIT);

        Workout workout3 = new Workout("Yoga Flexibilidad", 
            "Rutina de yoga para mejorar flexibilidad y relajación", 
            60, 
            Workout.Difficulty.PRINCIPIANTE, 
            Workout.Category.FLEXIBILIDAD);

        Workout workout4 = new Workout("Fuerza Avanzada", 
            "Rutina intensa para atletas experimentados", 
            75, 
            Workout.Difficulty.AVANZADO, 
            Workout.Category.FUERZA);

        Workout workout5 = new Workout("Cardio Matutino", 
            "Cardio suave para empezar el día con energía", 
            20, 
            Workout.Difficulty.PRINCIPIANTE, 
            Workout.Category.CARDIO);

        workoutRepository.saveAll(Arrays.asList(workout1, workout2, workout3, workout4, workout5));

        // Crear sesiones de ejemplo
        WorkoutSession session1 = new WorkoutSession(user1, workout1);
        session1.setFinishedAt(LocalDateTime.now().minusDays(2));
        session1.setDurationMinutes(45);
        session1.setCaloriesBurned(320);
        session1.setNotes("Primera rutina completada. Me gustó!");

        WorkoutSession session2 = new WorkoutSession(user2, workout2);
        session2.setFinishedAt(LocalDateTime.now().minusDays(1));
        session2.setDurationMinutes(28);
        session2.setCaloriesBurned(280);
        session2.setNotes("Muy intenso pero efectivo");

        WorkoutSession session3 = new WorkoutSession(user1, workout3);
        session3.setFinishedAt(LocalDateTime.now().minusHours(3));
        session3.setDurationMinutes(60);
        session3.setCaloriesBurned(150);
        session3.setNotes("Perfecto para relajarse");

        WorkoutSession session4 = new WorkoutSession(user3, workout1);
        session4.setStartedAt(LocalDateTime.now().minusMinutes(30));
        // Esta sesión está en progreso (sin finishedAt)
        session4.setNotes("Entrenando ahora...");

        workoutSessionRepository.saveAll(Arrays.asList(session1, session2, session3, session4));

        // Crear alimentos de ejemplo
        Food chicken = new Food("Pechuga de Pollo", 165.0, 31.0, 0.0, 3.6, "100g");
        Food rice = new Food("Arroz Blanco", 130.0, 2.7, 28.0, 0.3, "100g");
        Food broccoli = new Food("Brócoli", 34.0, 2.8, 7.0, 0.4, "100g");
        Food banana = new Food("Plátano", 89.0, 1.1, 23.0, 0.3, "100g");
        Food oats = new Food("Avena", 389.0, 16.9, 66.3, 6.9, "100g");
        Food egg = new Food("Huevo", 155.0, 13.0, 1.1, 11.0, "100g");
        Food salmon = new Food("Salmón", 208.0, 20.0, 0.0, 13.0, "100g");
        Food spinach = new Food("Espinaca", 23.0, 2.9, 3.6, 0.4, "100g");
        Food almonds = new Food("Almendras", 579.0, 21.2, 21.6, 49.9, "100g");
        Food yogurt = new Food("Yogurt Griego", 100.0, 10.0, 3.6, 5.0, "100g");
        
        foodRepository.saveAll(Arrays.asList(chicken, rice, broccoli, banana, oats, egg, salmon, spinach, almonds, yogurt));

        System.out.println("✅ Datos de ejemplo cargados exitosamente:");
        System.out.println("   - " + userRepository.count() + " usuarios");
        System.out.println("   - " + workoutRepository.count() + " workouts");
        System.out.println("   - " + workoutSessionRepository.count() + " sesiones");
        System.out.println("   - " + foodRepository.count() + " alimentos");
        System.out.println("");
        System.out.println("🌐 API disponible en: http://localhost:8080");
        System.out.println("🗄️  Consola H2 en: http://localhost:8080/h2-console");
        System.out.println("📋 Endpoints principales:");
        System.out.println("   - GET /api/users - Obtener usuarios");
        System.out.println("   - GET /api/workouts - Obtener workouts");
        System.out.println("   - GET /api/workout-sessions - Obtener sesiones");
        System.out.println("   - GET /api/foods - Obtener alimentos");
        System.out.println("   - GET /api/meals - Obtener comidas");
    }
}
