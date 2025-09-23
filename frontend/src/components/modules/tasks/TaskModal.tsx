// src/components/modules/tasks/TaskModal.tsx
import React, { useState, useEffect } from 'react';
import { X, CheckSquare } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  task?: any | null;
  title: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task, title }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'compliance',
    type: 'one-time',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    createdBy: '',
    approver: '',
    dueDate: '',
    startDate: '',
    completedDate: '',
    estimatedHours: '',
    actualHours: '',
    progress: 0,
    relatedEntity: '',
    relatedEntityType: 'system',
    tags: '',
    dependencies: '',
    attachments: '',
    complianceFrameworks: '',
    riskLevel: 'medium',
    recurrenceFrequency: 'monthly',
    recurrenceInterval: 1,
    recurrenceEndDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'compliance',
        type: task.type || 'one-time',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        assignedTo: task.assignedTo || '',
        createdBy: task.createdBy || '',
        approver: task.approver || '',
        dueDate: task.dueDate || '',
        startDate: task.startDate || '',
        completedDate: task.completedDate || '',
        estimatedHours: task.estimatedHours ? task.estimatedHours.toString() : '',
        actualHours: task.actualHours ? task.actualHours.toString() : '',
        progress: task.progress || 0,
        relatedEntity: task.relatedEntity || '',
        relatedEntityType: task.relatedEntityType || 'system',
        tags: task.tags ? task.tags.join(', ') : '',
        dependencies: task.dependencies ? task.dependencies.join(', ') : '',
        attachments: task.attachments ? task.attachments.join(', ') : '',
        complianceFrameworks: task.complianceFrameworks ? task.complianceFrameworks.join(', ') : '',
        riskLevel: task.riskLevel || 'medium',
        recurrenceFrequency: task.recurrence?.frequency || 'monthly',
        recurrenceInterval: task.recurrence?.interval || 1,
        recurrenceEndDate: task.recurrence?.endDate || '',
        notes: task.notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'compliance',
        type: 'one-time',
        status: 'pending',
        priority: 'medium',
        assignedTo: '',
        createdBy: '',
        approver: '',
        dueDate: '',
        startDate: '',
        completedDate: '',
        estimatedHours: '',
        actualHours: '',
        progress: 0,
        relatedEntity: '',
        relatedEntityType: 'system',
        tags: '',
        dependencies: '',
        attachments: '',
        complianceFrameworks: '',
        riskLevel: 'medium',
        recurrenceFrequency: 'monthly',
        recurrenceInterval: 1,
        recurrenceEndDate: '',
        notes: ''
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'El asignado es requerido';
    }
    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'El creador es requerido';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha límite es requerida';
    }
    if (formData.estimatedHours && isNaN(Number(formData.estimatedHours))) {
      newErrors.estimatedHours = 'Las horas estimadas deben ser un número válido';
    }
    if (formData.actualHours && isNaN(Number(formData.actualHours))) {
      newErrors.actualHours = 'Las horas reales deben ser un número válido';
    }
    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'El progreso debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const taskData = {
        ...formData,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
        actualHours: formData.actualHours ? Number(formData.actualHours) : undefined,
        progress: Number(formData.progress),
        tags: formData.tags
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0),
        dependencies: formData.dependencies
          .split(',')
          .map(d => d.trim())
          .filter(d => d.length > 0),
        attachments: formData.attachments
          .split(',')
          .map(a => a.trim())
          .filter(a => a.length > 0),
        complianceFrameworks: formData.complianceFrameworks
          .split(',')
          .map(f => f.trim())
          .filter(f => f.length > 0),
        recurrence: formData.type === 'recurring' ? {
          frequency: formData.recurrenceFrequency,
          interval: formData.recurrenceInterval,
          endDate: formData.recurrenceEndDate || undefined
        } : undefined,
        checklist: task?.checklist || [],
        comments: task?.comments || [],
        relatedEntity: formData.relatedEntity || undefined,
        approver: formData.approver || undefined,
        startDate: formData.startDate || undefined,
        completedDate: formData.completedDate || undefined,
        notes: formData.notes || undefined
      };

      onSave(taskData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'progress') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (name === 'recurrenceInterval') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título de la Tarea *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Auditoría de Seguridad Q4"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Descripción detallada de la tarea"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="audit">Auditoría</option>
                  <option value="compliance">Cumplimiento</option>
                  <option value="security">Seguridad</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="review">Revisión</option>
                  <option value="training">Capacitación</option>
                  <option value="incident">Incidente</option>
                  <option value="other">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="one-time">Una vez</option>
                  <option value="recurring">Recurrente</option>
                  <option value="milestone">Hito</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
            </div>
          </div>

          {/* Asignación */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Asignación</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asignado A *
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.assignedTo ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del responsable"
                />
                {errors.assignedTo && <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Creado Por *
                </label>
                <input
                  type="text"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.createdBy ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Creador de la tarea"
                />
                {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aprobador
                </label>
                <input
                  type="text"
                  name="approver"
                  value={formData.approver}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Quien debe aprobar"
                />
              </div>
            </div>
          </div>

          {/* Fechas y Esfuerzo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Fechas y Esfuerzo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Límite *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.dueDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progreso (%)
                </label>
                <input
                  type="range"
                  name="progress"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.progress}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 mt-1">{formData.progress}%</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas Estimadas
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.estimatedHours ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.estimatedHours && <p className="text-red-500 text-sm mt-1">{errors.estimatedHours}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas Reales
                </label>
                <input
                  type="number"
                  name="actualHours"
                  value={formData.actualHours}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.actualHours ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.actualHours && <p className="text-red-500 text-sm mt-1">{errors.actualHours}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Riesgo
                </label>
                <select
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                  <option value="critical">Crítico</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recurrencia (solo si es tarea recurrente) */}
          {formData.type === 'recurring' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Recurrencia</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frecuencia
                  </label>
                  <select
                    name="recurrenceFrequency"
                    value={formData.recurrenceFrequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Diaria</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="annually">Anual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intervalo
                  </label>
                  <input
                    type="number"
                    name="recurrenceInterval"
                    value={formData.recurrenceInterval}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    name="recurrenceEndDate"
                    value={formData.recurrenceEndDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Información Adicional */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Información Adicional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entidad Relacionada
                </label>
                <input
                  type="text"
                  name="relatedEntity"
                  value={formData.relatedEntity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Sistema, activo o proveedor relacionado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Entidad
                </label>
                <select
                  name="relatedEntityType"
                  value={formData.relatedEntityType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="system">Sistema</option>
                  <option value="asset">Activo</option>
                  <option value="vendor">Proveedor</option>
                  <option value="employee">Empleado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etiquetas
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Separadas por comas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marcos de Cumplimiento
                </label>
                <input
                  type="text"
                  name="complianceFrameworks"
                  value={formData.complianceFrameworks}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: ISO 27001, GDPR (separados por comas)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Información adicional sobre la tarea"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {task ? 'Actualizar' : 'Crear'} Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;