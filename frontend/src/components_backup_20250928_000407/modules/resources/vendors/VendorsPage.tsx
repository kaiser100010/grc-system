import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  AlertCircle,
  ExternalLink,
  Building
} from 'lucide-react';
import { useVendors } from '../../../../hooks/useGRC';
import VendorModal from './VendorModal';

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

export default function VendorsPage() {
  const { vendors, addVendor, updateVendor, deleteVendor, getVendorById } = useVendors();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const categories = ['software', 'hardware', 'consulting', 'cloud', 'security', 'other'];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.description && vendor.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || vendor.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'under-review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'blacklisted': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskLevelColor = (level: string | undefined) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getComplianceColor = (status: string | undefined) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50 border-green-200';
      case 'non-compliant': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'under-review': return 'En Revisión';
      case 'blacklisted': return 'Bloqueado';
      default: return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'software': return 'Software';
      case 'hardware': return 'Hardware';
      case 'consulting': return 'Consultoría';
      case 'cloud': return 'Nube';
      case 'security': return 'Seguridad';
      case 'other': return 'Otro';
      default: return category;
    }
  };

  const getRiskLevelText = (level: string | undefined) => {
    switch (level) {
      case 'low': return 'Bajo';
      case 'medium': return 'Medio';
      case 'high': return 'Alto';
      default: return 'No Evaluado';
    }
  };

  const getComplianceText = (status: string | undefined) => {
    switch (status) {
      case 'compliant': return 'Cumple';
      case 'non-compliant': return 'No Cumple';
      case 'pending': return 'Pendiente';
      default: return 'No Evaluado';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return parts[0][0] + (parts[0][1] || '');
  };

  // Funciones CRUD
  const handleAddNew = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vendorId: string) => {
    const vendor = getVendorById(vendorId);
    if (vendor) {
      setEditingVendor(vendor);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (vendorId: string) => {
    const vendor = getVendorById(vendorId);
    if (vendor && window.confirm(`¿Estás seguro de que quieres eliminar a ${vendor.name}?`)) {
      deleteVendor(vendorId);
    }
  };

  const handleSaveVendor = (vendorData: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingVendor) {
      // Editando proveedor existente
      updateVendor(editingVendor.id, vendorData);
    } else {
      // Creando nuevo proveedor
      addVendor(vendorData);
    }
    setIsModalOpen(false);
    setEditingVendor(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVendor(null);
  };

  // Calcular estadísticas en tiempo real
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const underReviewVendors = vendors.filter(v => v.status === 'under-review').length;
  const highRiskVendors = vendors.filter(v => v.riskAssessment === 'high').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="h-6 w-6 text-purple-500" />
              Gestión de Proveedores
            </h1>
            <p className="text-gray-600 mt-1">
              Administra proveedores, contratos y evaluaciones de riesgo ({totalVendors} proveedores registrados)
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="h-4 w-4" />
              Importar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Exportar
            </button>
            <button 
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nuevo Proveedor
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Datos en tiempo real */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Proveedores</p>
              <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{activeVendors}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Riesgo Alto</p>
              <p className="text-2xl font-bold text-gray-900">{highRiskVendors}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">En Revisión</p>
              <p className="text-2xl font-bold text-gray-900">{underReviewVendors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar proveedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{getCategoryText(cat)}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="under-review">En Revisión</option>
              <option value="blacklisted">Bloqueados</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Más filtros
            </button>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Riesgo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cumplimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Auditoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-700">
                            {getInitials(vendor.name)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {vendor.name}
                          {vendor.website && (
                            <a 
                              href={vendor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{vendor.description}</div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center text-xs text-gray-500">
                            <Mail className="h-3 w-3 mr-1" />
                            {vendor.contactEmail}
                          </div>
                          {vendor.contactPhone && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {vendor.contactPhone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Building className="h-4 w-4 mr-1 text-gray-400" />
                      {getCategoryText(vendor.category)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(vendor.status)}`}>
                      {getStatusText(vendor.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getRiskLevelColor(vendor.riskAssessment)}`}>
                      {getRiskLevelText(vendor.riskAssessment)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getComplianceColor(vendor.complianceStatus)}`}>
                      {getComplianceText(vendor.complianceStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vendor.lastAudit ? new Date(vendor.lastAudit).toLocaleDateString('es-ES') : 'No registrada'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(vendor.id)}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                        title="Editar proveedor"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(vendor.id)}
                        className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        title="Eliminar proveedor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-8">
            <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron proveedores
            </h3>
            <p className="text-gray-500 mb-4">
              {vendors.length === 0 
                ? "No hay proveedores registrados. Agrega tu primer proveedor para comenzar."
                : "Intenta ajustar los filtros de búsqueda o agrega nuevos proveedores."
              }
            </p>
            {vendors.length === 0 && (
              <button 
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Agregar Primer Proveedor
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredVendors.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">1</span> a{' '}
            <span className="font-medium">{filteredVendors.length}</span> de{' '}
            <span className="font-medium">{filteredVendors.length}</span> resultados
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <VendorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveVendor}
        vendor={editingVendor}
        title={editingVendor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      />
    </div>
  );
}