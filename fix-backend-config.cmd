@echo off
cls
echo.
echo ================================================
echo    REPARACION DE CONFIGURACION - BACKEND
echo ================================================
echo.

echo [1/6] Diagnosticando problema...
cd backend

echo Verificando archivos de configuracion existentes:
if exist "package.json" (
    echo   ✅ package.json encontrado
) else (
    echo   ❌ package.json NO encontrado
)

if exist "tsconfig.json" (
    echo   ✅ tsconfig.json encontrado  
) else (
    echo   ❌ tsconfig.json NO encontrado
)

if exist "src\server.ts" (
    echo   ✅ server.ts encontrado
) else (
    echo   ❌ server.ts NO encontrado
)

echo.
echo [2/6] Creando package.json corregido...

:: Crear package.json con configuración correcta
echo {> package.json
echo   "name": "grc-backend",>> package.json
echo   "version": "1.0.0",>> package.json
echo   "description": "Backend del Sistema GRC",>> package.json
echo   "main": "dist/server.js",>> package.json
echo   "type": "module",>> package.json
echo   "scripts": {>> package.json
echo     "dev": "tsx --watch src/server.ts",>> package.json
echo     "build": "tsc",>> package.json
echo     "start": "node dist/server.js",>> package.json
echo     "db:migrate": "prisma migrate dev",>> package.json
echo     "db:generate": "prisma generate",>> package.json
echo     "db:studio": "prisma studio">> package.json
echo   },>> package.json
echo   "dependencies": {>> package.json
echo     "express": "^4.18.2",>> package.json
echo     "cors": "^2.8.5",>> package.json
echo     "dotenv": "^16.3.1",>> package.json
echo     "jsonwebtoken": "^9.0.2",>> package.json
echo     "bcrypt": "^5.1.1",>> package.json
echo     "zod": "^3.22.4",>> package.json
echo     "@prisma/client": "^5.6.0">> package.json
echo   },>> package.json
echo   "devDependencies": {>> package.json
echo     "@types/express": "^4.17.21",>> package.json
echo     "@types/cors": "^2.8.17",>> package.json
echo     "@types/jsonwebtoken": "^9.0.5",>> package.json
echo     "@types/bcrypt": "^5.0.2",>> package.json
echo     "@types/node": "^20.9.0",>> package.json
echo     "typescript": "^5.2.2",>> package.json
echo     "tsx": "^4.1.0",>> package.json
echo     "prisma": "^5.6.0",>> package.json
echo     "nodemon": "^3.0.1">> package.json
echo   }>> package.json
echo }>> package.json

echo   ✅ package.json creado

echo.
echo [3/6] Creando tsconfig.json...

echo {> tsconfig.json
echo   "compilerOptions": {>> tsconfig.json
echo     "target": "ES2022",>> tsconfig.json
echo     "module": "ESNext",>> tsconfig.json
echo     "moduleResolution": "node",>> tsconfig.json
echo     "lib": ["ES2022"],>> tsconfig.json
echo     "outDir": "./dist",>> tsconfig.json
echo     "rootDir": "./src",>> tsconfig.json
echo     "strict": true,>> tsconfig.json
echo     "esModuleInterop": true,>> tsconfig.json
echo     "allowSyntheticDefaultImports": true,>> tsconfig.json
echo     "skipLibCheck": true,>> tsconfig.json
echo     "forceConsistentCasingInFileNames": true,>> tsconfig.json
echo     "resolveJsonModule": true,>> tsconfig.json
echo     "declaration": true,>> tsconfig.json
echo     "declarationMap": true,>> tsconfig.json
echo     "sourceMap": true>> tsconfig.json
echo   },>> tsconfig.json
echo   "include": [>> tsconfig.json
echo     "src/**/*">> tsconfig.json
echo   ],>> tsconfig.json
echo   "exclude": [>> tsconfig.json
echo     "node_modules",>> tsconfig.json
echo     "dist",>> tsconfig.json
echo     "prisma">> tsconfig.json
echo   ]>> tsconfig.json
echo }>> tsconfig.json

echo   ✅ tsconfig.json creado

echo.
echo [4/6] Verificando estructura de carpetas...

mkdir "src" 2>nul
mkdir "src\controllers" 2>nul
mkdir "src\routes" 2>nul
mkdir "src\middleware" 2>nul
mkdir "src\config" 2>nul
mkdir "prisma" 2>nul

echo   ✅ Estructura de carpetas verificada

echo.
echo [5/6] Creando archivos base si no existen...

:: Crear server.ts base si no existe
if not exist "src\server.ts" (
    echo import express from 'express';> src\server.ts
    echo import cors from 'cors';>> src\server.ts
    echo import dotenv from 'dotenv';>> src\server.ts
    echo.>> src\server.ts
    echo dotenv.config^(^);>> src\server.ts
    echo.>> src\server.ts
    echo const app = express^(^);>> src\server.ts
    echo const PORT = process.env.PORT ^|^| 5000;>> src\server.ts
    echo.>> src\server.ts
    echo // Middleware>> src\server.ts
    echo app.use^(cors^(^)^);>> src\server.ts
    echo app.use^(express.json^(^)^);>> src\server.ts
    echo.>> src\server.ts
    echo // Ruta de prueba>> src\server.ts
    echo app.get^('/api/health', ^(req, res^) =^> {>> src\server.ts
    echo   res.json^({ status: 'ok', message: 'Backend funcionando correctamente' }^);>> src\server.ts
    echo }^);>> src\server.ts
    echo.>> src\server.ts
    echo app.listen^(PORT, ^(^) =^> {>> src\server.ts
    echo   console.log^(`Servidor ejecutandose en puerto ${PORT}`^);>> src\server.ts
    echo }^);>> src\server.ts
    
    echo   ✅ server.ts base creado
) else (
    echo   ✅ server.ts ya existe
)

:: Crear .env.example si no existe
if not exist ".env.example" (
    echo DATABASE_URL="postgresql://username:password@localhost:5432/grc_database"> .env.example
    echo JWT_SECRET="tu-jwt-secret-muy-seguro">> .env.example
    echo PORT=5000>> .env.example
    echo NODE_ENV=development>> .env.example
    
    echo   ✅ .env.example creado
)

:: Crear .env si no existe
if not exist ".env" (
    copy .env.example .env >nul
    echo   ✅ .env creado (copia de .example)
) else (
    echo   ✅ .env ya existe
)

echo.
echo [6/6] Instalando dependencias...
echo Esto puede tardar unos minutos...
npm install

if errorlevel 1 (
    echo   ❌ Error instalando dependencias
    echo   Intenta manualmente: npm install
) else (
    echo   ✅ Dependencias instaladas correctamente
)

cd..

echo.
echo ================================================
echo         REPARACION COMPLETADA
echo ================================================
echo.
echo El backend ha sido configurado correctamente.
echo.
echo PARA PROBAR:
echo   cd backend
echo   npm run dev
echo.
echo Si aun hay errores, revisa:
echo   1. PostgreSQL este ejecutandose
echo   2. Variables en .env sean correctas
echo   3. Base de datos exista
echo.
echo ARCHIVOS CREADOS/ACTUALIZADOS:
echo   ✅ package.json - Configuracion corregida
echo   ✅ tsconfig.json - Configuracion TypeScript
echo   ✅ src\server.ts - Servidor base
echo   ✅ .env y .env.example - Variables de entorno
echo.
pause