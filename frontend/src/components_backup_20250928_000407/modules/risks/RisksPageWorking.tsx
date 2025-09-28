// src/components/modules/risks/RisksPageWorking.tsx

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp,
  Shield,
  AlertCircle,
  X,
  Save
} from 'lucide-react';
import { useAppStore } from '../../../store/appStore';
import { RISK_CATEGORIES, RISK_STATUSES, PRIORITIES, RISK_LEVELS, RISK_TREATMENTS } from '../../../types/risk.types';
import type { Risk } from '../../../types/risk.types';

const RisksPageWorking: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'operational' as const,
    owner: '',
    probability: 3 as const,
    impact: 3 as const,
    priority: 'medium' as const
  });

  const {
    risks,
    riskFilters,
    employees,
    getFilteredRisks,
    getRiskStats,
    setRiskFilters,
    deleteRisk,
    addRisk,
    updateRisk
  } = useAppStore();

  const filteredRisks = getFilteredRisks();
  const stats = getRiskStats();

  // Reset form when opening/closing
  React.useEffect(() => {
    if (selectedRisk) {
      setFormData({
        title: selectedRisk.title,
        description: selectedRisk.description,
        category: selectedRisk.category,
        owner: selectedRisk.owner,
        probability: selectedRisk.probability,
        impact: selectedRisk.impact,
        priority: selectedRisk.priority
      });
    } else if (showForm) {
      setFormData({
        title: '',
        description: '',
        category: 'operational',
        owner: '',
        probability: 3,
        impact: 3,
        priority: 'medium'
      });
    }
  }, [selectedRisk, showForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    const riskScore = formData.probability * formData.impact;

    const riskData = {
      ...formData,
      type: 'internal' as const,
      status: 'identified' as const,
      treatment: 'mitigate' as const,
      progress: 0,
      likelihood: '',
      consequences: '',
      currentControls: '',
      mitigationPlan: '',
      riskScore,
      inherentRisk: riskScore,
      residualRisk: riskScore,
      tolerance: 'medium' as const,
      identifiedDate: today,
      lastReviewDate: today,
      nextReviewDate: today,
      affectedAssets: [],
      affectedSystems: [],
      riskFactors: [],
      mitigationActions: [],
      additionalControls: '',
      tags: [],
      comments: [],
      attachments: []
    };

    if (selectedRisk) {
      updateRisk(selectedRisk.id, riskData);
    } else {
      addRisk(riskData);
    }

    setShowForm(false);
    setSelectedRisk(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedRisk(null);
  };

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

  const currentRiskScore = formData.probability * formData.impact;

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
            onClick={() => {
              setSelectedRisk(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Riesgo
          </button>
        </div>
      </div>

      {/* Statistics */}
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

      {/* Debug info - temporal */}
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p><strong>Debug Estado:</strong></p>
        <p>showForm: {showForm ? 'true' : 'false'}</p>
        <p>selectedRisk: {selectedRisk ? selectedRisk.id : 'null'}</p>
        <p>employees: {employees.length}</p>
      </div>

      {/* Content - Table */}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedRisk(risk);
                        setShowForm(true);
                      }}
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
                onClick={() => {
                  setSelectedRisk(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Riesgo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeForm}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedRisk ? 'Editar Riesgo' : 'Nuevo Riesgo'}
                        </h3>
                        {selectedRisk && (
                          <p className="text-sm text-gray-500">
                            Editando: {selectedRisk.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <button type="button" onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="bg-white px-6 py-6 space-y-6">
                  {/* Debug info - temporal */}
                  <div className="bg-gray-100 p-3 rounded text-xs">
                    <p><strong>Debug:</strong> {selectedRisk ? `Editando ID: ${selectedRisk.id}` : 'Creando nuevo'}</p>
                    <p><strong>Empleados disponibles:</strong> {employees.length}</p>
                    <p><strong>Form válido:</strong> {formData.title && formData.description && formData.owner ? 'Sí' : 'No'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Riesgo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Pérdida de datos por ciberataque"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe detalladamente el riesgo..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {RISK_CATEGORIES.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Responsable *
                      </label>
                      <select
                        required
                        value={formData.owner}
                        onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar empleado</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Evaluación del Riesgo</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Probabilidad *
                        </label>
                        <select
                          required
                          value={formData.probability}
                          onChange={(e) => setFormData(prev => ({ ...prev, probability: Number(e.target.value) as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {RISK_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.value} - {level.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Impacto *
                        </label>
                        <select
                          required
                          value={formData.impact}
                          onChange={(e) => setFormData(prev => ({ ...prev, impact: Number(e.target.value) as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {RISK_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.value} - {level.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nivel de Riesgo
                        </label>
                        <div className={`px-3 py-2 rounded-md border ${getRiskLevelColor(currentRiskScore)}`}>
                          <div className="text-center">
                            <div className="text-lg font-bold">{currentRiskScore}</div>
                            <div className="text-sm">{getRiskLevelLabel(currentRiskScore)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {PRIORITIES.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {selectedRisk ? 'Actualizar' : 'Crear'} Riesgo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RisksPageWorking;