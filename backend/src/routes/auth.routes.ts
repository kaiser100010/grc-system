// Ruta: C:\Projects\GRC-Claude\grc-system\backend\src\routes\auth.routes.ts

import { Router } from 'express';
import {
  login,
  register,
  refresh,
  getProfile,
  changePassword,
  logout,
  verify,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Rutas públicas (no requieren autenticación)
 */

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', register);

// POST /api/auth/refresh - Renovar token
router.post('/refresh', refresh);

// POST /api/auth/verify - Verificar si un token es válido
router.post('/verify', verify);

/**
 * Rutas protegidas (requieren autenticación)
 */

// GET /api/auth/me - Obtener perfil del usuario autenticado
router.get('/me', authenticate, getProfile);

// PUT /api/auth/change-password - Cambiar contraseña
router.put('/change-password', authenticate, changePassword);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authenticate, logout);

export default router;