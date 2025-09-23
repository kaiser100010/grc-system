@echo off
echo ========================================
echo       LIMPIANDO DOCKER COMPLETAMENTE
echo ========================================
echo.

echo [1/5] Deteniendo todos los contenedores...
for /f %%i in ('docker ps -q') do docker stop %%i
echo ✓ Contenedores detenidos

echo.
echo [2/5] Eliminando contenedores...
for /f %%i in ('docker ps -aq') do docker rm %%i
echo ✓ Contenedores eliminados

echo.
echo [3/5] Eliminando redes no utilizadas...
docker network prune -f
echo ✓ Redes limpiadas

echo.
echo [4/5] Eliminando volúmenes no utilizados...
docker volume prune -f
echo ✓ Volúmenes limpiados

echo.
echo [5/5] Eliminando imágenes no utilizadas...
docker image prune -f
echo ✓ Imágenes limpiadas

echo.
echo ========================================
echo       DOCKER LIMPIO COMPLETAMENTE
echo ========================================
echo.
echo Ahora puedes ejecutar setup-employees.cmd nuevamente
echo.
pause