// Ruta: C:\Projects\GRC-Claude\grc-system\backend\src\app.ts

import express, { Application } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';

// Importar middleware
import { authenticate } from './middleware/auth.middleware';

// Crear aplicación Express
const app: Application = express();

// Inicializar Prisma
const prisma = new PrismaClient();

// Middleware básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Rutas de la API

// Rutas públicas (sin autenticación)
app.use('/api/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Ruta temporal para compatibilidad con el frontend (protegida)
app.use('/resources/employees', employeeRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    path: req.originalUrl
  });
});

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM señal recibida: cerrando servidor HTTP');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT señal recibida: cerrando servidor HTTP');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;