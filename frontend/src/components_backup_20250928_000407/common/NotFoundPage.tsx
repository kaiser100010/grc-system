import React from 'react';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertCircle className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-600">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            Ir al Dashboard
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver atrás
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Si crees que esto es un error, contacta al administrador del sistema.</p>
        </div>
      </div>
    </div>
  );
}
