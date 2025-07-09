@echo off
echo =====================================
echo    PROBANDO VITALYOU API CON BD REAL
echo =====================================
echo.

set BASE_URL=http://localhost:8080

echo 🏥 Verificando salud de la API...
curl -s %BASE_URL%/api/health
echo.
echo.

echo 🧪 Endpoint de prueba...
curl -s %BASE_URL%/api/test
echo.
echo.

echo 👥 Obteniendo usuarios...
curl -s %BASE_URL%/api/users
echo.
echo.

echo 🏋️ Obteniendo workouts...
curl -s %BASE_URL%/api/workouts
echo.
echo.

echo 📊 Obteniendo sesiones de entrenamiento...
curl -s %BASE_URL%/api/workout-sessions
echo.
echo.

echo 🔍 Probando endpoints específicos...
echo.

echo "- Usuario por ID (1):"
curl -s %BASE_URL%/api/users/1
echo.
echo.

echo "- Workout por ID (1):"
curl -s %BASE_URL%/api/workouts/1
echo.
echo.

echo "- Sesiones del usuario 1:"
curl -s %BASE_URL%/api/workout-sessions/user/1
echo.
echo.

echo "- Workouts de categoría FUERZA:"
curl -s %BASE_URL%/api/workouts/category/FUERZA
echo.
echo.

echo "- Workouts de dificultad PRINCIPIANTE:"
curl -s %BASE_URL%/api/workouts/difficulty/PRINCIPIANTE
echo.
echo.

echo =====================================
echo ✅ Pruebas completadas!
echo 🌐 Consola H2: http://localhost:8080/h2-console
echo    - JDBC URL: jdbc:h2:mem:testdb
echo    - User: sa
echo    - Password: (en blanco)
echo =====================================
pause
