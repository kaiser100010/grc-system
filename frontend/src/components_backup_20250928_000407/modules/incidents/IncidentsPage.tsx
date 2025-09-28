// src/components/modules/incidents/IncidentsPage.tsx

import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Paperclip,
  Flag,
  Zap,
  Info,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Activity,
  Shield,
  FileText,
  Hash,
  Target,
  BarChart3
} from 'lucide-react';
import useAppStore from '../../../store/appStore';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reporter: string;
  reporterName?: string;
  assignee: string;
  assigneeName?: string;
  category: string;
  detectionDate: Date;
  resolutionDate?: Date;
  rootCause?: string;
  correctiveActions?: string;
  lessonsLearned?: string;
  relatedRisk?: string;
  impactedSystems?: string[];
  estimatedLoss?: number;
  timeToDetect?: number; // hours
  timeToResolve?: number; // hours
  attachments?: number;
  comments?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TimelineEvent {
  id: string;
  incidentId: string;
  timestamp: Date;
  type: 'created' | 'status_change' | 'assigned' | 'comment' | 'resolved' | 'closed';
  description: string;
  user: string;
  details?: any;
}

const incidentCategories = [
  { value: 'security', label: 'Seguridad', icon: Shield, color: 'red' },
  { value: 'operational', label: 'Operacional', icon: Activity, color: 'blue' },
  { value: 'compliance', label: 'Cumplimiento', icon: FileText, color: 'purple' },
  { value: 'data', label: 'Datos', icon: Shield, color: 'green' },
  { value: 'system', label: 'Sistema', icon: Activity, color: 'orange' },
  { value: 'network', label: 'Red', icon: Activity, color: 'indigo' },
  { value: 'physical', label: 'Físico', icon: Shield, color: 'yellow' },
  { value: 'other', label: 'Otro', icon: Info, color: 'gray' }
];

