@echo off
echo ============================================
echo     Test de Conexion - VitalYou API
echo ============================================
echo.

REM Verificar si la API está corriendo
echo Verificando si la API está ejecutándose...
curl -s http://localhost:8080/api/workouts >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ API está ejecutándose correctamente
    echo.
    echo 📡 Endpoints disponibles:
    echo    - GET  http://localhost:8080/api/workouts
    echo    - POST http://localhost:8080/api/auth/login
    echo    - POST http://localhost:8080/api/auth/register
    echo.
    echo 🗄️ Base de datos H2 Console:
    echo    - URL: http://localhost:8080/api/h2-console
    echo    - JDBC URL: jdbc:h2:mem:vitalyou
    echo    - Usuario: sa
    echo    - Contraseña: password
    echo.
    echo ✨ ¡Tu API VitalYou está lista para conectarse con tu app móvil!
) else (
    echo ❌ La API no está ejecutándose
    echo.
    echo Para iniciar la API, ejecuta: start.bat
    echo O manualmente: mvnw spring-boot:run
)

echo.
pause
