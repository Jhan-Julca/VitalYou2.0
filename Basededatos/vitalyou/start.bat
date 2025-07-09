@echo off
echo ============================================
echo     VitalYou API - Spring Boot Backend
echo ============================================
echo.
echo Iniciando la aplicacion...
echo.

REM Verificar si Maven está instalado
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Maven no está instalado o no está en el PATH
    echo Por favor instala Maven y agregalo al PATH del sistema
    pause
    exit /b 1
)

REM Verificar si Java está instalado
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Java no está instalado o no está en el PATH
    echo Por favor instala Java 21 y agregalo al PATH del sistema
    pause
    exit /b 1
)

echo Compilando y ejecutando la aplicacion...
echo.
mvnw spring-boot:run

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error al ejecutar la aplicacion
    pause
    exit /b 1
)

echo.
echo La aplicacion se ha iniciado correctamente
echo API disponible en: http://localhost:8080/api
echo H2 Console disponible en: http://localhost:8080/api/h2-console
echo.
pause
