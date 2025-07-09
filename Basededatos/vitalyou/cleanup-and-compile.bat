@echo off
echo ===================================
echo  Limpiando archivos complejos...
echo ===================================

cd /d "c:\Users\escla\OneDrive\Desktop\VitalYou\Basededatos\vitalyou\src\main\java\com\example\vitalyou"

rem Eliminar modelos complejos
del /f /q "model\User.java" 2>nul
del /f /q "model\Exercise.java" 2>nul
del /f /q "model\WorkoutSession.java" 2>nul
del /f /q "model\MealEntry.java" 2>nul
del /f /q "model\FoodItem.java" 2>nul
del /f /q "model\ProgressEntry.java" 2>nul

rem Eliminar DTOs complejos
del /f /q "dto\LoginRequest.java" 2>nul
del /f /q "dto\RegisterRequest.java" 2>nul

rem Eliminar servicios complejos
del /f /q "service\UserService.java" 2>nul

rem Eliminar controladores complejos
del /f /q "controller\AuthController.java" 2>nul
del /f /q "controller\WorkoutController.java" 2>nul

rem Eliminar repositorios problemáticos
del /f /q "repository\UserRepository.java" 2>nul
del /f /q "repository\WorkoutSessionRepository.java" 2>nul
del /f /q "repository\MealEntryRepository.java" 2>nul
del /f /q "repository\ProgressEntryRepository.java" 2>nul

echo Archivos problemáticos eliminados
echo Probando compilación...

cd /d "c:\Users\escla\OneDrive\Desktop\VitalYou\Basededatos\vitalyou"
mvn compile

echo.
echo ===================================
echo  Proceso completado
echo ===================================
pause
