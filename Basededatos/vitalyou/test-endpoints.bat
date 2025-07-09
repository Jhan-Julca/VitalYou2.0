@echo off
echo ==========================================
echo  VitalYou API - Pruebas de Endpoints
echo ==========================================
echo.

echo Probando endpoint de prueba...
powershell -Command "Invoke-WebRequest -Uri 'http://localhost:8080/api/test' -Method GET | Select-Object -ExpandProperty Content"
echo.

echo Probando endpoint de workouts...
powershell -Command "Invoke-WebRequest -Uri 'http://localhost:8080/api/workouts' -Method GET | Select-Object -ExpandProperty Content"
echo.

echo Probando endpoint de login...
powershell -Command "Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/login' -Method POST -ContentType 'application/json' -Body '{\"email\":\"test@example.com\",\"password\":\"password\"}' | Select-Object -ExpandProperty Content"
echo.

echo ==========================================
echo  Todas las pruebas completadas
echo ==========================================
pause
