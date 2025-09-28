import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        // NO incluir password
      },
      orderBy: {
        firstName: 'asc'
      }
    });

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios'
    });
  }
});

// GET /api/users/active - Obtener usuarios activos (para asignar tareas)
router.get('/active', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      },
      orderBy: {
        firstName: 'asc'
      }
    });

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios activos'
    });
  }
});

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            assignedTasks: true,
            createdTasks: true,
            assignedRisks: true,
            assignedControls: true,
            reportedIncidents: true,
            assignedIncidents: true
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
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuario'
    });
  }
});

export default router;