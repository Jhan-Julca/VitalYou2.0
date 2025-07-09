# VitalYou API - Versión Simple

API básica para la aplicación móvil VitalYou - versión simplificada para prototipo y pruebas.

## 🚀 Inicio Rápido

### Ejecutar el servidor
```bash
# Opción 1: Usar el script
start-simple.bat

# Opción 2: Maven directo
mvn spring-boot:run
```

### Probar los endpoints
```bash
# Usar el script de pruebas
test-endpoints.bat
```

## 📋 Endpoints Disponibles

### GET /api/test
Endpoint de prueba para verificar que la API está funcionando.

**Respuesta:**
```json
{
  "mensaje": "✅ VitalYou API funcionando correctamente",
  "version": "1.0.0-SIMPLE",
  "estado": "OK"
}
```

### GET /api/workouts
Lista de workouts de ejemplo.

**Respuesta:**
```json
{
  "workouts": [
    "Flexiones Básicas - 15 min - PRINCIPIANTE",
    "Cardio Básico - 20 min - PRINCIPIANTE", 
    "Yoga Relajante - 30 min - PRINCIPIANTE"
  ],
  "total": 3
}
```

### POST /api/auth/login
Login simplificado para pruebas.

**Request:**
```json
{
  "email": "test@example.com",
  "password": "password"
}
```

**Respuesta:**
```json
{
  "token": "simple-token-123",
  "user": "test@example.com",
  "message": "Login exitoso"
}
```

## 🛠️ Características

- ✅ Spring Boot básico (solo web, sin base de datos)
- ✅ CORS habilitado para desarrollo
- ✅ Endpoints JSON simples
- ✅ Sin autenticación compleja (ideal para prototipo)
- ✅ Configuración mínima
- ✅ Fácil de ejecutar y probar

## 🔗 Integración con App Móvil

Para conectar la app React Native, usar la URL base:
```
http://localhost:8080/api
```

Ejemplo en React Native:
```javascript
// Probar conexión
const response = await fetch('http://localhost:8080/api/test');

// Obtener workouts
const workouts = await fetch('http://localhost:8080/api/workouts');

// Login
const login = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password' })
});
```

## 📁 Estructura del Proyecto

```
src/main/java/com/example/vitalyou/
├── VitalyouApplication.java      # Aplicación principal
└── controller/
    └── TestController.java       # Endpoints de prueba
```

## ⚙️ Configuración

El archivo `application.properties` contiene la configuración mínima:
- Puerto: 8080
- Logging básico
- Sin base de datos

## 🎯 Propósito

Esta es una versión súper simplificada de la API VitalYou, diseñada específicamente para:
- Prototipado rápido
- Pruebas de integración con la app móvil
- Desarrollo sin complejidades de base de datos o seguridad
- Demostración de funcionalidad básica

**Nota:** Esta versión NO es para producción. Para un entorno real, considera agregar:
- Base de datos real
- Autenticación y autorización
- Validación de datos
- Manejo de errores robusto
- Tests unitarios