export default function IncidentsPage() {
  const { 
    incidents, 
    addIncident, 
    updateIncident, 
    deleteIncident, 
    employees, 
    risks,
    systems
  } = useAppStore();
  
  const [showForm, setShowForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailIncident, setDetailIncident] = useState<Incident | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineIncident, setTimelineIncident] = useState<Incident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterSeverity, setFilterSeverity] = useState('todos');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as const,
    status: 'open' as const,
    reporter: '',
    assignee: '',
    category: 'other',
    detectionDate: new Date().toISOString().split('T')[0],
    resolutionDate: '',
    rootCause: '',
    correctiveActions: '',
    lessonsLearned: '',
    relatedRisk: '',
    impactedSystems: [] as string[],
    estimatedLoss: 0,
    tags: [] as string[],
    tagInput: ''
  });

  // Timeline events mock data
  const [timelineEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      incidentId: '1',
      timestamp: new Date('2024-03-01T10:00:00'),
      type: 'created',
      description: 'Incidente creado',
      user: 'Sistema',
      details: { severity: 'high' }
    },
    {
      id: '2',
      incidentId: '1',
      timestamp: new Date('2024-03-01T10:15:00'),
      type: 'assigned',
      description: 'Asignado a María García',
      user: 'Carlos López',
      details: { assignee: 'María García' }
    },
    {
      id: '3',
      incidentId: '1',
      timestamp: new Date('2024-03-01T11:00:00'),
      type: 'status_change',
      description: 'Estado cambiado a Investigando',
      user: 'María García',
      details: { from: 'open', to: 'investigating' }
    },
    {
      id: '4',
      incidentId: '1',
      timestamp: new Date('2024-03-01T14:30:00'),
      type: 'comment',
      description: 'Añadido comentario',
      user: 'María García',
      details: { comment: 'Se identificó el origen del problema' }
    },
    {
      id: '5',
      incidentId: '1',
      timestamp: new Date('2024-03-01T16:00:00'),
      type: 'resolved',
      description: 'Incidente resuelto',
      user: 'María García',
      details: { resolution: 'Parche aplicado' }
    }
  ]);

  // Cargar datos cuando se selecciona un incidente para editar
  useEffect(() => {
    if (showForm && selectedIncident) {
      setFormData({
        title: selectedIncident.title,
        description: selectedIncident.description,
        severity: selectedIncident.severity,
        status: selectedIncident.status,
        reporter: selectedIncident.reporter,
        assignee: selectedIncident.assignee,
        category: selectedIncident.category,
        detectionDate: new Date(selectedIncident.detectionDate).toISOString().split('T')[0],
        resolutionDate: selectedIncident.resolutionDate 
          ? new Date(selectedIncident.resolutionDate).toISOString().split('T')[0] 
          : '',
        rootCause: selectedIncident.rootCause || '',
        correctiveActions: selectedIncident.correctiveActions || '',
        lessonsLearned: selectedIncident.lessonsLearned || '',
        relatedRisk: selectedIncident.relatedRisk || '',
        impactedSystems: selectedIncident.impactedSystems || [],
        estimatedLoss: selectedIncident.estimatedLoss || 0,
        tags: selectedIncident.tags || [],
        tagInput: ''
      });
    } else if (showForm && !selectedIncident) {
      // Reset para nuevo incidente
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        status: 'open',
        reporter: employees.length > 0 ? employees[0].id : '',
        assignee: employees.length > 0 ? employees[0].id : '',
        category: 'other',
        detectionDate: new Date().toISOString().split('T')[0],
        resolutionDate: '',
        rootCause: '',
        correctiveActions: '',
        lessonsLearned: '',
        relatedRisk: '',
        impactedSystems: [],
        estimatedLoss: 0,
        tags: [],
        tagInput: ''
      });
    }
  }, [showForm, selectedIncident, employees]);

  // Funciones de utilidad
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'critical': return <Zap className="h-3 w-3" />;
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <AlertCircle className="h-3 w-3" />;
      case 'low': return <Info className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'text-red-600 bg-red-100';
      case 'investigating': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'open': return AlertCircle;
      case 'investigating': return PlayCircle;
      case 'resolved': return CheckCircle;
      case 'closed': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'open': return 'Abierto';
      case 'investigating': return 'Investigando';
      case 'resolved': return 'Resuelto';
      case 'closed': return 'Cerrado';
      default: return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = incidentCategories.find(c => c.value === category);
    return cat ? cat.icon : Info;
  };

  // CRUD Functions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reporterName = employees.find(emp => emp.id === formData.reporter)?.name || '';
    const assigneeName = employees.find(emp => emp.id === formData.assignee)?.name || '';
    
    // Calculate time metrics
    const detectionDate = new Date(formData.detectionDate);
    const resolutionDate = formData.resolutionDate ? new Date(formData.resolutionDate) : null;
    const timeToResolve = resolutionDate 
      ? Math.round((resolutionDate.getTime() - detectionDate.getTime()) / (1000 * 60 * 60))
      : undefined;
    
    if (selectedIncident) {
      // Editar
      const updatedIncident: Incident = {
        ...selectedIncident,
        ...formData,
        reporterName,
        assigneeName,
        detectionDate: new Date(formData.detectionDate),
        resolutionDate: formData.resolutionDate ? new Date(formData.resolutionDate) : undefined,
        timeToResolve,
        updatedAt: new Date()
      };
      updateIncident(selectedIncident.id, updatedIncident);
    } else {
      // Crear
      const newIncident: Incident = {
        id: Date.now().toString(),
        ...formData,
        reporterName,
        assigneeName,
        detectionDate: new Date(formData.detectionDate),
        resolutionDate: formData.resolutionDate ? new Date(formData.resolutionDate) : undefined,
        timeToDetect: Math.random() * 24, // Mock data
        timeToResolve,
        attachments: 0,
        comments: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addIncident(newIncident);
    }
    
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este incidente?')) {
      deleteIncident(id);
    }
  };

  const handleViewDetails = (incident: Incident) => {
    setDetailIncident(incident);
    setShowDetails(true);
  };

  const handleViewTimeline = (incident: Incident) => {
    setTimelineIncident(incident);
    setShowTimeline(true);
  };

  const handleAddTag = () => {
    if (formData.tagInput && !formData.tags.includes(formData.tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput],
        tagInput: ''
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSystemToggle = (systemId: string) => {
    if (formData.impactedSystems.includes(systemId)) {
      setFormData({
        ...formData,
        impactedSystems: formData.impactedSystems.filter(id => id !== systemId)
      });
    } else {
      setFormData({
        ...formData,
        impactedSystems: [...formData.impactedSystems, systemId]
      });
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedIncident(null);
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      status: 'open',
      reporter: '',
      assignee: '',
      category: 'other',
      detectionDate: new Date().toISOString().split('T')[0],
      resolutionDate: '',
      rootCause: '',
      correctiveActions: '',
      lessonsLearned: '',
      relatedRisk: '',
      impactedSystems: [],
      estimatedLoss: 0,
      tags: [],
      tagInput: ''
    });
  };

  // Filtros
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || incident.status === filterStatus;
    const matchesSeverity = filterSeverity === 'todos' || incident.severity === filterSeverity;
    const matchesCategory = filterCategory === 'todos' || incident.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesSeverity && matchesCategory;
  });

  // Estadísticas
  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    closed: incidents.filter(i => i.status === 'closed').length,
    critical: incidents.filter(i => i.severity === 'critical').length,
    avgResolutionTime: incidents.filter(i => i.timeToResolve).length > 0
      ? Math.round(
          incidents
            .filter(i => i.timeToResolve)
            .reduce((acc, i) => acc + (i.timeToResolve || 0), 0) / 
          incidents.filter(i => i.timeToResolve).length
        )
      : 0,
    trend: incidents.filter(i => {
      const date = new Date(i.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date > thirtyDaysAgo;
    }).length > 5 ? 'up' : 'down'
  };

  // Componente de Timeline
  const TimelineComponent = ({ events, incident }: { events: TimelineEvent[], incident: Incident }) => {
    const getTimelineIcon = (type: string) => {
      switch(type) {
        case 'created': return Plus;
        case 'status_change': return Activity;
        case 'assigned': return User;
        case 'comment': return MessageSquare;
        case 'resolved': return CheckCircle;
        case 'closed': return XCircle;
        default: return Info;
      }
    };

    const getTimelineColor = (type: string) => {
      switch(type) {
        case 'created': return 'bg-blue-500';
        case 'status_change': return 'bg-yellow-500';
        case 'assigned': return 'bg-purple-500';
        case 'comment': return 'bg-gray-500';
        case 'resolved': return 'bg-green-500';
        case 'closed': return 'bg-gray-400';
        default: return 'bg-gray-400';
      }
    };

    return (
      <div className="flow-root">
        <ul className="-mb-8">
          {events.filter(e => e.incidentId === incident.id).map((event, eventIdx) => {
            const Icon = getTimelineIcon(event.type);
            const isLast = eventIdx === events.filter(e => e.incidentId === incident.id).length - 1;
            
            return (
              <li key={event.id}>
                <div className="relative pb-8">
                  {!isLast && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getTimelineColor(event.type)}`}>
                        <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-900">
                          {event.description}{' '}
                          <span className="font-medium text-gray-700">por {event.user}</span>
                        </p>
                        {event.details && event.type === 'comment' && (
                          <p className="mt-1 text-sm text-gray-500">{event.details.comment}</p>
                        )}
                        {event.details && event.type === 'status_change' && (
                          <p className="mt-1 text-sm text-gray-500">
                            De <span className="font-medium">{event.details.from}</span> a{' '}
                            <span className="font-medium">{event.details.to}</span>
                          </p>
                        )}
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={event.timestamp.toISOString()}>
                          {event.timestamp.toLocaleString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Incidentes</h1>
          <p className="text-gray-600">Registra y gestiona incidentes de seguridad y operacionales</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedIncident(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Reportar Incidente
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Alertas */}
      {stats.critical > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Atención Urgente</h3>
              <p className="text-sm text-red-700 mt-1">
                Hay {stats.critical} incidente(s) crítico(s) que requieren atención inmediata
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Abiertos</dt>
                  <dd className="text-lg font-semibold text-red-600">{stats.open}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlayCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Investigando</dt>
                  <dd className="text-lg font-semibold text-yellow-600">{stats.investigating}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Resueltos</dt>
                  <dd className="text-lg font-semibold text-green-600">{stats.resolved}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Cerrados</dt>
                  <dd className="text-lg font-semibold text-gray-600">{stats.closed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Críticos</dt>
                  <dd className="text-lg font-semibold text-red-600">{stats.critical}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Res. Prom.</dt>
                  <dd className="text-lg font-semibold text-blue-600">{stats.avgResolutionTime}h</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar incidentes..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="open">Abierto</option>
            <option value="investigating">Investigando</option>
            <option value="resolved">Resuelto</option>
            <option value="closed">Cerrado</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="todos">Todas las severidades</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="todos">Todas las categorías</option>
            {incidentCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <BarChart3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Activity className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Vista de Lista */}
      {viewMode === 'list' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incidente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detectado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIncidents.map((incident) => {
                const StatusIcon = getStatusIcon(incident.status);
                const CategoryIcon = getCategoryIcon(incident.category);
                const detectionDate = new Date(incident.detectionDate);
                const hoursOpen = incident.status !== 'closed' && incident.status !== 'resolved'
                  ? Math.round((new Date().getTime() - detectionDate.getTime()) / (1000 * 60 * 60))
                  : incident.timeToResolve || 0;
                
                return (
                  <tr key={incident.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <CategoryIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{incident.title}</div>
                          <div className="text-sm text-gray-500">{incident.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                        {getSeverityIcon(incident.severity)}
                        <span className="ml-1">{incident.severity}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {getStatusLabel(incident.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{incident.assigneeName}</div>
                      <div className="text-xs text-gray-500">Reportado por {incident.reporterName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {detectionDate.toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {detectionDate.toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {hoursOpen}h
                      </div>
                      <div className="text-xs text-gray-500">
                        {incident.status === 'resolved' || incident.status === 'closed' ? 'Resuelto' : 'Abierto'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewTimeline(incident)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                        title="Ver timeline"
                      >
                        <Activity className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewDetails(incident)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIncident(incident);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(incident.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Vista de Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncidents.map((incident) => {
            const StatusIcon = getStatusIcon(incident.status);
            const CategoryIcon = getCategoryIcon(incident.category);
            const detectionDate = new Date(incident.detectionDate);
            const hoursOpen = incident.status !== 'closed' && incident.status !== 'resolved'
              ? Math.round((new Date().getTime() - detectionDate.getTime()) / (1000 * 60 * 60))
              : incident.timeToResolve || 0;
            
            return (
              <div key={incident.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <CategoryIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="font-medium text-gray-900">{incident.title}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewTimeline(incident)}
                      className="text-gray-400 hover:text-purple-600"
                    >
                      <Activity className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewDetails(incident)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIncident(incident);
                        setShowForm(true);
                      }}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{incident.description.substring(0, 100)}...</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                    {getSeverityIcon(incident.severity)}
                    <span className="ml-1">{incident.severity}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {getStatusLabel(incident.status)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Asignado:</span>
                    <span className="font-medium">{incident.assigneeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Detectado:</span>
                    <span className="font-medium">{detectionDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tiempo:</span>
                    <span className={`font-medium ${hoursOpen > 48 ? 'text-red-600' : 'text-gray-900'}`}>
                      {hoursOpen}h {incident.status === 'resolved' || incident.status === 'closed' ? '(Resuelto)' : '(Abierto)'}
                    </span>
                  </div>
                </div>
                
                {incident.tags && incident.tags.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-1">
                      {incident.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal del formulario */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header del modal */}
              <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedIncident ? 'Editar Incidente' : 'Reportar Nuevo Incidente'}
                    </h3>
                  </div>
                  <button
                    onClick={closeForm}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Contenido del formulario */}
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4 space-y-6">
                  {/* Información básica */}
                  <div className="border-b pb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Información del Incidente</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción *
                        </label>
                        <textarea
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Severidad *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.severity}
                          onChange={(e) => setFormData({...formData, severity: e.target.value as any})}
                        >
                          <option value="low">Baja</option>
                          <option value="medium">Media</option>
                          <option value="high">Alta</option>
                          <option value="critical">Crítica</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          {incidentCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reportado por *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.reporter}
                          onChange={(e) => setFormData({...formData, reporter: e.target.value})}
                        >
                          <option value="">Seleccionar</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asignado a *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.assignee}
                          onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                        >
                          <option value="">Seleccionar</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        >
                          <option value="open">Abierto</option>
                          <option value="investigating">Investigando</option>
                          <option value="resolved">Resuelto</option>
                          <option value="closed">Cerrado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pérdida estimada ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.estimatedLoss}
                          onChange={(e) => setFormData({...formData, estimatedLoss: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="border-b pb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Fechas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de detección *
                        </label>
                        <input
                          type="date"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.detectionDate}
                          onChange={(e) => setFormData({...formData, detectionDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de resolución
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.resolutionDate}
                          onChange={(e) => setFormData({...formData, resolutionDate: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Análisis */}
                  <div className="border-b pb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Análisis del Incidente</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Causa raíz
                        </label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.rootCause}
                          onChange={(e) => setFormData({...formData, rootCause: e.target.value})}
                          placeholder="¿Cuál fue la causa principal del incidente?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Acciones correctivas
                        </label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.correctiveActions}
                          onChange={(e) => setFormData({...formData, correctiveActions: e.target.value})}
                          placeholder="¿Qué acciones se tomaron para resolver el incidente?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lecciones aprendidas
                        </label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.lessonsLearned}
                          onChange={(e) => setFormData({...formData, lessonsLearned: e.target.value})}
                          placeholder="¿Qué se aprendió de este incidente?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Relaciones */}
                  <div className="border-b pb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Relaciones</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Riesgo relacionado
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={formData.relatedRisk}
                          onChange={(e) => setFormData({...formData, relatedRisk: e.target.value})}
                        >
                          <option value="">Sin riesgo asociado</option>
                          {risks.map(risk => (
                            <option key={risk.id} value={risk.id}>
                              {risk.title} ({risk.level})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sistemas impactados
                        </label>
                        <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                          {systems.map(system => (
                            <label key={system.id} className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                checked={formData.impactedSystems.includes(system.id)}
                                onChange={() => handleSystemToggle(system.id)}
                              />
                              <span className="ml-2 text-sm text-gray-700">{system.name}</span>
                            </label>
                          ))}
                          {systems.length === 0 && (
                            <p className="text-sm text-gray-500">No hay sistemas disponibles</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Etiquetas */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Etiquetas</h4>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Agregar etiqueta"
                        value={formData.tagInput}
                        onChange={(e) => setFormData({...formData, tagInput: e.target.value})}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer del modal */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t sticky bottom-0">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {selectedIncident ? 'Guardar Cambios' : 'Reportar Incidente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Timeline */}
      {showTimeline && timelineIncident && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Timeline del Incidente
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{timelineIncident.title}</p>
                  </div>
                  <button
                    onClick={() => setShowTimeline(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <TimelineComponent events={timelineEvents} incident={timelineIncident} />
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
                <button
                  onClick={() => setShowTimeline(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetails && detailIncident && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detalles del Incidente
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 space-y-6">
                {/* Header con severidad y estado */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{detailIncident.title}</h2>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(detailIncident.severity)}`}>
                      {getSeverityIcon(detailIncident.severity)}
                      <span className="ml-1">Severidad: {detailIncident.severity}</span>
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(detailIncident.status)}`}>
                      Estado: {getStatusLabel(detailIncident.status)}
                    </span>
                  </div>
                </div>

                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información General</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Categoría:</dt>
                        <dd className="font-medium">{detailIncident.category}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Reportado por:</dt>
                        <dd className="font-medium">{detailIncident.reporterName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Asignado a:</dt>
                        <dd className="font-medium">{detailIncident.assigneeName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Pérdida estimada:</dt>
                        <dd className="font-medium">${detailIncident.estimatedLoss?.toLocaleString() || 0}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tiempos</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Detectado:</dt>
                        <dd className="font-medium">{new Date(detailIncident.detectionDate).toLocaleString()}</dd>
                      </div>
                      {detailIncident.resolutionDate && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Resuelto:</dt>
                          <dd className="font-medium">{new Date(detailIncident.resolutionDate).toLocaleString()}</dd>
                        </div>
                      )}
                      {detailIncident.timeToDetect && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Tiempo de detección:</dt>
                          <dd className="font-medium">{detailIncident.timeToDetect}h</dd>
                        </div>
                      )}
                      {detailIncident.timeToResolve && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Tiempo de resolución:</dt>
                          <dd className="font-medium">{detailIncident.timeToResolve}h</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-600">{detailIncident.description}</p>
                </div>

                {/* Análisis */}
                {(detailIncident.rootCause || detailIncident.correctiveActions || detailIncident.lessonsLearned) && (
                  <div className="space-y-4">
                    {detailIncident.rootCause && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Causa Raíz</h4>
                        <p className="text-sm text-gray-600">{detailIncident.rootCause}</p>
                      </div>
                    )}
                    {detailIncident.correctiveActions && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Acciones Correctivas</h4>
                        <p className="text-sm text-gray-600">{detailIncident.correctiveActions}</p>
                      </div>
                    )}
                    {detailIncident.lessonsLearned && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Lecciones Aprendidas</h4>
                        <p className="text-sm text-gray-600">{detailIncident.lessonsLearned}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Sistemas impactados */}
                {detailIncident.impactedSystems && detailIncident.impactedSystems.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Sistemas Impactados</h4>
                    <div className="flex flex-wrap gap-2">
                      {detailIncident.impactedSystems.map((systemId) => {
                        const system = systems.find(s => s.id === systemId);
                        return system ? (
                          <span key={systemId} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                            {system.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Etiquetas */}
                {detailIncident.tags && detailIncident.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                      {detailIncident.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
                <button
                  onClick={() => handleViewTimeline(detailIncident)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Ver Timeline
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setSelectedIncident(detailIncident);
                      setShowForm(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar Incidente
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}