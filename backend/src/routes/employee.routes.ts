import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/employees - Obtener todos los empleados
router.get('/', async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        employeeId: 'asc'
      }
    });

    res.json({
      success: true,
      data: employees,
      count: employees.length
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener empleados'
    });
  }
});

// GET /api/employees/:id - Obtener un empleado por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const employee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Empleado no encontrado'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener empleado'
    });
  }
});

// POST /api/employees - Crear nuevo empleado
router.post('/', async (req: Request, res: Response) => {
  try {
    // Filtrar solo los campos que existen en el modelo
    const validData = {
      employeeId: req.body.employeeId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      department: req.body.department,
      position: req.body.position,
      manager: req.body.manager,
      // Convertir status a mayúsculas para que coincida con el enum
      status: req.body.status ? req.body.status.toUpperCase() : 'ACTIVE',
      startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
      endDate: req.body.endDate ? new Date(req.body.endDate) : null,
    };

    const employee = await prisma.employee.create({
      data: validData
    });

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear empleado',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/employees/:id - Actualizar empleado
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Filtrar solo los campos que existen en el modelo
    const validData: any = {};
    
    if (req.body.employeeId) validData.employeeId = req.body.employeeId;
    if (req.body.firstName) validData.firstName = req.body.firstName;
    if (req.body.lastName) validData.lastName = req.body.lastName;
    if (req.body.email) validData.email = req.body.email;
    if (req.body.department) validData.department = req.body.department;
    if (req.body.position) validData.position = req.body.position;
    if (req.body.manager !== undefined) validData.manager = req.body.manager;
    // Convertir status a mayúsculas
    if (req.body.status) validData.status = req.body.status.toUpperCase();
    if (req.body.startDate) validData.startDate = new Date(req.body.startDate);
    if (req.body.endDate) validData.endDate = new Date(req.body.endDate);
    
    const employee = await prisma.employee.update({
      where: { id },
      data: validData
    });

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar empleado',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/employees/:id - Eliminar empleado
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.employee.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Empleado eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar empleado'
    });
  }
});

export default router;