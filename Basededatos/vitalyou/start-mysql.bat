@echo off
echo =====================================
echo    INICIANDO VITALYOU API CON MYSQL
echo =====================================
echo.

echo ⚠️  REQUISITOS:
echo    - MySQL Server debe estar ejecutándose
echo    - Puerto 3306 disponible
echo    - Usuario 'root' sin contraseña (o actualiza application.properties)
echo.

echo 🔧 Configuración actual:
echo    - Base de datos: vitalyou_db (se crea automáticamente)
echo    - Usuario: root
echo    - Puerto: 3306
echo.

echo 🚀 Iniciando aplicación...
mvn spring-boot:run

pause
