// src/components/modules/resources/vendors/VendorModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  category: 'software' | 'hardware' | 'consulting' | 'cloud' | 'security' | 'other';
  status: 'active' | 'inactive' | 'under-review' | 'blacklisted';
  contractStart?: string;
  contractEnd?: string;
  riskAssessment?: 'low' | 'medium' | 'high';
  complianceStatus?: 'compliant' | 'non-compliant' | 'pending';
  lastAudit?: string;
  website?: string;
  description?: string;
  services?: string[];
  createdAt: string;
  updatedAt: string;
}

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  vendor?: Vendor | null;
  title: string;
}

export default function VendorModal({ isOpen, onClose, onSave, vendor, title }: VendorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    category: 'software' as const,
    status: 'active' as const,
    contractStart: '',
    contractEnd: '',
    riskAssessment: 'low' as const,
    complianceStatus: 'pending' as const,
    lastAudit: '',
    website: '',
    description: '',
    services: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [servicesInput, setServicesInput] = useState('');

  const categories = [
    { value: 'software', label: 'Software' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'consulting', label: 'Consultoría' },
    { value: 'cloud', label: 'Servicios en la Nube' },
    { value: 'security', label: 'Seguridad' },
    { value: 'other', label: 'Otro' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'under-review', label: 'En Revisión' },
    { value: 'blacklisted', label: 'Bloqueado' }
  ];

  const riskLevels = [
    { value: 'low', label: 'Bajo' },
    { value: 'medium', label: 'Medio' },
    { value: 'high', label: 'Alto' }
  ];

  const complianceStatuses = [
    { value: 'compliant', label: 'Cumple' },
    { value: 'non-compliant', label: 'No Cumple' },
    { value: 'pending', label: 'Pendiente' }
  ];

  // Cargar datos del proveedor si está editando
  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        contactEmail: vendor.contactEmail || '',
        contactPhone: vendor.contactPhone || '',
        address: vendor.address || '',
        category: vendor.category || 'software',
        status: vendor.status || 'active',
        contractStart: vendor.contractStart || '',
        contractEnd: vendor.contractEnd || '',
        riskAssessment: vendor.riskAssessment || 'low',
        complianceStatus: vendor.complianceStatus || 'pending',
        lastAudit: vendor.lastAudit || '',
        website: vendor.website || '',
        description: vendor.description || '',
        services: vendor.services || [],
      });
      setServicesInput((vendor.services || []).join(', '));
    } else {
      // Limpiar formulario para nuevo proveedor
      setFormData({
        name: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        category: 'software',
        status: 'active',
        contractStart: '',
        contractEnd: '',
        riskAssessment: 'low',
        complianceStatus: 'pending',
        lastAudit: '',
        website: '',
        description: '',
        services: [],
      });
      setServicesInput('');
    }
    setErrors({});
  }, [vendor, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'El email de contacto es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'El email no es válido';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'El sitio web debe incluir http:// o https://';
    }

    if (formData.contractStart && formData.contractEnd) {
      const startDate = new Date(formData.contractStart);
      const endDate = new Date(formData.contractEnd);
      if (endDate <= startDate) {
        newErrors.contractEnd = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Procesar servicios desde el campo de texto
    const servicesArray = servicesInput
      .split(',')
      .map(service => service.trim())
      .filter(service => service.length > 0);

    const finalData = {
      ...formData,
      services: servicesArray,
    };

    onSave(finalData);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la empresa *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ej: TechCorp Solutions"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email de contacto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de contacto *
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.contactEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="contacto@empresa.com"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              {/* Teléfono de contacto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono de contacto
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+34 91 234 5678"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Sitio web */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio web
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.website ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="https://www.empresa.com"
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.website}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Calle, Ciudad, País"
                />
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Breve descripción de la empresa y sus servicios..."
                />
              </div>
            </div>
          </div>

          {/* Información contractual */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Contractual</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inicio de contrato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inicio de contrato
                </label>
                <input
                  type="date"
                  value={formData.contractStart}
                  onChange={(e) => handleChange('contractStart', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Fin de contrato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fin de contrato
                </label>
                <input
                  type="date"
                  value={formData.contractEnd}
                  onChange={(e) => handleChange('contractEnd', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.contractEnd ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.contractEnd && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.contractEnd}
                  </p>
                )}
              </div>

              {/* Servicios */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servicios ofrecidos
                </label>
                <input
                  type="text"
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Separar servicios por comas: Consultoría, Desarrollo, Soporte..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Separa los servicios con comas
                </p>
              </div>
            </div>
          </div>

          {/* Evaluación y cumplimiento */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluación y Cumplimiento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Evaluación de riesgo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evaluación de riesgo
                </label>
                <select
                  value={formData.riskAssessment}
                  onChange={(e) => handleChange('riskAssessment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {riskLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              {/* Estado de cumplimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de cumplimiento
                </label>
                <select
                  value={formData.complianceStatus}
                  onChange={(e) => handleChange('complianceStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {complianceStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Última auditoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Última auditoría
                </label>
                <input
                  type="date"
                  value={formData.lastAudit}
                  onChange={(e) => handleChange('lastAudit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              {vendor ? 'Actualizar' : 'Crear'} Proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}