import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware para verificar autenticación
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado',
      });
    }

    // Extraer token
    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    const payload = AuthService.verifyAccessToken(token);

    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autorizado',
      });
    }

    // Agregar información del usuario al request
    req.user = payload;
    
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado',
    });
  }
};

/**
 * Middleware para verificar roles específicos
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para acceder a este recurso',
      });
    }

    next();
  };
};

/**
 * Middleware opcional de autenticación (no requiere token pero lo procesa si existe)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = AuthService.verifyAccessToken(token);
      
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          isActive: true,
        },
      });

      if (user && user.isActive) {
        req.user = payload;
      }
    }
    
    next();
  } catch (error) {
    // Ignorar errores de token y continuar sin autenticación
    next();
  }
};

/**
 * Middleware para verificar si es admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado. Se requieren permisos de administrador.',
    });
  }
  next();
};

/**
 * Middleware para verificar si es el propietario del recurso o admin
 */
export const isOwnerOrAdmin = (userIdField: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    const resourceUserId = req.params[userIdField];
    const isOwner = req.user.userId === resourceUserId;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para acceder a este recurso',
      });
    }

    next();
  };
};