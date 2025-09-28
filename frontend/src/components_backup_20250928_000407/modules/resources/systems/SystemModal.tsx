// src/components/modules/resources/systems/SystemModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Server } from 'lucide-react';

interface SystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (system: any) => void;
  system?: any | null;
  title: string;
}

const SystemModal: React.FC<SystemModalProps> = ({ isOpen, onClose, onSave, system, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'application',
    type: 'internal',
    status: 'active',
    version: '',
    vendor: '',
    url: '',
    environment: 'production',
    criticality: 'medium',
    dataClassification: 'internal',
    owner: '',
    administrator: '',
    implementationDate: '',
    lastUpdate: '',
    nextReview: '',
    backupFrequency: 'daily',
    complianceFrameworks: '',
    users: 0,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (system) {
      setFormData({
        name: system.name || '',
        description: system.description || '',
        category: system.category || 'application',
        type: system.type || 'internal',
        status: system.status || 'active',
        version: system.version || '',
        vendor: system.vendor || '',
        url: system.url || '',
        environment: system.environment || 'production',
        criticality: system.criticality || 'medium',
        dataClassification: system.dataClassification || 'internal',
        owner: system.owner || '',
        administrator: system.administrator || '',
        implementationDate: system.implementationDate || '',
        lastUpdate: system.lastUpdate || '',
        nextReview: system.nextReview || '',
        backupFrequency: system.backupFrequency || 'daily',
        complianceFrameworks: system.complianceFrameworks ? system.complianceFrameworks.join(', ') : '',
        users: system.users || 0,
        notes: system.notes || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'application',
        type: 'internal',
        status: 'active',
        version: '',
        vendor: '',
        url: '',
        environment: 'production',
        criticality: 'medium',
        dataClassification: 'internal',
        owner: '',
        administrator: '',
        implementationDate: '',
        lastUpdate: '',
        nextReview: '',
        backupFrequency: 'daily',
        complianceFrameworks: '',
        users: 0,
        notes: ''
      });
    }
    setErrors({});
  }, [system, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.version.trim()) {
      newErrors.version = 'La versión es requerida';
    }
    if (!formData.owner.trim()) {
      newErrors.owner = 'El propietario es requerido';
    }
    if (!formData.administrator.trim()) {
      newErrors.administrator = 'El administrador es requerido';
    }
    if (!formData.implementationDate) {
      newErrors.implementationDate = 'La fecha de implementación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const systemData = {
        ...formData,
        complianceFrameworks: formData.complianceFrameworks
          .split(',')
          .map(f => f.trim())
          .filter(f => f.length > 0),
        users: Number(formData.users),
        vendor: formData.vendor || undefined,
        url: formData.url || undefined,
        lastUpdate: formData.lastUpdate || undefined,
        nextReview: formData.nextReview || undefined,
        notes: formData.notes || undefined
      };

      onSave(systemData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Sistema *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Sistema ERP"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="erp">ERP</option>
                <option value="crm">CRM</option>
                <option value="security">Seguridad</option>
                <option value="infrastructure">Infraestructura</option>
                <option value="database">Base de Datos</option>
                <option value="application">Aplicación</option>
                <option value="other">Otros</option>
              </select>
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
                placeholder="Descripción del sistema"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Propietario *
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.owner ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Responsable del sistema"
              />
              {errors.owner && <p className="text-red-500 text-sm mt-1">{errors.owner}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Administrador *
              </label>
              <input
                type="text"
                name="administrator"
                value={formData.administrator}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.administrator ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Administrador técnico"
              />
              {errors.administrator && <p className="text-red-500 text-sm mt-1">{errors.administrator}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Versión *
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.version ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: 2024.1"
              />
              {errors.version && <p className="text-red-500 text-sm mt-1">{errors.version}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Implementación *
              </label>
              <input
                type="date"
                name="implementationDate"
                value={formData.implementationDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.implementationDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.implementationDate && <p className="text-red-500 text-sm mt-1">{errors.implementationDate}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
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
              {system ? 'Actualizar' : 'Crear'} Sistema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemModal;