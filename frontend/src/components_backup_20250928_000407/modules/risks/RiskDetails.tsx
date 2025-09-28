// src/components/modules/risks/RiskDetails.tsx

import React, { useState } from 'react';
import { 
  X, 
  Edit, 
  AlertTriangle, 
  User, 
  Calendar, 
  Target, 
  TrendingUp, 
  Shield,
  FileText,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '../../../store/appStore';
import { 
  RISK_CATEGORIES, 
  RISK_STATUSES, 
  RISK_TREATMENTS, 
  PRIORITIES 
} from '../../../types/risk.types';
import type { Risk } from '../../../types/risk.types';

interface RiskDetailsProps {
  risk: Risk;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const RiskDetails: React.FC<RiskDetailsProps> = ({ risk, isOpen, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'treatment' | 'actions' | 'history'>('overview');
  const { employees, assets, systems } = useAppStore();

  if (!isOpen) return null;

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'No asignado';
  };

  const getAssetName = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    return asset ? asset.name : 'Activo no encontrado';
  };

  const getSystemName = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    return system ? system.name : 'Sistema no encontrado';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
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

  const getPriorityColor = (priority: string) => {
    const priorityObj = PRIORITIES.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getTreatmentColor = (treatment: string) => {
    const treatmentObj = RISK_TREATMENTS.find(t => t.value === treatment);
    return treatmentObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getActionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: FileText },
    { id: 'assessment', label: 'Evaluación', icon: TrendingUp },
    { id: 'treatment', label: 'Tratamiento', icon: Shield },
    { id: 'actions', label: 'Acciones', icon: Target },
    { id: 'history', label: 'Historial', icon: MessageSquare }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className={`h-6 w-6 mr-3 ${
                  risk.priority === 'critical' ? 'text-red-500' :
                  risk.priority === 'high' ? 'text-orange-500' :
                  risk.priority === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`} />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {risk.title}
                  </h3>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(risk.category)}`}>
                      {RISK_CATEGORIES.find(c => c.value === risk.category)?.label}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(risk.status)}`}>
                      {RISK_STATUSES.find(s => s.value === risk.status)?.label}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRiskLevelColor(risk.riskScore)}`}>
                      {getRiskLevelLabel(risk.riskScore)} ({risk.riskScore})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onEdit}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6 max-h-[70vh] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Información General</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-4">{risk.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Responsable:</span>
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{getEmployeeName(risk.owner)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(risk.priority)}`}>
                            {PRIORITIES.find(p => p.value === risk.priority)?.label}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Tratamiento:</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTreatmentColor(risk.treatment)}`}>
                            {RISK_TREATMENTS.find(t => t.value === risk.treatment)?.label}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Identificado:</span>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{formatDate(risk.identifiedDate)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Próxima Revisión:</span>
                        <div className="flex items-center mt-1">
                          <Calendar className={`h-4 w-4 mr-2 ${isOverdue(risk.nextReviewDate) ? 'text-red-500' : 'text-gray-400'}`} />
                          <span className={`text-sm ${isOverdue(risk.nextReviewDate) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {formatDate(risk.nextReviewDate)}
                            {isOverdue(risk.nextReviewDate) && ' (Vencido)'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Progreso:</span>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${risk.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{risk.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {risk.tags.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                      {risk.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Affected Assets & Systems */}
                {(risk.affectedAssets.length > 0 || risk.affectedSystems.length > 0) && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Activos y Sistemas Afectados</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {risk.affectedAssets.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Activos Afectados</h5>
                          <ul className="bg-gray-50 rounded-lg p-3 space-y-1">
                            {risk.affectedAssets.map(assetId => (
                              <li key={assetId} className="text-sm text-gray-700">
                                • {getAssetName(assetId)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {risk.affectedSystems.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Sistemas Afectados</h5>
                          <ul className="bg-gray-50 rounded-lg p-3 space-y-1">
                            {risk.affectedSystems.map(systemId => (
                              <li key={systemId} className="text-sm text-gray-700">
                                • {getSystemName(systemId)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assessment' && (
              <div className="space-y-6">
                {/* Risk Scores */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Puntuación del Riesgo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-2">Riesgo Inherente</div>
                      <div className={`text-3xl font-bold rounded-lg p-2 ${getRiskLevelColor(risk.inherentRisk)}`}>
                        {risk.inherentRisk}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-2">Riesgo Actual</div>
                      <div className={`text-3xl font-bold rounded-lg p-2 ${getRiskLevelColor(risk.riskScore)}`}>
                        {risk.riskScore}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {risk.probability} × {risk.impact}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-2">Riesgo Residual</div>
                      <div className={`text-3xl font-bold rounded-lg p-2 ${getRiskLevelColor(risk.residualRisk)}`}>
                        {risk.residualRisk}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assessment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Probabilidad de Ocurrencia</h5>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{risk.likelihood || 'No especificado'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Consecuencias</h5>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{risk.consequences || 'No especificado'}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {risk.riskFactors.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Factores de Riesgo</h4>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <ul className="space-y-2">
                        {risk.riskFactors.map((factor, index) => (
                          <li key={index} className="flex items-start text-sm text-red-800">
                            <span className="text-red-500 mr-2">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'treatment' && (
              <div className="space-y-6">
                {/* Treatment Plan */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Plan de Mitigación</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{risk.mitigationPlan || 'No se ha definido un plan de mitigación'}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Controles Actuales</h5>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{risk.currentControls || 'No especificado'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Controles Adicionales</h5>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{risk.additionalControls || 'No especificado'}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Progreso del Tratamiento</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progreso General</span>
                      <span className="text-sm font-medium text-gray-900">{risk.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${risk.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium text-gray-900">Acciones de Mitigación</h4>
                  <span className="text-sm text-gray-500">
                    {risk.mitigationActions.length} acción{risk.mitigationActions.length !== 1 ? 'es' : ''}
                  </span>
                </div>

                {risk.mitigationActions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No hay acciones de mitigación definidas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {risk.mitigationActions.map((action, index) => (
                      <div key={action.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            {getActionStatusIcon(action.status)}
                            <h5 className="font-medium text-gray-900 ml-2">
                              Acción {index + 1}
                            </h5>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            action.status === 'completed' ? 'bg-green-100 text-green-800' :
                            action.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            action.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {action.status === 'completed' ? 'Completada' :
                             action.status === 'in-progress' ? 'En Progreso' :
                             action.status === 'overdue' ? 'Vencida' : 'Pendiente'}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">{action.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Responsable:</span>
                            <div className="text-gray-900">{getEmployeeName(action.responsible)}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Fecha Límite:</span>
                            <div className={`${isOverdue(action.dueDate) && action.status !== 'completed' ? 'text-red-600' : 'text-gray-900'}`}>
                              {formatDate(action.dueDate)}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Progreso:</span>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    action.status === 'completed' ? 'bg-green-500' :
                                    action.status === 'in-progress' ? 'bg-blue-500' :
                                    action.status === 'overdue' ? 'bg-red-500' :
                                    'bg-gray-400'
                                  }`}
                                  style={{ width: `${action.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-900">{action.progress}%</span>
                            </div>
                          </div>
                        </div>

                        {action.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="font-medium text-gray-500 text-sm">Notas:</span>
                            <p className="text-sm text-gray-700 mt-1">{action.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium text-gray-900">Historial y Comentarios</h4>
                  <span className="text-sm text-gray-500">
                    {risk.comments.length} comentario{risk.comments.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {risk.comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No hay comentarios registrados</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {risk.comments.map((comment) => (
                      <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-gray-900">{getEmployeeName(comment.author)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(comment.timestamp)}
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                        {comment.type !== 'comment' && (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                            comment.type === 'status-change' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {comment.type === 'status-change' ? 'Cambio de Estado' : 'Revisión'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Risk Timeline */}
                <div className="mt-8">
                  <h5 className="text-md font-medium text-gray-900 mb-4">Línea de Tiempo</h5>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Riesgo Identificado</div>
                        <div className="text-sm text-gray-500">{formatDate(risk.identifiedDate)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Última Revisión</div>
                        <div className="text-sm text-gray-500">{formatDate(risk.lastReviewDate)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-3 h-3 rounded-full ${isOverdue(risk.nextReviewDate) ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Próxima Revisión</div>
                        <div className={`text-sm ${isOverdue(risk.nextReviewDate) ? 'text-red-600' : 'text-gray-500'}`}>
                          {formatDate(risk.nextReviewDate)}
                          {isOverdue(risk.nextReviewDate) && ' (Vencida)'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskDetails;