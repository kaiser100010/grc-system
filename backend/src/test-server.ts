// Archivo: src/test-server.ts
// Este es un servidor de prueba para diagnosticar problemas

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware básicos
app.use(cors());
app.use(express.json());

// Log todas las peticiones
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// Ruta de prueba básica
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Servidor de prueba funcionando'
  });
});

// Ruta de prueba para la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    res.json({ 
      success: true, 
      message: 'Base de datos conectada',
      result 
    });
  } catch (error) {
    console.error('❌ Error de DB:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    });
  }
});

// Ruta para listar empleados (sin autenticación por ahora)
app.get('/api/employees', async (req, res) => {
  try {
    console.log('📋 Obteniendo empleados...');
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
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
      error: error instanceof Error ? error.message : 'Error obteniendo empleados' 
    });
  }
});

// Ruta temporal para compatibilidad con frontend
app.get('/resources/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
      }
    });
    res.json({
      success: true,
      data: employees,
      total: employees.length
    });
  } catch (error) {
    console.error('❌ Error en /resources/employees:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error' 
    });
  }
});

// Ruta de login simplificada para prueba
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Intento de login:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y password son requeridos'
      });
    }
    
    // Por ahora solo verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    // Respuesta temporal sin JWT
    res.json({
      success: true,
      message: 'Login de prueba exitoso',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error en login' 
    });
  }
});

// Ruta de registro simplificada para prueba  
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Intento de registro:', req.body);
    const { email, firstName, lastName, password } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
    }
    
    // Verificar si usuario existe
    const exists = await prisma.user.findUnique({
      where: { email }
    });
    
    if (exists) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }
    
    // Crear usuario sin encriptar (solo para prueba)
    const user = await prisma.user.create({
      data: {
        email,
        password: password, // En producción DEBE estar hasheado
        firstName,
        lastName,
        role: 'USER',
        isActive: true
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuario de prueba creado',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error en registro' 
    });
  }
});

// Manejo de errores 404
app.use('*', (req, res) => {
  console.log(`⚠️ Ruta no encontrada: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Conectar a base de datos
    await prisma.$connect();
    console.log('✅ Conectado a PostgreSQL');
    
    // Contar registros para verificar
    const userCount = await prisma.user.count();
    const employeeCount = await prisma.employee.count();
    console.log(`📊 Usuarios: ${userCount}, Empleados: ${employeeCount}`);
    
    app.listen(PORT, () => {
      console.log(`
========================================
🚀 SERVIDOR DE PRUEBA INICIADO
========================================
📍 Puerto: ${PORT}
🔗 URL: http://localhost:${PORT}

ENDPOINTS DE PRUEBA:
✅ GET  http://localhost:${PORT}/health
✅ GET  http://localhost:${PORT}/api/test-db
✅ GET  http://localhost:${PORT}/api/employees
✅ GET  http://localhost:${PORT}/resources/employees
✅ POST http://localhost:${PORT}/api/auth/login
✅ POST http://localhost:${PORT}/api/auth/register
========================================
      `);
    });
  } catch (error) {
    console.error('❌ Error fatal iniciando servidor:', error);
    process.exit(1);
  }
}

startServer();