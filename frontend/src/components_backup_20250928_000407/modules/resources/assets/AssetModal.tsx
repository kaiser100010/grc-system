// src/components/modules/resources/assets/AssetModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: any) => void;
  asset?: any | null;
  title: string;
}

const AssetModal: React.FC<AssetModalProps> = ({ isOpen, onClose, onSave, asset, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'hardware',
    type: 'physical',
    status: 'active',
    assetTag: '',
    serialNumber: '',
    model: '',
    manufacturer: '',
    purchaseDate: '',
    warrantyExpiry: '',
    location: '',
    owner: '',
    custodian: '',
    value: '',
    currency: 'EUR',
    criticality: 'medium',
    dataClassification: 'internal',
    relatedSystems: '',
    complianceFrameworks: '',
    lastAuditDate: '',
    nextAuditDate: '',
    maintenanceSchedule: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        description: asset.description || '',
        category: asset.category || 'hardware',
        type: asset.type || 'physical',
        status: asset.status || 'active',
        assetTag: asset.assetTag || '',
        serialNumber: asset.serialNumber || '',
        model: asset.model || '',
        manufacturer: asset.manufacturer || '',
        purchaseDate: asset.purchaseDate || '',
        warrantyExpiry: asset.warrantyExpiry || '',
        location: asset.location || '',
        owner: asset.owner || '',
        custodian: asset.custodian || '',
        value: asset.value ? asset.value.toString() : '',
        currency: asset.currency || 'EUR',
        criticality: asset.criticality || 'medium',
        dataClassification: asset.dataClassification || 'internal',
        relatedSystems: asset.relatedSystems ? asset.relatedSystems.join(', ') : '',
        complianceFrameworks: asset.complianceFrameworks ? asset.complianceFrameworks.join(', ') : '',
        lastAuditDate: asset.lastAuditDate || '',
        nextAuditDate: asset.nextAuditDate || '',
        maintenanceSchedule: asset.maintenanceSchedule || '',
        notes: asset.notes || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'hardware',
        type: 'physical',
        status: 'active',
        assetTag: '',
        serialNumber: '',
        model: '',
        manufacturer: '',
        purchaseDate: '',
        warrantyExpiry: '',
        location: '',
        owner: '',
        custodian: '',
        value: '',
        currency: 'EUR',
        criticality: 'medium',
        dataClassification: 'internal',
        relatedSystems: '',
        complianceFrameworks: '',
        lastAuditDate: '',
        nextAuditDate: '',
        maintenanceSchedule: '',
        notes: ''
      });
    }
    setErrors({});
  }, [asset, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }
    if (!formData.owner.trim()) {
      newErrors.owner = 'El propietario es requerido';
    }
    if (!formData.custodian.trim()) {
      newErrors.custodian = 'El custodio es requerido';
    }
    if (formData.value && isNaN(Number(formData.value))) {
      newErrors.value = 'El valor debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const assetData = {
        ...formData,
        value: formData.value ? Number(formData.value) : undefined,
        relatedSystems: formData.relatedSystems
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
        complianceFrameworks: formData.complianceFrameworks
          .split(',')
          .map(f => f.trim())
          .filter(f => f.length > 0),
        assetTag: formData.assetTag || undefined,
        serialNumber: formData.serialNumber || undefined,
        model: formData.model || undefined,
        manufacturer: formData.manufacturer || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        warrantyExpiry: formData.warrantyExpiry || undefined,
        lastAuditDate: formData.lastAuditDate || undefined,
        nextAuditDate: formData.nextAuditDate || undefined,
        maintenanceSchedule: formData.maintenanceSchedule || undefined,
        notes: formData.notes || undefined
      };

      onSave(assetData);
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Activo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Laptop Dell XPS"
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
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="data">Datos</option>
                  <option value="network">Red</option>
                  <option value="facility">Instalaciones</option>
                  <option value="vehicle">Vehículos</option>
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
                  placeholder="Descripción detallada del activo"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="physical">Físico</option>
                  <option value="digital">Digital</option>
                  <option value="virtual">Virtual</option>
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
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="retired">Retirado</option>
                  <option value="lost">Perdido</option>
                  <option value="stolen">Robado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Identificación */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Identificación</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etiqueta de Activo
                </label>
                <input
                  type="text"
                  name="assetTag"
                  value={formData.assetTag}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: LAP-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Serie
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Número de serie del fabricante"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: XPS 13"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fabricante</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Dell, Microsoft, HP"
                />
              </div>
            </div>
          </div>

          {/* Ubicación y Responsabilidad */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Ubicación y Responsabilidad</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ubicación física o lógica"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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
                  placeholder="Responsable del activo"
                />
                {errors.owner && <p className="text-red-500 text-sm mt-1">{errors.owner}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custodio *
                </label>
                <input
                  type="text"
                  name="custodian"
                  value={formData.custodian}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.custodian ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Usuario actual del activo"
                />
                {errors.custodian && <p className="text-red-500 text-sm mt-1">{errors.custodian}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.value ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Fechas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Compra
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vencimiento de Garantía
                </label>
                <input
                  type="date"
                  name="warrantyExpiry"
                  value={formData.warrantyExpiry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Clasificación y Cumplimiento */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Clasificación y Cumplimiento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Criticidad</label>
                <select
                  name="criticality"
                  value={formData.criticality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clasificación de Datos
                </label>
                <select
                  name="dataClassification"
                  value={formData.dataClassification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Público</option>
                  <option value="internal">Interno</option>
                  <option value="confidential">Confidencial</option>
                  <option value="restricted">Restringido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sistemas Relacionados
                </label>
                <input
                  type="text"
                  name="relatedSystems"
                  value={formData.relatedSystems}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Separados por comas"
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
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Información Adicional</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Información adicional sobre el activo"
              />
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
              {asset ? 'Actualizar' : 'Crear'} Activo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;