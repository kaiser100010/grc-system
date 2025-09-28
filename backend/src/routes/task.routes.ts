import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/tasks - Obtener todas las tareas
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, priority, assigneeId, creatorId } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;
    if (creatorId) where.creatorId = creatorId;

    const tasks = await prisma.task.findMany({
      where,
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
        },
        risk: {
          select: {
            id: true,
            title: true,
            level: true
          }
        },
        control: {
          select: {
            id: true,
            title: true,
            type: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener tareas',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/tasks/stats - Obtener estadísticas de tareas
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: 'PENDING' } }),
      prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { status: 'COMPLETED' } }),
      prisma.task.count({ 
        where: { 
          status: { not: 'COMPLETED' },
          dueDate: { lt: new Date() } 
        } 
      })
    ]);

    const byPriority = await prisma.task.groupBy({
      by: ['priority'],
      _count: true
    });

    const byStatus = await prisma.task.groupBy({
      by: ['status'],
      _count: true
    });

    res.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        completed,
        overdue,
        byPriority: byPriority.map(p => ({
          priority: p.priority,
          count: p._count
        })),
        byStatus: byStatus.map(s => ({
          status: s.status,
          count: s._count
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas'
    });
  }
});

// GET /api/tasks/:id - Obtener una tarea por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        creator: true,
        risk: true,
        control: true,
        incident: true,
        evidence: true,
        activities: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener tarea'
    });
  }
});

// POST /api/tasks - Crear nueva tarea
router.post('/', async (req: Request, res: Response) => {
  try {
    const validData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'PENDING',
      priority: req.body.priority || 'MEDIUM',
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      startDate: req.body.startDate ? new Date(req.body.startDate) : null,
      endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      progress: req.body.progress || 0,
      assigneeId: req.body.assigneeId || null,
      creatorId: req.body.creatorId, // Required
      riskId: req.body.riskId || null,
      controlId: req.body.controlId || null,
      incidentId: req.body.incidentId || null
    };

    const task = await prisma.task.create({
      data: validData,
      include: {
        assignee: true,
        creator: true
      }
    });

    // Registrar actividad
    await prisma.activity.create({
      data: {
        action: 'CREATE',
        entityType: 'TASK',
        entityId: task.id,
        userId: req.body.creatorId,
        details: { message: 'Tarea creada' }
      }
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear tarea',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Obtener la tarea actual para comparar cambios
    const currentTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!currentTask) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    const validData: any = {};
    
    if (req.body.title !== undefined) validData.title = req.body.title;
    if (req.body.description !== undefined) validData.description = req.body.description;
    if (req.body.status !== undefined) validData.status = req.body.status;
    if (req.body.priority !== undefined) validData.priority = req.body.priority;
    if (req.body.progress !== undefined) validData.progress = req.body.progress;
    if (req.body.dueDate !== undefined) validData.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
    if (req.body.startDate !== undefined) validData.startDate = req.body.startDate ? new Date(req.body.startDate) : null;
    if (req.body.endDate !== undefined) validData.endDate = req.body.endDate ? new Date(req.body.endDate) : null;
    if (req.body.assigneeId !== undefined) validData.assigneeId = req.body.assigneeId;
    if (req.body.riskId !== undefined) validData.riskId = req.body.riskId;
    if (req.body.controlId !== undefined) validData.controlId = req.body.controlId;
    if (req.body.incidentId !== undefined) validData.incidentId = req.body.incidentId;

    const task = await prisma.task.update({
      where: { id },
      data: validData,
      include: {
        assignee: true,
        creator: true,
        risk: true,
        control: true
      }
    });

    // Registrar actividad con detalles del cambio
    const changes: any = {};
    if (currentTask.status !== task.status) {
      changes.statusChange = `${currentTask.status} → ${task.status}`;
    }
    if (currentTask.progress !== task.progress) {
      changes.progressChange = `${currentTask.progress}% → ${task.progress}%`;
    }

    await prisma.activity.create({
      data: {
        action: 'UPDATE',
        entityType: 'TASK',
        entityId: task.id,
        userId: req.body.updatedBy || req.body.creatorId,
        details: { 
          message: 'Tarea actualizada',
          changes 
        }
      }
    });

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar tarea',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    // Eliminar actividades relacionadas primero
    await prisma.activity.deleteMany({
      where: { taskId: id }
    });

    // Eliminar la tarea
    await prisma.task.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar tarea',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/tasks/:id/progress - Actualizar progreso de una tarea
router.put('/:id/progress', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        error: 'El progreso debe ser un valor entre 0 y 100'
      });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { 
        progress,
        status: progress === 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'PENDING'
      }
    });

    await prisma.activity.create({
      data: {
        action: 'UPDATE',
        entityType: 'TASK',
        entityId: task.id,
        userId: req.body.userId,
        details: { 
          message: `Progreso actualizado a ${progress}%`
        }
      }
    });

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error updating task progress:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar progreso'
    });
  }
});

export default router;