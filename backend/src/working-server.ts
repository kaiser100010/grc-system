// ARCHIVO: src/working-server.ts
// SERVIDOR COMPLETO Y FUNCIONAL CON TU SCHEMA

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());

// Log de peticiones
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== RUTAS BÁSICAS ====================

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// ==================== EMPLEADOS ====================

// Obtener todos los empleados
app.get('/resources/employees', async (req, res) => {
  try {
    console.log('📋 Obteniendo empleados...');
    
    const employees = await prisma.employee.findMany({
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

// API de empleados
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json({
      success: true,
      data: employees,
      total: employees.length
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Error'
    });
  }
});

// Crear empleado
app.post('/api/employees', async (req, res) => {
  try {
    const { employeeId, firstName, lastName, email, department, position, manager, status, startDate } = req.body;
    
    // Validación básica
    if (!employeeId || !firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: employeeId, firstName, lastName, email'
      });
    }
    
    const employee = await prisma.employee.create({
      data: {
        employeeId,
        firstName,
        lastName,
        email,
        department,
        position,
        manager,
        status: status || 'ACTIVE',
        startDate: startDate ? new Date(startDate) : null
      }
    });
    
    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error creando empleado:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Error creando empleado'
    });
  }
});

// ==================== AUTENTICACIÓN ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Intento de login:', req.body.email);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Contraseña incorrecta para:', email);
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }
    
    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('✅ Login exitoso para:', email);
    
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        tokens: {
          accessToken: token,
          refreshToken: token, // Por simplicidad, usando el mismo token
          expiresIn: '7d'
        }
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

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Intento de registro:', req.body.email);
    const { email, password, firstName, lastName } = req.body;
    
    // Validación
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
    }
    
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'USER'
      }
    });
    
    // Generar token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('✅ Usuario registrado:', email);
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        tokens: {
          accessToken: token,
          refreshToken: token,
          expiresIn: '7d'
        }
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

// Obtener perfil (requiere autenticación)
app.get('/api/auth/me', async (req, res) => {
  try {
    // Verificar token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado'
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        _count: {
          select: {
            createdTasks: true,
            assignedTasks: true,
            assignedRisks: true,
            assignedControls: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(401).json({ 
      success: false,
      error: 'Token inválido o expirado'
    });
  }
});

// ==================== OTRAS ENTIDADES ====================

// Tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json({
      success: true,
      data: tasks,
      total: tasks.length
    });
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Error'
    });
  }
});

// Riesgos
app.get('/api/risks', async (req, res) => {
  try {
    const risks = await prisma.risk.findMany({
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json({
      success: true,
      data: risks,
      total: risks.length
    });
  } catch (error) {
    console.error('Error obteniendo riesgos:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Error'
    });
  }
});

// ==================== DIAGNÓSTICO ====================

app.get('/api/diagnostic', async (req, res) => {
  try {
    const diagnostic = {
      database: 'connected',
      models: {
        users: await prisma.user.count(),
        employees: await prisma.employee.count(),
        tasks: await prisma.task.count(),
        risks: await prisma.risk.count(),
        controls: await prisma.control.count(),
        incidents: await prisma.incident.count(),
        policies: await prisma.policy.count(),
        vendors: await prisma.vendor.count(),
        systems: await prisma.system.count(),
        assets: await prisma.asset.count(),
        evidence: await prisma.evidence.count(),
        activities: await prisma.activity.count()
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(diagnostic);
  } catch (error) {
    res.status(500).json({
      database: 'error',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    path: req.originalUrl
  });
});

// ==================== INICIAR SERVIDOR ====================

async function startServer() {
  try {
    console.log('🔄 Conectando a PostgreSQL...');
    await prisma.$connect();
    console.log('✅ Conectado a PostgreSQL');
    
    // Mostrar estadísticas
    const stats = {
      users: await prisma.user.count(),
      employees: await prisma.employee.count(),
      tasks: await prisma.task.count(),
      risks: await prisma.risk.count()
    };
    
    console.log('📊 Estado de la base de datos:');
    console.log(`   👤 Usuarios: ${stats.users}`);
    console.log(`   👥 Empleados: ${stats.employees}`);
    console.log(`   📋 Tareas: ${stats.tasks}`);
    console.log(`   ⚠️  Riesgos: ${stats.risks}`);
    
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║         SERVIDOR GRC FUNCIONANDO              ║
╠════════════════════════════════════════════════╣
║  🚀 Puerto: ${PORT}                               ║
║  🔗 URL: http://localhost:${PORT}                 ║
╠════════════════════════════════════════════════╣
║  ENDPOINTS DISPONIBLES:                        ║
║                                                 ║
║  Públicos:                                      ║
║  ✅ GET  /health                               ║
║  ✅ GET  /api/diagnostic                       ║
║  ✅ POST /api/auth/login                       ║
║  ✅ POST /api/auth/register                    ║
║                                                 ║
║  Recursos:                                      ║
║  ✅ GET  /resources/employees                  ║
║  ✅ GET  /api/employees                        ║
║  ✅ POST /api/employees                        ║
║  ✅ GET  /api/tasks                            ║
║  ✅ GET  /api/risks                            ║
║                                                 ║
║  Autenticados:                                 ║
║  🔐 GET  /api/auth/me                          ║
╚════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ ERROR FATAL:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n👋 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Iniciar servidor
startServer();