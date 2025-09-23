// src/components/modules/risks/RisksPageClean.tsx V4

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '../../../store/appStore';
import { RISK_CATEGORIES, RISK_STATUSES, PRIORITIES } from '../../../types/risk.types';

const RisksPageClean: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);

  const {
    risks,
    riskFilters,
    employees,
    getFilteredRisks,
    getRiskStats,
    setRiskFilters,
    deleteRisk
  } = useAppStore();

  const filteredRisks = getFilteredRisks();
  const stats = getRiskStats();

  const getRiskLevelColor = (score: number) => {
    if (score <= 6) return 'bg-green-100 text-green-800 border-green-200';
    if (score <= 12) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score <= 20) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getRiskLevelLabel = (score: number) => {
    if (score <= 6) return 'Bajo';
    if (score <= 12) return 'Medio';
    if (score <= 20) return 'Alto';
    return 'Crítico';
  };

  const getStatusColor = (status: string) => {
    const statusObj = RISK_STATUSES.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const categoryObj = RISK_CATEGORIES.find(c => c.value === category);
    return categoryObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = PRIORITIES.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'No asignado';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  // Componente de estadísticas
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Total de Riesgos</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Riesgos Altos</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.highRisks}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Score Promedio</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.averageScore.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600">
            <Shield className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Vencidos</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.overdue}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de filtros
  const FiltersPanel = () => (
    <div className={`bg-white rounded-lg shadow p-6 mb-6 ${showFilters ? 'block' : 'hidden'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select
            value={riskFilters.category}
            onChange={(e) => setRiskFilters({ category: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            {RISK_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select
            value={riskFilters.status}
            onChange={(e) => setRiskFilters({ status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            {RISK_STATUSES.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
          <select
            value={riskFilters.priority}
            onChange={(e) => setRiskFilters({ priority: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            {PRIORITIES.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
          <select
            value={riskFilters.owner}
            onChange={(e) => setRiskFilters({ owner: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setRiskFilters({
            search: '',
            category: 'all',
            status: 'all',
            priority: 'all',
            owner: 'all',
            riskLevel: 'all',
            treatment: 'all'
          })}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );

  // Vista de tabla
  const ListView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Riesgo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nivel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Próxima Revisión
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRisks.map((risk) => (
              <tr key={risk.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertTriangle className={`h-5 w-5 ${
                        risk.priority === 'critical' ? 'text-red-500' :
                        risk.priority === 'high' ? 'text-orange-500' :
                        risk.priority === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {risk.title}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {risk.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(risk.category)}`}>
                    {RISK_CATEGORIES.find(c => c.value === risk.category)?.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(risk.status)}`}>
                    {RISK_STATUSES.find(s => s.value === risk.status)?.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getEmployeeName(risk.owner)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRiskLevelColor(risk.riskScore)}`}>
                    {getRiskLevelLabel(risk.riskScore)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{risk.riskScore}</span>
                    <span className="text-xs text-gray-500 ml-1">({risk.probability}×{risk.impact})</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={isOverdue(risk.nextReviewDate) ? 'text-red-600 font-medium' : ''}>
                    {formatDate(risk.nextReviewDate)}
                    {isOverdue(risk.nextReviewDate) && (
                      <span className="ml-1 text-xs">(Vencido)</span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => alert('Ver detalles - Por implementar')}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => alert('Editar - Por implementar')}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Está seguro de que desea eliminar este riesgo?')) {
                        deleteRisk(risk.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredRisks.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron riesgos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Los datos semilla se cargarán automáticamente.
          </p>
          <div className="mt-6">
            <button
              onClick={() => alert('Formulario - Por implementar')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Riesgo
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Riesgos</h1>
          <p className="mt-2 text-gray-600">
            Identifica, evalúa y gestiona los riesgos organizacionales
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => alert('Formulario - Por implementar')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Riesgo
          </button>
        </div>
      </div>

      {/* Statistics */}
      <StatsCards />

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar riesgos..."
            value={riskFilters.search}
            onChange={(e) => setRiskFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${
            showFilters
              ? 'border-blue-300 text-blue-700 bg-blue-50'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </button>
      </div>

      {/* Filters panel */}
      <FiltersPanel />

      {/* Content */}
      <ListView />

      {/* Formulario modal */}
      <RiskFormModal
        isOpen={showForm}
        selectedRisk={selectedRisk}
        onClose={() => {
          setShowForm(false);
          setSelectedRisk(null);
        }}
        employees={employees}
      />
    </div>
  );
};

export default RisksPageClean;