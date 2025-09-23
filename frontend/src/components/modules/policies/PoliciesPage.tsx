import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Calendar,
  User,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  version: string;
  status: 'draft' | 'active' | 'under_review' | 'archived';
  createdBy: string;
  createdDate: string;
  lastModified: string;
  nextReview: string;
  approvedBy?: string;
  effectiveDate: string;
  tags: string[];
  relatedFrameworks: string[];
}

export default function PoliciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Datos simulados de politicas
  const policies: Policy[] = [
    {
      id: 'POL-001',
      title: 'Politica de Seguridad de la Informacion',
      description: 'Establece los lineamientos y controles para proteger la informacion de la organizacion.',
      category: 'Seguridad',
      version: '2.1',
      status: 'active',
      createdBy: 'Ana Garcia',
      createdDate: '2024-01-15',
      lastModified: '2024-08-20',
      nextReview: '2025-01-15',
      approvedBy: 'Director General',
      effectiveDate: '2024-02-01',
      tags: ['ISO 27001', 'Seguridad', 'Informacion'],
      relatedFrameworks: ['ISO 27001', 'NIST']
    },
    {
      id: 'POL-002',
      title: 'Politica de Proteccion de Datos Personales',
      description: 'Define los procedimientos para el tratamiento y proteccion de datos personales segun GDPR.',
      category: 'Privacidad',
      version: '1.3',
      status: 'active',
      createdBy: 'Maria Martinez',
      createdDate: '2024-03-10',
      lastModified: '2024-07-15',
      nextReview: '2024-12-10',
      approvedBy: 'Director Legal',
      effectiveDate: '2024-04-01',
      tags: ['GDPR', 'Privacidad', 'Datos Personales'],
      relatedFrameworks: ['GDPR', 'ISO 27001']
    },
    {
      id: 'POL-003',
      title: 'Politica de Control de Acceso',
      description: 'Regula el acceso a sistemas y recursos de informacion de la organizacion.',
      category: 'Acceso',
      version: '1.0',
      status: 'under_review',
      createdBy: 'Carlos Lopez',
      createdDate: '2024-08-01',
      lastModified: '2024-09-01',
      nextReview: '2025-02-01',
      effectiveDate: '2024-10-01',
      tags: ['Acceso', 'Sistemas', 'Autenticacion'],
      relatedFrameworks: ['ISO 27001', 'SOX']
    },
    {
      id: 'POL-004',
      title: 'Politica de Continuidad del Negocio',
      description: 'Establece los procedimientos para mantener las operaciones criticas durante interrupciones.',
      category: 'Continuidad',
      version: '2.0',
      status: 'draft',
      createdBy: 'David Ruiz',
      createdDate: '2024-08-15',
      lastModified: '2024-09-03',
      nextReview: '2025-03-15',
      effectiveDate: '2024-11-01',
      tags: ['Continuidad', 'Recuperacion', 'Operaciones'],
      relatedFrameworks: ['ISO 22301', 'NIST']
    }
  ];

  const categories = ['Seguridad', 'Privacidad', 'Acceso', 'Continuidad', 'Cumplimiento', 'Operacional'];
  const statusTypes = ['draft', 'active', 'under_review', 'archived'];

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = 
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || policy.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'under_review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'archived': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'draft': return Edit;
      case 'under_review': return Clock;
      case 'archived': return AlertTriangle;
      default: return FileText;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'draft': return 'Borrador';
      case 'under_review': return 'En Revision';
      case 'archived': return 'Archivada';
      default: return status;
    }
  };

  const isReviewDue = (nextReview: string) => {
    const reviewDate = new Date(nextReview);
    const today = new Date();
    const daysUntilReview = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilReview <= 30;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-500" />
              Gestion de Politicas
            </h1>
            <p className="text-gray-600 mt-1">
              Administra politicas, procedimientos y documentos normativos
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Exportar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Nueva Politica
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Politicas</p>
              <p className="text-2xl font-bold text-gray-900">{policies.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {policies.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">En Revision</p>
              <p className="text-2xl font-bold text-gray-900">
                {policies.filter(p => p.status === 'under_review').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Proximas a Vencer</p>
              <p className="text-2xl font-bold text-gray-900">
                {policies.filter(p => isReviewDue(p.nextReview)).length}
              </p>
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
                placeholder="Buscar politicas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              {statusTypes.map(status => (
                <option key={status} value={status}>{getStatusText(status)}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Mas filtros
            </button>
          </div>
        </div>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {filteredPolicies.map((policy) => {
          const StatusIcon = getStatusIcon(policy.status);
          const reviewDue = isReviewDue(policy.nextReview);
          
          return (
            <div key={policy.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-500">{policy.id}</span>
                    <span className="text-sm font-medium text-gray-600">v{policy.version}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(policy.status)}`}>
                      <StatusIcon className="h-3 w-3" />
                      {getStatusText(policy.status)}
                    </span>
                    {reviewDue && (
                      <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-full">
                        Revision proxima
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {policy.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {policy.description}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <User className="h-4 w-4 mr-1" />
                    Creado por
                  </div>
                  <p className="text-sm font-medium text-gray-900">{policy.createdBy}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Fecha efectiva
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(policy.effectiveDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    Ultima modificacion
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(policy.lastModified).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Proxima revision
                  </div>
                  <p className={`text-sm font-medium ${reviewDue ? 'text-orange-600' : 'text-gray-900'}`}>
                    {new Date(policy.nextReview).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>

              {policy.relatedFrameworks.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Frameworks relacionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {policy.relatedFrameworks.map((framework, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {policy.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {policy.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {policy.approvedBy && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Aprobado por: <span className="font-medium text-gray-700">{policy.approvedBy}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredPolicies.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron politicas
          </h3>
          <p className="text-gray-500 mb-4">
            No hay politicas que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  );
}