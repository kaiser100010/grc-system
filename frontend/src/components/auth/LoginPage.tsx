// src/components/auth/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  Loader,
  Key,
  User,
  Building,
  Globe,
  ArrowRight
} from 'lucide-react';
import useAppStore from '../../store/appStore';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAppStore();
  
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [selectedDemoUser, setSelectedDemoUser] = useState<string>('');

  // Demo users
  const demoUsers = [
    {
      id: 'admin',
      email: 'admin@grc.com',
      password: 'Admin123!',
      name: 'Admin Usuario',
      role: 'Administrador',
      description: 'Acceso completo al sistema',
      permissions: ['all']
    },
    {
      id: 'risk_manager',
      email: 'risk@grc.com',
      password: 'Risk123!',
      name: 'Ana Rodríguez',
      role: 'Risk Manager',
      description: 'Gestión de riesgos y controles',
      permissions: ['risks', 'controls', 'reports']
    },
    {
      id: 'compliance',
      email: 'compliance@grc.com',
      password: 'Compliance123!',
      name: 'Carlos López',
      role: 'Compliance Officer',
      description: 'Cumplimiento y políticas',
      permissions: ['compliance', 'policies', 'audits']
    },
    {
      id: 'auditor',
      email: 'auditor@grc.com',
      password: 'Auditor123!',
      name: 'Luis Martínez',
      role: 'Auditor',
      description: 'Auditorías y evidencias',
      permissions: ['audits', 'evidence', 'reports']
    }
  ];

  // Validation
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if it's a demo user
      const demoUser = demoUsers.find(u => u.email === formData.email && u.password === formData.password);
      
      if (demoUser) {
        // Login successful with demo user
        login({
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          permissions: demoUser.permissions
        });
        
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else if (formData.email === 'user@empresa.com' && formData.password === 'Password123!') {
        // Default user
        login({
          id: '1',
          email: 'user@empresa.com',
          name: 'Usuario Empresa',
          role: 'Usuario',
          permissions: ['read']
        });
        
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // Invalid credentials
        setErrors({
          general: 'Credenciales inválidas. Prueba con las credenciales de demo.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Error al iniciar sesión. Por favor intenta de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login with demo user
  const handleQuickLogin = (user: typeof demoUsers[0]) => {
    setFormData({
      email: user.email,
      password: user.password,
      rememberMe: false
    });
    setSelectedDemoUser(user.id);
    setShowDemo(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            GRC System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Governance, Risk & Compliance
          </p>
        </div>

        {/* Login form card */}
        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {/* Success message */}
          {showSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    ¡Inicio de sesión exitoso! Redirigiendo...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {errors.general}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Demo users section */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Key className="h-4 w-4 mr-2" />
              {showDemo ? 'Ocultar usuarios demo' : 'Ver usuarios demo'}
            </button>

            {showDemo && (
              <div className="mt-4 space-y-2">
                {demoUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleQuickLogin(user)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedDemoUser === user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.role}</p>
                        <p className="text-xs text-gray-500 mt-1">{user.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 mt-1" />
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="font-mono bg-gray-100 px-1 rounded">{user.email}</span>
                      {' / '}
                      <span className="font-mono bg-gray-100 px-1 rounded">{user.password}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Login form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                } transition-colors`}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>
          </form>

          {/* Additional options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <User className="h-5 w-5" />
                <span className="ml-2">SSO</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Building className="h-5 w-5" />
                <span className="ml-2">LDAP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 GRC System. Todos los derechos reservados.
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
              Términos
            </a>
            <span className="text-xs text-gray-500">•</span>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
              Privacidad
            </a>
            <span className="text-xs text-gray-500">•</span>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
              Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}