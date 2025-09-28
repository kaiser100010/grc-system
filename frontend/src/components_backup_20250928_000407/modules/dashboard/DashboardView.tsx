import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  TrendingUp, 
  Activity,
  Target,
  AlertCircle,
  BarChart3
} from 'lucide-react';

export default function DashboardView() {
  console.log('DashboardView rendering...'); // Debug log

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard GRC
        </h1>
        <p className="text-gray-600">
          Vision general de riesgos, controles y cumplimiento
        </p>
      </div>

      {/* Simple test content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Sistema funcionando correctamente</h2>
        <p className="text-gray-600">
          El dashboard se esta cargando. Este es contenido de prueba para verificar que el componente funciona.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-red-500">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Riesgos Criticos
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              12
            </p>
          </div>
          
          <div className="text-xs text-red-600">
            +2 esta semana
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Controles Activos
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              148
            </p>
          </div>
          
          <div className="text-xs text-green-600">
            +5 este mes
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-orange-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Tareas Pendientes
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              23
            </p>
          </div>
          
          <div className="text-xs text-green-600">
            -3 desde ayer
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-500">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Cumplimiento
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              94%
            </p>
          </div>
          
          <div className="text-xs text-green-600">
            +2% este trimestre
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Actividad Reciente
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Nuevo riesgo identificado: Ciberseguridad
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Maria Garcia</span>
                  <span>•</span>
                  <span>Hace 2 horas</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Control SOX-404 actualizado
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Carlos Lopez</span>
                  <span>•</span>
                  <span>Hace 4 horas</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Tarea de auditoria completada
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Ana Martinez</span>
                  <span>•</span>
                  <span>Hace 6 horas</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Ver toda la actividad →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}