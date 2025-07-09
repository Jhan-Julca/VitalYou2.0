@echo off
echo ========================================
echo  VitalYou API - Versión Simple v1.0.0
echo ========================================
echo.
echo  Iniciando servidor en el puerto 8080...
echo.
echo  Endpoints disponibles:
echo  - GET  /api/test       : Prueba de conexión
echo  - GET  /api/workouts   : Lista de workouts
echo  - POST /api/auth/login : Login simplificado
echo.
echo  Presiona Ctrl+C para detener el servidor
echo.
echo ========================================

cd /d "c:\Users\escla\OneDrive\Desktop\VitalYou\Basededatos\vitalyou"
mvn spring-boot:run

pause
