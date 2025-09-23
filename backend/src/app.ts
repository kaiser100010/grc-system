// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { config } from './config/app.config';
import { logger } from './utils/logger';

// Middleware imports
import { errorMiddleware } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';

// Route imports
import { authRoutes } from './routes/auth.routes';
import { taskRoutes } from './routes/task.routes';
import { riskRoutes } from './routes/risk.routes';
import { controlRoutes } from './routes/control.routes';
import { incidentRoutes } from './routes/incident.routes';
import { policyRoutes } from './routes/policy.routes';
import { evidenceRoutes } from './routes/evidence.routes';
import { employeeRoutes } from './routes/employee.routes';
import { dashboardRoutes } from './routes/dashboard.routes';

const app = express();
const prisma = new PrismaClient();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Make Prisma client available throughout the app
app.set('prisma', prisma);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      config.frontend.url
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS: Origin ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
}));

// Request parsing middleware
app.use(express.json({ 
  limit: '50mb',
  verify: (req: any, res, buf, encoding) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  }));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: config.env,
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      database: 'Connected',
      memory: process.memoryUsage()
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: 'Database connection failed'
    });
  }
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'GRC System API',
    version: process.env.npm_package_version || '1.0.0',
    description: 'Governance, Risk & Compliance Management System API',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      risks: '/api/risks',
      controls: '/api/controls',
      incidents: '/api/incidents',
      policies: '/api/policies',
      evidence: '/api/evidence',
      employees: '/api/resources/employees',
      dashboard: '/api/dashboard'
    },
    health: '/health'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/controls', controlRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/resources/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// API documentation route (if you implement Swagger/OpenAPI)
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'API Documentation',
    swagger: '/api/docs/swagger.json',
    redoc: '/api/docs/redoc',
    note: 'API documentation will be available when Swagger is configured'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /api',
      'POST /api/auth/login',
      'GET /api/tasks',
      'GET /api/risks', 
      'GET /api/controls',
      'GET /api/incidents',
      'GET /api/policies',
      'GET /api/evidence',
      'GET /api/resources/employees',
      'GET /api/dashboard',
      'GET /health'
    ]
  });
});

// Serve static files in production
if (config.env === 'production') {
  const path = require('path');
  
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  // Catch all handler: send back React's index.html file for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
  });
}

// Development catch-all
if (config.env === 'development') {
  app.get('*', (req, res) => {
    res.status(404).json({
      message: 'GRC System API - Development Mode',
      note: 'Frontend is running separately on http://localhost:3000',
      requestedPath: req.originalUrl,
      availableAPIs: '/api'
    });
  });
}

// Global error handling middleware (must be last)
app.use(errorMiddleware);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  
  await prisma.$disconnect();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;