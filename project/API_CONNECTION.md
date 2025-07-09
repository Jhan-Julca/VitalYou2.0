# VitalYou - Conexión API Mobile ↔ Backend

## 🚀 **Configuración de la Conexión**

### 1. **Backend (Spring Boot)**
Asegúrate de que tu API de Spring Boot esté ejecutándose:
```bash
cd Basededatos/vitalyou
mvn spring-boot:run
```

La API estará disponible en: `http://localhost:8080`

### 2. **Frontend (React Native/Expo)**
```bash
cd project
npm start
```

## 📱 **Configuración por Plataforma**

### **Android Emulator**
Cambia la URL en `config/api.ts`:
```typescript
BASE_URL: 'http://10.0.2.2:8080/api'
```

### **iOS Simulator**
Usa localhost:
```typescript
BASE_URL: 'http://localhost:8080/api'
```

### **Dispositivo Físico**
Usa la IP de tu computadora:
```typescript
BASE_URL: 'http://192.168.1.XXX:8080/api'
```

## 🔧 **Servicios Implementados**

### **userService.ts**
- `login(email, password)` - Login con API real
- `register(userData)` - Registro con API real
- `updateUser(id, userData)` - Actualizar perfil

### **workoutService.ts**
- `getAllWorkouts()` - Obtener todos los workouts
- `getWorkoutsByCategory(category)` - Filtrar por categoría
- `createWorkout(workoutData)` - Crear nuevo workout

### **workoutSessionService.ts**
- `getSessionsByUserId(userId)` - Sesiones del usuario
- `createSession(data)` - Crear nueva sesión
- `completeSession(id)` - Marcar como completada

## 🎣 **Hooks Actualizados**

### **useAuth.tsx**
- ✅ Conectado a la API real
- ✅ Login/Register funcional
- ✅ Persistencia en AsyncStorage

### **useWorkouts.tsx** (NUEVO)
- ✅ Carga workouts desde API
- ✅ Filtros por categoría/dificultad
- ✅ Crear/eliminar workouts

### **useWorkoutSessions.tsx** (NUEVO)
- ✅ Sesiones del usuario actual
- ✅ Crear/completar sesiones
- ✅ Tracking de progreso

## 🔄 **Flujo de Datos**

1. **Login**: App → API → MySQL → Response → AsyncStorage
2. **Workouts**: App → API → MySQL → Lista de workouts
3. **Sesiones**: App → API → MySQL → Progreso del usuario

## 🧪 **Testing**

### Probar la conexión:
```typescript
import { isAPIAvailable } from '@/config/api';

const checkAPI = async () => {
  const available = await isAPIAvailable();
  console.log('API disponible:', available);
};
```

### Probar login:
```typescript
import { useAuth } from '@/hooks/useAuth';

const { login } = useAuth();
const success = await login('test@example.com', 'password123');
```

## 📝 **Logs**

Todos los servicios tienen logs detallados:
- ✅ Requests exitosos
- ❌ Errores de red/API
- 🌐 URLs y datos enviados

## 🚨 **Troubleshooting**

1. **API no disponible**: Verifica que Spring Boot esté corriendo
2. **CORS errors**: Ya está configurado con `@CrossOrigin(origins = "*")`
3. **Network errors**: Verifica la URL en `config/api.ts`
4. **MySQL errors**: Verifica que MySQL esté corriendo y la BD creada

## 🎯 **Próximos Pasos**

¡Tu app ya está lista para usar datos reales! 🎉

Los datos se guardan automáticamente en MySQL y persisten entre sesiones.
