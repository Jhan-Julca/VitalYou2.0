# VitalYou API - Backend Spring Boot

## 🚀 Descripción
API REST para la aplicación móvil VitalYou, desarrollada con Spring Boot. Proporciona endpoints para autenticación, gestión de workouts, nutrición y seguimiento de progreso.

## 🏗️ Arquitectura
- **Framework**: Spring Boot 3.5.3
- **Base de Datos**: H2 (desarrollo) / MySQL (producción)
- **Seguridad**: JWT + Spring Security
- **ORM**: JPA/Hibernate

## 📦 Características
- ✅ Autenticación JWT
- ✅ CRUD de Workouts
- ✅ Gestión de usuarios
- ✅ Sesiones de entrenamiento
- ✅ Tracking nutricional
- ✅ Seguimiento de progreso
- ✅ CORS configurado para React Native
- ✅ Base de datos H2 para desarrollo rápido

## 🔧 Instalación y Ejecución

### Prerrequisitos
- Java 21
- Maven 3.6+

### Ejecutar la aplicación
```bash
# Compilar y ejecutar
mvnw spring-boot:run

# O compilar y ejecutar el JAR
mvnw clean package
java -jar target/vitalyou-0.0.1-SNAPSHOT.jar
```

### Acceder a la aplicación
- API: `http://localhost:8080/api`
- H2 Console: `http://localhost:8080/api/h2-console`
  - URL: `jdbc:h2:mem:vitalyou`
  - Usuario: `sa`
  - Contraseña: `password`

## 📡 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario

### Workouts
- `GET /api/workouts` - Listar todos los workouts
- `GET /api/workouts/{id}` - Obtener workout por ID
- `GET /api/workouts/category/{category}` - Filtrar por categoría
- `GET /api/workouts/difficulty/{difficulty}` - Filtrar por dificultad
- `GET /api/workouts/search?name={name}` - Buscar workouts

### Ejemplos de Request

#### Login
```json
POST /api/auth/login
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

#### Registro
```json
POST /api/auth/register
{
  "email": "nuevo@example.com",
  "name": "Nuevo Usuario",
  "password": "password123",
  "weight": 70.5,
  "height": 175.0,
  "age": 25,
  "fitnessGoal": "Perder peso"
}
```

## 🗄️ Modelo de Datos

### Entidades Principales
- **User**: Información del usuario
- **Workout**: Rutinas de ejercicio
- **Exercise**: Ejercicios individuales
- **WorkoutSession**: Sesiones de entrenamiento
- **MealEntry**: Entradas de comidas
- **FoodItem**: Items de comida
- **ProgressEntry**: Entradas de progreso

## 🔒 Seguridad
- JWT tokens para autenticación
- Contraseñas encriptadas con BCrypt
- CORS configurado para desarrollo móvil

## 🎯 Datos de Prueba
La aplicación se inicia con datos de ejemplo que incluyen:
- 8 workouts predefinidos
- Diferentes categorías (Cardio, Fuerza, HIIT, Flexibilidad)
- Niveles de dificultad variados

## 🔧 Configuración

### Variables de entorno (application.yml)
```yaml
jwt:
  secret: VitalYouSecretKey2025!@#$%^&*()_+
  expiration: 86400000 # 24 horas

spring:
  datasource:
    url: jdbc:h2:mem:vitalyou
    username: sa
    password: password
```

## 🚀 Próximos pasos
1. Conectar con tu app React Native
2. Agregar más endpoints para nutrición y progreso
3. Implementar subida de imágenes
4. Agregar notificaciones push
5. Migrar a MySQL para producción

## 📱 Conectar con React Native
Para conectar tu app móvil con esta API:

1. Cambia las URLs base en tu app móvil a `http://localhost:8080/api`
2. Usa los endpoints de autenticación para login/registro
3. Guarda el JWT token y úsalo en las cabeceras de tus requests:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

¡Tu API VitalYou está lista para conectarse con tu aplicación móvil! 🎉
