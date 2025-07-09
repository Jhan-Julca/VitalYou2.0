# VITALYOU API - COLLECTION PARA POSTMAN
# =====================================
# Importa esta colección en Postman o usa estos endpoints manualmente

## 1. HEALTH CHECK
GET http://localhost:8080/api/health

## 2. TEST ENDPOINT
GET http://localhost:8080/api/test

## 3. USUARIOS
### Obtener todos los usuarios
GET http://localhost:8080/api/users

### Crear usuario
POST http://localhost:8080/api/users
Content-Type: application/json

{
  "email": "test@example.com",
  "name": "Usuario Test",
  "password": "password123",
  "age": 25,
  "weight": 70.5,
  "height": 175.0,
  "fitnessGoal": "Ganar músculo"
}

### Obtener usuario por ID
GET http://localhost:8080/api/users/1

### Login
POST http://localhost:8080/api/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

## 4. WORKOUTS
### Obtener todos los workouts
GET http://localhost:8080/api/workouts

### Crear workout
POST http://localhost:8080/api/workouts
Content-Type: application/json

{
  "name": "Rutina de Prueba",
  "description": "Una rutina creada desde Postman",
  "duration": 30,
  "difficulty": "PRINCIPIANTE",
  "category": "FUERZA"
}

### Obtener workouts por categoría
GET http://localhost:8080/api/workouts/category/FUERZA

### Obtener workouts por dificultad
GET http://localhost:8080/api/workouts/difficulty/PRINCIPIANTE

## 5. SESIONES DE ENTRENAMIENTO
### Obtener todas las sesiones
GET http://localhost:8080/api/workout-sessions

### Crear sesión
POST http://localhost:8080/api/workout-sessions
Content-Type: application/json

{
  "user": {"id": 1},
  "workout": {"id": 1},
  "durationMinutes": 45,
  "caloriesBurned": 300,
  "notes": "Sesión completada desde Postman"
}

### Obtener sesiones por usuario
GET http://localhost:8080/api/workout-sessions/user/1

### Completar sesión
PUT http://localhost:8080/api/workout-sessions/1/complete
