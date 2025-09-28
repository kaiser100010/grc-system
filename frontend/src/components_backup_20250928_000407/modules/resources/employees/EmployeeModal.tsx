// src/components/modules/resources/employees/EmployeeModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  phone?: string;
  startDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  manager?: string;
  skills?: string[];
  certifications?: string[];
  securityClearance?: 'none' | 'confidential' | 'secret' | 'top-secret';
  riskLevel?: 'low' | 'medium' | 'high';
  lastTraining?: string;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  employee?: Employee | null;
  title: string;
}

export default function EmployeeModal({ isOpen, onClose, onSave, employee, title }: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    phone: '',
    startDate: '',
    status: 'active' as const,
    manager: '',
    securityClearance: 'none' as const,
    riskLevel: 'low' as const,
    lastTraining: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = [
    'Risk & Compliance',
    'Information Technology', 
    'Human Resources',
    'Finance',
    'Operations',
    'Legal',
    'Security',
    'Marketing'
  ];

  const positions = [
    'Senior Compliance Officer',
    'Chief Risk Officer',
    'IT Security Analyst',
    'Software Developer',
    'Financial Analyst',
    'HR Manager',
    'Operations Manager',
    'Legal Counsel'
  ];

  // Cargar datos del empleado si está editando
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        position: employee.position || '',
        department: employee.department || '',
        phone: employee.phone || '',
        startDate: employee.startDate || '',
        status: employee.status || 'active',
        manager: employee.manager || '',
        securityClearance: employee.securityClearance || 'none',
        riskLevel: employee.riskLevel || 'low',
        lastTraining: employee.lastTraining || '',
      });
    } else {
      // Limpiar formulario para nuevo empleado
      setFormData({
        name: '',
        email: '',
        position: '',
        department: '',
        phone: '',
        startDate: new Date().toISOString().split('T')[0], // Fecha actual
        status: 'active',
        manager: '',
        securityClearance: 'none',
        riskLevel: 'low',
        lastTraining: '',
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'La posición es requerida';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'El departamento es requerido';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de ingreso es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
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
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ej: Ana García López"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email corporativo *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="ana.garcia@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Posición y Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Posición */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posición *
              </label>
              <select
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.position ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar posición</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              {errors.position && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.position}
                </p>
              )}
            </div>

            {/* Departamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar departamento</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.department}
                </p>
              )}
            </div>
          </div>

          {/* Teléfono y Fecha de ingreso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="+34 612 345 678"
              />
            </div>

            {/* Fecha de ingreso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de ingreso *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.startDate}
                </p>
              )}
            </div>
          </div>

          {/* Estado y Manager */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="on-leave">En Licencia</option>
              </select>
            </div>

            {/* Manager */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manager
              </label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => handleChange('manager', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Nombre del manager"
              />
            </div>
          </div>

          {/* Security Clearance y Risk Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Security Clearance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Seguridad
              </label>
              <select
                value={formData.securityClearance}
                onChange={(e) => handleChange('securityClearance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="none">Ninguno</option>
                <option value="confidential">Confidencial</option>
                <option value="secret">Secreto</option>
                <option value="top-secret">Alto Secreto</option>
              </select>
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Riesgo
              </label>
              <select
                value={formData.riskLevel}
                onChange={(e) => handleChange('riskLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="low">Bajo</option>
                <option value="medium">Medio</option>
                <option value="high">Alto</option>
              </select>
            </div>
          </div>

          {/* Última capacitación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Última Capacitación
            </label>
            <input
              type="date"
              value={formData.lastTraining}
              onChange={(e) => handleChange('lastTraining', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
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
              {employee ? 'Actualizar' : 'Crear'} Empleado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}