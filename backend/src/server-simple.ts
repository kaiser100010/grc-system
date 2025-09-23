import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware básico
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de salud (sin base de datos)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'GRC Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'GRC System API',
    version: '1.0.0',
    status: 'Running without database',
    endpoints: {
      health: '/health',
      employees: '/api/employees (mock)',
      tasks: '/api/tasks (mock)'
    }
  });
});

// Empleados mock (sin base de datos)
app.get('/api/employees', (req, res) => {
  res.json({
    status: 'success',
    data: {
      employees: [
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@company.com',
          department: 'IT',
          status: 'active'
        },
        {
          id: '2',
          firstName: 'María',
          lastName: 'García',
          email: 'maria.garcia@company.com',
          department: 'HR',
          status: 'active'
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        pages: 1
      }
    }
  });
});

// Tareas mock (sin base de datos)
app.get('/api/tasks', (req, res) => {
  res.json({
    status: 'success',
    data: {
      tasks: [
        {
          id: '1',
          title: 'Configurar servidor backend',
          description: 'Configurar y probar el servidor Express',
          status: 'in_progress',
          priority: 'high',
          createdAt: new Date().toISOString()
        }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        pages: 1
      },
      stats: {
        byStatus: [{ status: 'in_progress', _count: { status: 1 } }],
        byPriority: [{ priority: 'high', _count: { priority: 1 } }],
        overdue: 0
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 =====================================');
  console.log(`   SERVIDOR BACKEND INICIADO`);
  console.log(`   Puerto: ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API Info: http://localhost:${PORT}/api`);
  console.log('=====================================');
  console.log('');
});