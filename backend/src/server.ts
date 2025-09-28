// Ruta: C:\Projects\GRC-Claude\grc-system\backend\src\server.ts

import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
async function startServer() {
  try {
    // Verificar conexión a base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
      console.log(`👥 Employees API: http://localhost:${PORT}/api/employees`);
      console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
      console.log(`👤 Users API: http://localhost:${PORT}/api/users`);
      console.log(`\n⚡ Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Iniciar servidor
startServer();