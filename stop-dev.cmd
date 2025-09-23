 @echo off
echo ========================================
echo     DETENIENDO ENTORNO DE DESARROLLO
echo ========================================
echo.

:: Detener servicios Docker
echo [1/3] Deteniendo servicios Docker...
docker-compose -f docker\docker-compose.dev.yml down
if errorlevel 1 (
    echo ADVERTENCIA: Algunos servicios Docker no se pudieron detener
) else (
    echo ✓ Servicios Docker detenidos
)

:: Terminar procesos Node.js (frontend y backend)
echo.
echo [2/3] Terminando procesos de desarrollo...

:: Buscar y terminar procesos del backend (puerto 8000)
for /f "tokens=5" %%a in ('netstat -ano ^| find ":8000" ^| find "LISTENING"') do (
    echo Terminando proceso del backend (PID: %%a)
    taskkill /pid %%a /f >nul 2>&1
)

:: Buscar y terminar procesos del frontend (puerto 3000)
for /f "tokens=5" %%a in ('netstat -ano ^| find ":3000" ^| find "LISTENING"') do (
    echo Terminando proceso del frontend (PID: %%a)
    taskkill /pid %%a /f >nul 2>&1
)

:: Terminar procesos Node.js adicionales relacionados con el proyecto
taskkill /f /im node.exe /fi "WINDOWTITLE eq GRC Backend*" >nul 2>&1
taskkill /f /im node.exe /fi "WINDOWTITLE eq GRC Frontend*" >nul 2>&1

echo ✓ Procesos de desarrollo terminados

:: Limpiar puertos
echo.
echo [3/3] Liberando puertos...
netstat -ano | find ":3000" >nul
if not errorlevel 1 (
    echo ADVERTENCIA: El puerto 3000 aún está en uso
    echo Puede que necesites cerrar manualmente las ventanas del terminal
)

netstat -ano | find ":8000" >nul  
if not errorlevel 1 (
    echo ADVERTENCIA: El puerto 8000 aún está en uso
    echo Puede que necesites cerrar manualmente las ventanas del terminal
)

echo ✓ Verificación de puertos completada

echo.
echo ========================================
echo    ENTORNO DE DESARROLLO DETENIDO
echo ========================================
echo.
echo 🛑 SERVICIOS DETENIDOS:
echo    - Frontend (puerto 3000)
echo    - Backend (puerto 8000)  
echo    - PostgreSQL
echo    - Redis
echo.
echo 📝 NOTAS:
echo    - Si algunas ventanas de terminal siguen abiertas, puedes cerrarlas manualmente
echo    - Los datos de la base de datos se mantienen para la próxima sesión
echo    - Para reiniciar el desarrollo, ejecuta: start-dev.cmd
echo.
echo 🔄 COMANDOS ÚTILES:
echo    - Reiniciar desarrollo: start-dev.cmd
echo    - Ver logs Docker: docker-compose -f docker\docker-compose.dev.yml logs
echo    - Limpiar Docker: docker-compose -f docker\docker-compose.dev.yml down -v
echo.

:: Mostrar estado final de Docker
echo 🐳 ESTADO FINAL DE SERVICIOS:
docker-compose -f docker\docker-compose.dev.yml ps

echo.
echo ¿Deseas limpiar también los volúmenes de Docker? (y/n)
echo (Esto eliminará todos los datos de la base de datos)
set /p clean_volumes=
if /i "%clean_volumes%"=="y" (
    echo.
    echo Limpiando volúmenes de Docker...
    docker-compose -f docker\docker-compose.dev.yml down -v
    docker volume prune -f
    echo ✓ Volúmenes limpiados - Los datos de la base de datos han sido eliminados
) else (
    echo ✓ Los datos de la base de datos se mantienen para la próxima sesión
)

echo.
echo ========================================
echo ¡LIMPIEZA COMPLETADA!
echo ========================================
echo.
pause
