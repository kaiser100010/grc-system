// src/components/modules/risks/RiskFormStandalone.tsx

import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, Plus, Trash2, Calendar } from 'lucide-react';
import { useAppStore } from '../../../store/appStore';
import { 
  RISK_CATEGORIES, 
  RISK_STATUSES, 
  RISK_TREATMENTS, 
  PRIORITIES, 
  RISK_LEVELS 
} from '../../../types/risk.types';
import type { Risk, RiskAction } from '../../../types/risk.types';

interface RiskFormProps {
  risk?: Risk | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (risk: Risk) => void;
}

const RiskFormStandalone: React.FC<RiskFormProps> = ({ risk, isOpen, onClose, onSave }) => {
  const { addRisk, updateRisk, employees, assets, systems } = useAppStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'operational' as const,
    type: 'internal' as const,
    status: 'identified' as const,
    owner: '',
    probability: 3 as const,
    impact: 3 as const,
    inherentRisk: 9,
    residualRisk: 9,
    tolerance: 'medium' as const,
    identifiedDate: new Date().toISOString().split('T')[0],
    lastReviewDate: new Date().toISOString().split('T')[0],
    nextReviewDate: '',
    affectedAssets: [] as string[],
    affectedSystems: [] as string[],
    likelihood: '',
    consequences: '',
    riskFactors: [] as string[],
    mitigationPlan: '',
    currentControls: '',
    additionalControls: '',
    treatment: 'mitigate' as const,
    progress: 0,
    priority: 'medium' as const,
    tags: [] as string[]
  });

  const [mitigationActions, setMitigationActions] = useState<RiskAction[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newRiskFactor, setNewRiskFactor] = useState('');

  useEffect(() => {
    if (risk) {
      setFormData({
        title: risk.title,
        description: risk.description,
        category: risk.category,
        type: risk.type,
        status: risk.status,
        owner: risk.owner,
        probability: risk.probability,
        impact: risk.impact,
        inherentRisk: risk.inherentRisk,
        residualRisk: risk.residualRisk,
        tolerance: risk.tolerance,
        identifiedDate: risk.identifiedDate,
        lastReviewDate: risk.lastReviewDate,
        nextReviewDate: risk.nextReviewDate,
        affectedAssets: risk.affectedAssets,
        affectedSystems: risk.affectedSystems,
        likelihood: risk.likelihood,
        consequences: risk.consequences,
        riskFactors: risk.riskFactors,
        mitigationPlan: risk.mitigationPlan,
        currentControls: risk.currentControls,
        additionalControls: risk.additionalControls,
        treatment: risk.treatment,
        progress: risk.progress,
        priority: risk.priority,
        tags: risk.tags
      });
      setMitigationActions(risk.mitigationActions || []);
    } else {
      // Reset form for new risk
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        description: '',
        category: 'operational',
        type: 'internal',
        status: 'identified',
        owner: '',
        probability: 3,
        impact: 3,
        inherentRisk: 9,
        residualRisk: 9,
        tolerance: 'medium',
        identifiedDate: today,
        lastReviewDate: today,
        nextReviewDate: '',
        affectedAssets: [],
        affectedSystems: [],
        likelihood: '',
        consequences: '',
        riskFactors: [],
        mitigationPlan: '',
        currentControls: '',
        additionalControls: '',
        treatment: 'mitigate',
        progress: 0,
        priority: 'medium',
        tags: []
      });
      setMitigationActions([]);
    }
  }, [risk, isOpen]);

  // Calculate next review date based on risk level
  useEffect(() => {
    if (formData.identifiedDate) {
      const riskScore = formData.probability * formData.impact;
      const identifiedDate = new Date(formData.identifiedDate);
      let months = 12; // Default to annual review
      
      if (riskScore > 20) months = 3; // Quarterly for critical
      else if (riskScore > 12) months = 6; // Semi-annual for high
      else if (riskScore > 6) months = 9; // 9 months for medium
      
      const nextReview = new Date(identifiedDate);
      nextReview.setMonth(nextReview.getMonth() + months);
      
      setFormData(prev => ({
        ...prev,
        nextReviewDate: nextReview.toISOString().split('T')[0]
      }));
    }
  }, [formData.identifiedDate, formData.probability, formData.impact]);

  // Calculate residual risk based on progress
  useEffect(() => {
    const riskScore = formData.probability * formData.impact;
    const reduction = (formData.progress / 100) * 0.5; // Maximum 50% reduction
    const residual = Math.max(1, Math.round(riskScore * (1 - reduction)));
    
    setFormData(prev => ({
      ...prev,
      inherentRisk: riskScore,
      residualRisk: residual
    }));
  }, [formData.probability, formData.impact, formData.progress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const riskData = {
      ...formData,
      mitigationActions,
      comments: risk?.comments || [],
      attachments: risk?.attachments || []
    };

    if (risk) {
      updateRisk(risk.id, riskData);
    } else {
      addRisk(riskData);
    }

    if (onSave) {
      onSave({ ...riskData, id: risk?.id || '', riskScore: formData.probability * formData.impact } as Risk);
    }

    onClose();
  };

  const addMitigationAction = () => {
    const newAction: RiskAction = {
      id: crypto.randomUUID(),
      description: '',
      responsible: '',
      dueDate: '',
      status: 'pending',
      progress: 0,
      notes: ''
    };
    setMitigationActions([...mitigationActions, newAction]);
  };

  const updateMitigationAction = (id: string, updates: Partial<RiskAction>) => {
    setMitigationActions(actions =>
      actions.map(action =>
        action.id === id ? { ...action, ...updates } : action
      )
    );
  };

  const removeMitigationAction = (id: string) => {
    setMitigationActions(actions => actions.filter(action => action.id !== id));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addRiskFactor = () => {
    if (newRiskFactor.trim() && !formData.riskFactors.includes(newRiskFactor.trim())) {
      setFormData(prev => ({
        ...prev,
        riskFactors: [...prev.riskFactors, newRiskFactor.trim()]
      }));
      setNewRiskFactor('');
    }
  };

  const removeRiskFactor = (factor: string) => {
    setFormData(prev => ({
      ...prev,
      riskFactors: prev.riskFactors.filter(f => f !== factor)
    }));
  };

  const getRiskLevelColor = (score: number) => {
    if (score <= 6) return 'text-green-600 bg-green-100';
    if (score <= 12) return 'text-yellow-600 bg-yellow-100';
    if (score <= 20) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLevelLabel = (score: number) => {
    if (score <= 6) return 'Bajo';
    if (score <= 12) return 'Medio';
    if (score <= 20) return 'Alto';
    return 'Crítico';
  };

  if (!isOpen) return null;

  const currentRiskScore = formData.probability * formData.impact;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {risk ? 'Editar Riesgo' : 'Nuevo Riesgo'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
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

                  <div className="lg:col-span-2">
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
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {RISK_STATUSES.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
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
                          {employee.firstName} {employee.lastName} - {employee.department}
                        </option>
                      ))}
                    </select>
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

                {/* Risk Assessment */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Evaluación del Riesgo</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Probabilidad de Ocurrencia
                      </label>
                      <textarea
                        rows={2}
                        value={formData.likelihood}
                        onChange={(e) => setFormData(prev => ({ ...prev, likelihood: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe los factores que pueden causar este riesgo..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consecuencias
                      </label>
                      <textarea
                        rows={2}
                        value={formData.consequences}
                        onChange={(e) => setFormData(prev => ({ ...prev, consequences: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe las posibles consecuencias..."
                      />
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Factores de Riesgo</h4>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newRiskFactor}
                        onChange={(e) => setNewRiskFactor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Agregar factor de riesgo..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRiskFactor())}
                      />
                      <button
                        type="button"
                        onClick={addRiskFactor}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.riskFactors.map(factor => (
                        <span
                          key={factor}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                        >
                          {factor}
                          <button
                            type="button"
                            onClick={() => removeRiskFactor(factor)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Fechas</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Identificación *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.identifiedDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, identifiedDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Última Revisión
                      </label>
                      <input
                        type="date"
                        value={formData.lastReviewDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastReviewDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Próxima Revisión
                      </label>
                      <input
                        type="date"
                        value={formData.nextReviewDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, nextReviewDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Se calcula automáticamente según el nivel de riesgo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Treatment */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Tratamiento del Riesgo</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tratamiento
                      </label>
                      <select
                        value={formData.treatment}
                        onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {RISK_TREATMENTS.map(treatment => (
                          <option key={treatment.value} value={treatment.value}>
                            {treatment.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Progreso del Tratamiento (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData(prev => ({ ...prev, progress: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Controles Actuales
                      </label>
                      <textarea
                        rows={3}
                        value={formData.currentControls}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentControls: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe los controles actuales..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Controles Adicionales
                      </label>
                      <textarea
                        rows={3}
                        value={formData.additionalControls}
                        onChange={(e) => setFormData(prev => ({ ...prev, additionalControls: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe controles adicionales recomendados..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan de Mitigación
                    </label>
                    <textarea
                      rows={3}
                      value={formData.mitigationPlan}
                      onChange={(e) => setFormData(prev => ({ ...prev, mitigationPlan: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe el plan general de mitigación..."
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Etiquetas</h4>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Agregar etiqueta..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risk Summary */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Resumen del Riesgo</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Riesgo Inherente</div>
                      <div className={`text-2xl font-bold rounded-lg p-2 ${getRiskLevelColor(formData.inherentRisk)}`}>
                        {formData.inherentRisk}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Riesgo Actual</div>
                      <div className={`text-2xl font-bold rounded-lg p-2 ${getRiskLevelColor(currentRiskScore)}`}>
                        {currentRiskScore}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {formData.probability} × {formData.impact}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Riesgo Residual</div>
                      <div className={`text-2xl font-bold rounded-lg p-2 ${getRiskLevelColor(formData.residualRisk)}`}>
                        {formData.residualRisk}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Reducción: {((1 - formData.residualRisk / formData.inherentRisk) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {risk ? 'Actualizar' : 'Crear'} Riesgo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RiskFormStandalone;