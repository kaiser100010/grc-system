// src/components/modules/dashboard/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Activity,
  Target,
  Briefcase,
  AlertCircle,
  Calendar,
  ChevronRight,
  RefreshCw,
  Download,
  Filter,
  Bell,
  Info,
  XCircle
} from 'lucide-react';
import useAppStore from '../../../store/appStore';
import RiskMatrix from '../../../components/modules/risks/RiskMatrix';

interface DashboardStats {
  risks: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    trend: 'up' | 'down' | 'stable';
    percentageChange: number;
  };
  controls: {
    total: number;
    implemented: number;
    partial: number;
    notImplemented: number;
    effectiveness: number;
  };
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
  };
  incidents: {
    total: number;
    open: number;
    resolved: number;
    avgResolutionTime: number;
    trend: 'up' | 'down' | 'stable';
  };
  compliance: {
    overallScore: number;
    frameworks: Array<{
      name: string;
      score: number;
      controls: number;
    }>;
  };
  vendors: {
    total: number;
    highRisk: number;
    assessmentsDue: number;
  };
}

export default function DashboardPage() {
  const {
    risks,
    controls,
    tasks,
    incidents,
    policies,
    vendors,
    systems,
    assets,
    employees,
    notifications
  } = useAppStore();

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    risks: {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      trend: 'stable',
      percentageChange: 0
    },
    controls: {
      total: 0,
      implemented: 0,
      partial: 0,
      notImplemented: 0,
      effectiveness: 0
    },
    tasks: {
      total: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      completionRate: 0
    },
    incidents: {
      total: 0,
      open: 0,
      resolved: 0,
      avgResolutionTime: 0,
      trend: 'stable'
    },
    compliance: {
      overallScore: 0,
      frameworks: []
    },
    vendors: {
      total: 0,
      highRisk: 0,
      assessmentsDue: 0
    }
  });

  // Calcular estadísticas
  useEffect(() => {
    calculateStats();
  }, [risks, controls, tasks, incidents, vendors]);

  const calculateStats = () => {
    // Estadísticas de Riesgos
    const riskStats = {
      total: risks.length,
      critical: risks.filter(r => r.level === 'crítico').length,
      high: risks.filter(r => r.level === 'alto').length,
      medium: risks.filter(r => r.level === 'medio').length,
      low: risks.filter(r => r.level === 'bajo').length,
      trend: risks.length > 10 ? 'up' : risks.length < 5 ? 'down' : 'stable' as 'up' | 'down' | 'stable',
      percentageChange: 12.5 // Simulado
    };

    // Estadísticas de Controles
    const controlStats = {
      total: controls.length,
      implemented: controls.filter(c => c.status === 'implemented' || c.status === 'effective').length,
      partial: controls.filter(c => c.status === 'partially_implemented').length,
      notImplemented: controls.filter(c => c.status === 'not_implemented').length,
      effectiveness: controls.length > 0 
        ? Math.round((controls.filter(c => c.effectiveness >= 70).length / controls.length) * 100)
        : 0
    };

    // Estadísticas de Tareas
    const now = new Date();
    const taskStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      overdue: tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < now).length,
      completionRate: tasks.length > 0 
        ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
        : 0
    };

    // Estadísticas de Incidentes
    const incidentStats = {
      total: incidents.length,
      open: incidents.filter(i => i.status === 'open' || i.status === 'investigating').length,
      resolved: incidents.filter(i => i.status === 'resolved' || i.status === 'closed').length,
      avgResolutionTime: 48, // Horas simuladas
      trend: incidents.filter(i => {
        const date = new Date(i.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return date > thirtyDaysAgo;
      }).length > 5 ? 'up' : 'down' as 'up' | 'down' | 'stable'
    };

    // Estadísticas de Cumplimiento
    const complianceStats = {
      overallScore: 78, // Simulado
      frameworks: [
        { name: 'ISO 27001', score: 82, controls: 114 },
        { name: 'SOC 2', score: 75, controls: 65 },
        { name: 'GDPR', score: 88, controls: 45 },
        { name: 'PCI DSS', score: 70, controls: 250 }
      ]
    };

    // Estadísticas de Proveedores
    const vendorStats = {
      total: vendors.length,
      highRisk: vendors.filter(v => v.criticality === 'critical' || v.criticality === 'high').length,
      assessmentsDue: vendors.filter(v => {
        if (!v.nextAssessmentDate) return false;
        const assessmentDate = new Date(v.nextAssessmentDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return assessmentDate <= thirtyDaysFromNow;
      }).length
    };

    setStats({
      risks: riskStats,
      controls: controlStats,
      tasks: taskStats,
      incidents: incidentStats,
      compliance: complianceStats,
      vendors: vendorStats
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      calculateStats();
      setRefreshing(false);
    }, 1000);
  };

  const handleExport = () => {
    // Implementar exportación a PDF/Excel
    alert('Funcionalidad de exportación en desarrollo');
  };

  // Obtener tareas próximas
  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Obtener incidentes recientes
  const recentIncidents = incidents
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Obtener notificaciones no leídas
  const unreadNotifications = notifications.filter(n => !n.read).slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard GRC</h1>
          <p className="text-gray-600">Visión general del estado de cumplimiento y riesgos</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
          <button
            onClick={handleRefresh}
            className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
              refreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Alertas Importantes */}
      {(stats.risks.critical > 0 || stats.tasks.overdue > 0 || stats.incidents.open > 0) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Atención Requerida</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {stats.risks.critical > 0 && (
                    <li>{stats.risks.critical} riesgos críticos requieren atención inmediata</li>
                  )}
                  {stats.tasks.overdue > 0 && (
                    <li>{stats.tasks.overdue} tareas vencidas</li>
                  )}
                  {stats.incidents.open > 0 && (
                    <li>{stats.incidents.open} incidentes abiertos</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score de Cumplimiento */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Score de Cumplimiento
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.compliance.overallScore}%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      2.5%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/controls" className="font-medium text-blue-600 hover:text-blue-500">
                Ver controles
                <ChevronRight className="inline h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Riesgos Totales */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Riesgos Activos
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.risks.total}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stats.risks.trend === 'up' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {stats.risks.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {stats.risks.percentageChange}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm flex justify-between">
              <span className="text-red-600 font-medium">{stats.risks.critical} críticos</span>
              <a href="/risks" className="font-medium text-blue-600 hover:text-blue-500">
                Ver todos
                <ChevronRight className="inline h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Tareas */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tasa de Completación
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.tasks.completionRate}%
                    </div>
                    <div className="ml-2 text-sm text-gray-600">
                      ({stats.tasks.completed}/{stats.tasks.total})
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm flex justify-between">
              <span className="text-orange-600 font-medium">{stats.tasks.overdue} vencidas</span>
              <a href="/tasks" className="font-medium text-blue-600 hover:text-blue-500">
                Ver tareas
                <ChevronRight className="inline h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Incidentes */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-10 w-10 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Incidentes Abiertos
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.incidents.open}
                    </div>
                    <div className="ml-2 text-sm text-gray-600">
                      de {stats.incidents.total}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm flex justify-between">
              <span className="text-gray-600">⌀ {stats.incidents.avgResolutionTime}h resolución</span>
              <a href="/incidents" className="font-medium text-blue-600 hover:text-blue-500">
                Ver todos
                <ChevronRight className="inline h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Efectividad de Controles */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Efectividad de Controles</h3>
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Implementados</span>
                <span className="font-medium">{stats.controls.implemented}/{stats.controls.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stats.controls.total > 0 ? (stats.controls.implemented / stats.controls.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Parcialmente</span>
                <span className="font-medium">{stats.controls.partial}/{stats.controls.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${stats.controls.total > 0 ? (stats.controls.partial / stats.controls.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">No implementados</span>
                <span className="font-medium">{stats.controls.notImplemented}/{stats.controls.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${stats.controls.total > 0 ? (stats.controls.notImplemented / stats.controls.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Efectividad promedio</span>
                <span className="text-lg font-semibold text-blue-600">{stats.controls.effectiveness}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cumplimiento por Framework */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Cumplimiento por Framework</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.compliance.frameworks.map((framework) => (
              <div key={framework.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{framework.name}</span>
                    <span className="text-sm text-gray-500">{framework.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        framework.score >= 80 ? 'bg-green-500' :
                        framework.score >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${framework.score}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {framework.controls} controles
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gestión de Proveedores */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Gestión de Proveedores</h3>
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total de proveedores</span>
              <span className="text-2xl font-semibold text-gray-900">{stats.vendors.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Alto riesgo</span>
              <span className="text-xl font-semibold text-red-600">{stats.vendors.highRisk}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Evaluaciones pendientes</span>
              <span className="text-xl font-semibold text-orange-600">{stats.vendors.assessmentsDue}</span>
            </div>
            <div className="pt-3 border-t">
              <a href="/vendors" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Gestionar proveedores
                <ChevronRight className="inline h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz de Riesgos */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Matriz de Riesgos</h3>
          <a href="/risks" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Ver análisis completo
            <ChevronRight className="inline h-4 w-4 ml-1" />
          </a>
        </div>
        <RiskMatrix 
          risks={risks} 
          showLegend={true}
          showStats={false}
          interactive={true}
        />
      </div>

      {/* Tablas de información rápida */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tareas Próximas */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Tareas Próximas</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => {
                const dueDate = new Date(task.dueDate);
                const isOverdue = dueDate < new Date();
                const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={task.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span className="mr-3">Asignado a: {task.assigneeName}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                          {isOverdue ? `Vencida hace ${Math.abs(daysUntilDue)} días` : 
                           daysUntilDue === 0 ? 'Vence hoy' :
                           daysUntilDue === 1 ? 'Vence mañana' :
                           `En ${daysUntilDue} días`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No hay tareas pendientes</p>
              </div>
            )}
            {upcomingTasks.length > 0 && (
              <div className="px-6 py-3 bg-gray-50">
                <a href="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Ver todas las tareas
                  <ChevronRight className="inline h-4 w-4 ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Incidentes Recientes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Incidentes Recientes</h3>
              <AlertCircle className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentIncidents.length > 0 ? (
              recentIncidents.map((incident) => {
                const createdDate = new Date(incident.createdAt);
                const daysAgo = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={incident.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{incident.title}</p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-3 ${
                            incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {incident.severity}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            incident.status === 'open' ? 'bg-red-100 text-red-800' :
                            incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                            incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {incident.status}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-sm text-gray-600">
                          {daysAgo === 0 ? 'Hoy' :
                           daysAgo === 1 ? 'Ayer' :
                           `Hace ${daysAgo} días`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No hay incidentes recientes</p>
              </div>
            )}
            {recentIncidents.length > 0 && (
              <div className="px-6 py-3 bg-gray-50">
                <a href="/incidents" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Ver todos los incidentes
                  <ChevronRight className="inline h-4 w-4 ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gráficos y tendencias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolución de Riesgos */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Evolución de Riesgos</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Gráfico de evolución</p>
              <p className="text-xs text-gray-400 mt-1">Implementación pendiente</p>
            </div>
          </div>
        </div>

        {/* Actividad del Sistema */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Actividad del Sistema</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Usuarios activos</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{employees.length}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Políticas vigentes</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{policies.filter(p => p.status === 'published').length}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Sistemas críticos</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{systems.filter(s => s.criticality === 'critical').length}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Activos monitoreados</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{assets.length}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Notificaciones pendientes</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{notifications.filter(n => !n.read).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      {unreadNotifications.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notificaciones Recientes</h3>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {unreadNotifications.map((notification) => {
              const IconComponent = 
                notification.type === 'error' ? XCircle :
                notification.type === 'warning' ? AlertCircle :
                notification.type === 'success' ? CheckCircle :
                Info;

              const colorClass = 
                notification.type === 'error' ? 'text-red-500' :
                notification.type === 'warning' ? 'text-yellow-500' :
                notification.type === 'success' ? 'text-green-500' :
                'text-blue-500';

              return (
                <div key={notification.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <IconComponent className={`h-5 w-5 mt-0.5 mr-3 ${colorClass}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <a href="/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Ver todas las notificaciones
              <ChevronRight className="inline h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}