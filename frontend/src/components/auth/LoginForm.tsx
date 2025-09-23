import React, { useState } from 'react';
import { Shield, User, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validación simple
    if (!email || !password) {
      setError('Por favor ingresa email y contraseña');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido');
      setIsLoading(false);
      return;
    }

    // Simulación de login (SIN llamadas al backend)
    setTimeout(() => {
      // Simulamos diferentes respuestas según las credenciales de prueba
      if (
        (email === 'admin@grc.com' && password === 'admin123') ||
        (email === 'manager@grc.com' && password === 'manager123') ||
        (email === 'user@grc.com' && password === 'user123')
      ) {
        setSuccess(`¡Login exitoso! Bienvenido ${email}`);
        setError('');
        
        // Aquí eventualmente redirigiremos al dashboard
        console.log('Login exitoso para:', email);
      } else {
        setError('Credenciales incorrectas. Usa las credenciales de prueba.');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema GRC
          </h1>
          <p className="text-gray-600">
            Gestión de Riesgos y Cumplimiento
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="admin@grc.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="admin123"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3">Credenciales de prueba:</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between items-center p-2 bg-white rounded border">
                <span><strong>Admin:</strong> admin@grc.com</span>
                <span className="text-gray-500">admin123</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border">
                <span><strong>Manager:</strong> manager@grc.com</span>
                <span className="text-gray-500">manager123</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border">
                <span><strong>User:</strong> user@grc.com</span>
                <span className="text-gray-500">user123</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 text-center text-xs text-gray-500">
            Modo de desarrollo - Sin conexión al backend
          </div>
        </div>
      </div>
    </div>
  );
}