// Ruta: C:\Projects\GRC-Claude\grc-system\backend\src\controllers\auth.controller.ts

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interfaz para Request autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * POST /api/auth/login
 * Login de usuario
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos',
      });
    }

    const result = await AuthService.login(email, password);

    res.json({
      success: true,
      data: result,
      message: 'Login exitoso',
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error en login',
    });
  }
};

/**
 * POST /api/auth/register
 * Registro de nuevo usuario
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validación básica
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos',
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido',
      });
    }

    // Validar contraseña
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 8 caracteres',
      });
    }

    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Usuario registrado exitosamente',
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error en registro',
    });
  }
};

/**
 * POST /api/auth/refresh
 * Renovar token usando refresh token
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token es requerido',
      });
    }

    const tokens = await AuthService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: tokens,
      message: 'Token renovado exitosamente',
    });
  } catch (error) {
    console.error('Error renovando token:', error);
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error renovando token',
    });
  }
};

/**
 * GET /api/auth/me
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    const profile = await AuthService.getProfile(req.user.userId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error obteniendo perfil',
    });
  }
};

/**
 * PUT /api/auth/change-password
 * Cambiar contraseña
 */
export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Contraseña actual y nueva son requeridas',
      });
    }

    const result = await AuthService.changePassword(
      req.user.userId,
      currentPassword,
      newPassword
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error cambiando contraseña',
    });
  }
};

/**
 * POST /api/auth/logout
 * Logout (principalmente para limpiar en el cliente)
 */
export const logout = async (req: AuthenticatedRequest, res: Response) => {
  // En una implementación más completa, aquí podrías:
  // - Invalidar el token en una blacklist
  // - Limpiar sesiones en Redis
  // - Registrar el evento de logout

  res.json({
    success: true,
    message: 'Logout exitoso',
  });
};

/**
 * POST /api/auth/verify
 * Verificar si un token es válido
 */
export const verify = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token es requerido',
      });
    }

    const payload = AuthService.verifyAccessToken(token);

    res.json({
      success: true,
      data: {
        valid: true,
        payload,
      },
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        valid: false,
        error: error instanceof Error ? error.message : 'Token inválido',
      },
    });
  }
};