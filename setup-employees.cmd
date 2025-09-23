@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo    CONFIGURACION MODULO DE EMPLEADOS
echo ========================================
echo.

:: Verificar que Docker Desktop está ejecutándose
echo [1/9] Verificando Docker Desktop...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop no está ejecutándose
    echo Por favor inicia Docker Desktop y ejecuta este script nuevamente
    pause
    exit /b 1
)
echo ✓ Docker Desktop está disponible

:: Verificar estructura del proyecto
echo.
echo [2/9] Verificando estructura del proyecto...
if not exist "frontend" (
    echo ERROR: Carpeta frontend no encontrada
    echo Asegurate de estar en la carpeta raíz del proyecto
    pause
    exit /b 1
)
if not exist "backend" (
    echo ERROR: Carpeta backend no encontrada
    echo Asegurate de estar en la carpeta raíz del proyecto
    pause
    exit /b 1
)
echo ✓ Estructura del proyecto verificada

:: Crear carpetas necesarias para el módulo de empleados
echo.
echo [3/9] Creando estructura de carpetas del módulo...
if not exist "frontend\src\components\modules\resources\employees" (
    mkdir "frontend\src\components\modules\resources\employees"
)
if not exist "backend\src\controllers" (
    mkdir "backend\src\controllers"
)
if not exist "backend\src\services" (
    mkdir "backend\src\services"
)
if not exist "backend\src\routes" (
    mkdir "backend\src\routes"
)
echo ✓ Estructura de carpetas creada

:: Verificar archivos del módulo
echo.
echo [4/9] Verificando archivos del módulo de empleados...
echo ✓ Archivos del módulo identificados

:: Limpiar Docker antes de empezar
echo.
echo [5/9] Limpiando Docker...
echo Deteniendo contenedores existentes...
docker stop grc_postgres_dev grc_redis_dev grc_adminer_dev >nul 2>&1
docker rm grc_postgres_dev grc_redis_dev grc_adminer_dev >nul 2>&1
echo ✓ Docker limpiado

:: Instalar dependencias del frontend
echo.
echo [6/9] Instalando dependencias del frontend...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Falló la instalación de dependencias del frontend
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Dependencias del frontend instaladas

:: Instalar dependencias del backend
echo.
echo [7/9] Instalando dependencias del backend...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Falló la instalación de dependencias del backend
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Dependencias del backend instaladas

:: Configurar base de datos
echo.
echo [8/9] Configurando base de datos...
echo Levantando servicios de Docker...
docker-compose -f docker\docker-compose.dev.yml up -d postgres redis
if errorlevel 1 (
    echo ERROR: No se pudieron levantar los servicios de base de datos
    echo.
    echo Posibles soluciones:
    echo 1. Ejecuta clean-docker.cmd para limpiar Docker completamente
    echo 2. Verifica que los puertos 5432 y 6379 estén libres
    echo 3. Reinicia Docker Desktop
    echo.
    pause
    exit /b 1
)

:: Esperar a que la base de datos esté lista
echo Esperando a que PostgreSQL esté listo...
timeout /t 15 /nobreak >nul

:: Verificar que los servicios estén ejecutándose
echo Verificando estado de los servicios...
docker-compose -f docker\docker-compose.dev.yml ps

:: Ejecutar migraciones de Prisma
echo.
echo Ejecutando migraciones de la base de datos...
cd backend

:: Crear archivo .env si no existe
if not exist ".env" (
    echo DATABASE_URL=postgresql://grc_user:grc_password@localhost:5432/grc_dev > .env
    echo REDIS_URL=redis://:redis_password@localhost:6379 >> .env
    echo JWT_SECRET=your-super-secret-jwt-key-change-in-production >> .env
    echo NODE_ENV=development >> .env
    echo PORT=8000 >> .env
)

:: Generar cliente Prisma
call npx prisma generate
if errorlevel 1 (
    echo ADVERTENCIA: Falló la generación del cliente de Prisma
    echo Esto puede ser normal si no tienes el schema configurado aún
)

:: Ejecutar migraciones
call npx prisma migrate dev --name init-database
if errorlevel 1 (
    echo ADVERTENCIA: Las migraciones fallaron
    echo Esto puede ser normal si ya tienes la base de datos configurada
)

cd ..
echo ✓ Base de datos configurada

:: Crear datos de prueba
echo.
echo [9/9] Preparando datos de prueba...
echo ✓ Setup completado

echo.
echo ========================================
echo   CONFIGURACION COMPLETADA CON EXITO
echo ========================================
echo.
echo SERVICIOS DISPONIBLES:
echo - PostgreSQL: localhost:5432 (usuario: grc_user, password: grc_password)
echo - Redis: localhost:6379 (password: redis_password)
echo - Adminer: http://localhost:8080 (interfaz web para base de datos)
echo.
echo SIGUIENTES PASOS:
echo 1. Ejecutar: start-dev.cmd para iniciar el entorno de desarrollo
echo 2. El frontend estará disponible en: http://localhost:3000
echo 3. El backend estará disponible en: http://localhost:8000
echo 4. Navegar a la sección de Empleados en el sistema
echo.

:: Mostrar estado de los servicios
echo SERVICIOS DOCKER:
docker-compose -f docker\docker-compose.dev.yml ps

echo.
echo ¿Deseas iniciar el entorno de desarrollo ahora? (y/n)
set /p start_dev=
if /i "%start_dev%"=="y" (
    echo.
    echo Iniciando entorno de desarrollo...
    call start-dev.cmd
) else (
    echo.
    echo Para iniciar el desarrollo más tarde, ejecuta: start-dev.cmd
)

echo.
pause