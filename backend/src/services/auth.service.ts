// Ruta: C:\Projects\GRC-Claude\grc-system\backend\src\services\auth.service.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this';
const JWT_REFRESH_EXPIRES_IN = '30d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  tokens: AuthTokens;
}

export class AuthService {
  /**
   * Generar tokens de acceso y refresh
   */
  private static generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_EXPIRES_IN,
    };
  }

  /**
   * Verificar token de acceso
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Verificar refresh token
   */
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Refresh token inválido o expirado');
    }
  }

  /**
   * Login de usuario
   */
  static async login(email: string, password: string): Promise<LoginResult> {
    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new Error('Usuario inactivo. Contacte al administrador.');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generar tokens
    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    };
  }

  /**
   * Registro de nuevo usuario
   */
  static async register(data: RegisterData): Promise<LoginResult> {
    const { email, password, firstName, lastName } = data;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Validar contraseña (mínimo 8 caracteres, al menos una letra y un número)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error('La contraseña debe tener al menos 8 caracteres, incluyendo letras y números');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'USER', // Rol por defecto
        isActive: true,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    // Generar tokens
    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      tokens,
    };
  }

  /**
   * Renovar token usando refresh token
   */
  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const payload = this.verifyRefreshToken(refreshToken);

    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new Error('Usuario no encontrado o inactivo');
    }

    // Generar nuevos tokens
    return this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Validar nueva contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres, incluyendo letras y números');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  /**
   * Obtener perfil del usuario
   */
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
            assignedIncidents: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }
}