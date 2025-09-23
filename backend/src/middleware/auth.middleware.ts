import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        organizationId: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ 
        status: 'error', 
        message: 'Token de acceso requerido' 
      });
      return;
    }

    // Verificar JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(token, secret);

    // Validar que el usuario existe y está activo
    const user = await prisma.user.findFirst({
      where: {
        id: payload.userId as string,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        organizationId: true,
      },
    });

    if (!user) {
      res.status(401).json({ 
        status: 'error', 
        message: 'Usuario no válido o inactivo' 
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      status: 'error', 
      message: 'Token inválido' 
    });
  }
};