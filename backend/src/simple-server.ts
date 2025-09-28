// ARCHIVO: src/simple-server.ts
// SERVIDOR MÍNIMO SOLO PARA EMPLEADOS

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = 3001; // Puerto fijo 3001

// Middleware
app.use(cors());
app.use(express.json());

// Log de todas las peticiones
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ====== RUTAS BÁSICAS ======

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check solicitado');
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Servidor simple funcionando'
  });
});

// Obtener todos los empleados - Ruta para compatibilidad con frontend
app.get('/resources/employees', async (req, res) => {
  try {
    console.log('📋 Obteniendo empleados desde /resources/employees...');
    
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`✅ Encontrados ${employees.length} empleados`);
    
    res.json({
      success: true,
      data: employees,
      total: employees.length
    });
  } catch (error) {
    console.error('❌ Error obteniendo empleados:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error obteniendo empleados',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Obtener todos los empleados - Ruta API
app.get('/api/employees', async (req, res) => {
  try {
    console.log('📋 Obteniendo empleados desde /api/employees...');
    
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`✅ Encontrados ${employees.length} empleados`);
    
    res.json({
      success: true,
      data: employees,
      total: employees.length
    });
  } catch (error) {
    console.error('❌ Error obteniendo empleados:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error obteniendo empleados',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Login falso (solo para evitar error 500)
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login temporal (sin autenticación real)');
  res.json({
    success: true,
    message: 'Login deshabilitado temporalmente',
    data: {
      user: { email: 'test@test.com' },
      tokens: { accessToken: 'fake-token' }
    }
  });
});

// Register falso (solo para evitar error 500)
app.post('/api/auth/register', (req, res) => {
  console.log('📝 Register temporal (sin autenticación real)');
  res.json({
    success: true,
    message: 'Register deshabilitado temporalmente'
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  console.log(`⚠️ Ruta no encontrada: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// ====== INICIAR SERVIDOR ======
async function startServer() {
  try {
    // Conectar a base de datos
    console.log('🔄 Conectando a PostgreSQL...');
    await prisma.$connect();
    console.log('✅ Conectado a PostgreSQL');
    
    // Verificar datos
    const employeeCount = await prisma.employee.count();
    const userCount = await prisma.user.count();
    const departmentCount = await prisma.department.count();
    
    console.log('📊 Estado de la base de datos:');
    console.log(`   - Empleados: ${employeeCount}`);
    console.log(`   - Usuarios: ${userCount}`);
    console.log(`   - Departamentos: ${departmentCount}`);
    
    // Si no hay empleados, mostrar advertencia
    if (employeeCount === 0) {
      console.log('⚠️ ADVERTENCIA: No hay empleados en la base de datos');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║     SERVIDOR SIMPLE INICIADO          ║
╠════════════════════════════════════════╣
║  Puerto: ${PORT}                          ║
║  URL: http://localhost:${PORT}            ║
╠════════════════════════════════════════╣
║  ENDPOINTS DISPONIBLES:                ║
║  ✅ GET  /health                       ║
║  ✅ GET  /resources/employees          ║
║  ✅ GET  /api/employees                ║
║  ⚠️  POST /api/auth/login (temporal)   ║
║  ⚠️  POST /api/auth/register (temporal)║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ ERROR FATAL:', error);
    process.exit(1);
  }
}

// Manejo de cierre
process.on('SIGINT', async () => {
  console.log('\n👋 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Iniciar
startServer();