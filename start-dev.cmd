 
@echo off
echo ========================================
echo     INICIANDO ENTORNO DE DESARROLLO
echo ========================================
echo.

:: Verificar Docker Desktop
echo [1/4] Verificando Docker Desktop...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop no está ejecutándose
    echo Por favor inicia Docker Desktop y ejecuta este script nuevamente
    pause
    exit /b 1
)
echo ✓ Docker Desktop disponible

:: Levantar servicios de infraestructura
echo.
echo [2/4] Iniciando servicios de infraestructura...
docker-compose -f docker\docker-compose.dev.yml up -d postgres redis
if errorlevel 1 (
    echo ERROR: No se pudieron iniciar los servicios
    pause
    exit /b 1
)
echo ✓ PostgreSQL y Redis iniciados

:: Esperar a que los servicios estén listos
echo.
echo [3/4] Esperando a que los servicios estén listos...
timeout /t 5 /nobreak >nul
echo ✓ Servicios listos

:: Iniciar aplicaciones
echo.
echo [4/4] Iniciando aplicaciones...
echo.
echo NOTA: Se abrirán dos ventanas de terminal:
echo - Una para el backend (puerto 8000)
echo - Una para el frontend (puerto 3000)
echo.
echo No cierres estas ventanas mientras desarrollas.
echo Para detener el desarrollo, presiona Ctrl+C en cada ventana.
echo.

:: Iniciar backend en una nueva ventana
echo Iniciando backend...
start "GRC Backend" cmd /k "cd backend && npm run dev"

:: Esperar un momento antes de iniciar el frontend
timeout /t 3 /nobreak >nul

:: Iniciar frontend en una nueva ventana
echo Iniciando frontend...
start "GRC Frontend" cmd /k "cd frontend && npm run dev"

:: Mostrar información de acceso
echo.
echo ========================================
echo      ENTORNO DE DESARROLLO ACTIVO
echo ========================================
echo.
echo 🚀 APLICACIONES:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo.
echo 🗄️  BASE DE DATOS:
echo    PostgreSQL: localhost:5432
echo    Database:   grc_dev
echo    User:       grc_user
echo.
echo 📊 CACHE:
echo    Redis: localhost:6379
echo.
echo 📁 NAVEGACION:
echo    - Dashboard: http://localhost:3000/dashboard
echo    - Empleados: http://localhost:3000/resources/employees
echo    - API Docs:  http://localhost:8000/api/docs
echo.
echo ⚡ DESARROLLO:
echo    Los cambios se recargarán automáticamente
echo    Revisa las ventanas de terminal para logs y errores
echo.
echo 🛑 PARA DETENER:
echo    1. Presiona Ctrl+C en ambas ventanas de terminal
echo    2. Ejecuta: stop-dev.cmd
echo.

:: Mostrar estado de servicios Docker
echo 🐳 SERVICIOS DOCKER:
docker-compose -f docker\docker-compose.dev.yml ps

echo.
echo Presiona cualquier tecla para abrir el navegador...
pause >nul

:: Abrir navegador
start http://localhost:3000

echo.
echo ========================================
echo ¡ENTORNO DE DESARROLLO LISTO!
echo ========================================
echo.
echo Este terminal puede cerrarse de forma segura.
echo Las aplicaciones seguirán ejecutándose en sus ventanas respectivas.
echo.
pause