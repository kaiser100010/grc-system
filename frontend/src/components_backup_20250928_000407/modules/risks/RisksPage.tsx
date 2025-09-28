// src/components/modules/risks/RisksPage.tsx

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp,
  Shield,
  AlertCircle,
  X,
  Save,
  Edit2,
  Trash2,
  Eye,
  Download,
  ChevronDown,
  Activity,
  Users,
  FileText,
  Calendar
} from 'lucide-react';

// Tipos
interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  owner: string;
  ownerName?: string;
  probability: number;
  impact: number;
  score: number;
  level: string;
  priority: string;
  status: string;
  treatment: string;
  currentControls: string;
  mitigationPlan: string;
  progress: number;
  probabilityAnalysis: string;
  consequences: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

// Datos de prueba - Empleados
const mockEmployees: Employee[] = [
  { id: '1', name: 'Ana Rodríguez', email: 'ana@empresa.com', role: 'Risk Manager', department: 'Risk Management' },
  { id: '2', name: 'Carlos López', email: 'carlos@empresa.com', role: 'Compliance Officer', department: 'Compliance' },
  { id: '3', name: 'María García', email: 'maria@empresa.com', role: 'Security Lead', department: 'IT Security' },
  { id: '4', name: 'Luis Martínez', email: 'luis@empresa.com', role: 'Auditor', department: 'Internal Audit' },
  { id: '5', name: 'Carmen Silva', email: 'carmen@empresa.com', role: 'Operations Manager', department: 'Operations' }
];

// Datos de prueba - Riesgos iniciales
const initialRisks: Risk[] = [
  {
    id: '1',
    title: 'Fuga de datos sensibles',
    description: 'Riesgo de exposición de información confidencial de clientes por vulnerabilidades en sistemas',
    category: 'seguridad',
    owner: '3',
    ownerName: 'María García',
    probability: 4,
    impact: 5,
    score: 20,
    level: 'crítico',
    priority: 'crítica',
    status: 'en_tratamiento',
    treatment: 'mitigar',
    currentControls: 'Firewall, IDS/IPS, Encriptación de datos en reposo',
    mitigationPlan: 'Implementar DLP, realizar auditoría de seguridad, capacitación en seguridad',
    progress: 65,
    probabilityAnalysis: 'Alta probabilidad debido a incremento de ataques cibernéticos',
    consequences: 'Pérdida de confianza, multas regulatorias, daño reputacional',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: '2',
    title: 'Incumplimiento regulatorio GDPR',
    description: 'Riesgo de no cumplir con los requisitos de protección de datos personales',
    category: 'cumplimiento',
    owner: '2',
    ownerName: 'Carlos López',
    probability: 3,
    impact: 4,
    score: 12,
    level: 'alto',
    priority: 'alta',
    status: 'evaluado',
    treatment: 'mitigar',
    currentControls: 'Políticas de privacidad, consentimiento de usuarios',
    mitigationPlan: 'Auditoría GDPR, actualización de procesos, nombrar DPO',
    progress: 40,
    probabilityAnalysis: 'Probabilidad moderada con controles actuales',
    consequences: 'Multas hasta 4% de facturación anual, daño reputacional',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-28')
  },
  {
    id: '3',
    title: 'Interrupción del servicio cloud',
    description: 'Pérdida de disponibilidad de servicios críticos alojados en la nube',
    category: 'operacional',
    owner: '5',
    ownerName: 'Carmen Silva',
    probability: 2,
    impact: 4,
    score: 8,
    level: 'medio',
    priority: 'media',
    status: 'identificado',
    treatment: 'transferir',
    currentControls: 'SLA con proveedor, backups regulares',
    mitigationPlan: 'Plan de continuidad, multi-cloud strategy',
    progress: 25,
    probabilityAnalysis: 'Baja probabilidad con proveedores tier 1',
    consequences: 'Pérdida de productividad, impacto en clientes',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15')
  }
];

export default function RisksPage() {
  // Estados principales
  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [employees] = useState<Employee[]>(mockEmployees);
  const [showForm, setShowForm] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterLevel, setFilterLevel] = useState('todos');
  const [showDetails, setShowDetails] = useState(false);
  const [detailRisk, setDetailRisk] = useState<Risk | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'operacional',
    owner: '',
    probability: 1,
    impact: 1,
    priority: 'media',
    status: 'identificado',
    treatment: 'mitigar',
    currentControls: '',
    mitigationPlan: '',
    progress: 0,
    probabilityAnalysis: '',
    consequences: ''
  });

  // Categorías disponibles
  const categories = [
    { value: 'operacional', label: 'Operacional', color: 'blue' },
    { value: 'financiero', label: 'Financiero', color: 'green' },
    { value: 'seguridad', label: 'Seguridad', color: 'red' },
    { value: 'cumplimiento', label: 'Cumplimiento', color: 'purple' },
    { value: 'estrategico', label: 'Estratégico', color: 'yellow' },
    { value: 'reputacional', label: 'Reputacional', color: 'orange' },
    { value: 'tecnologico', label: 'Tecnológico', color: 'indigo' },
    { value: 'legal', label: 'Legal', color: 'gray' },
    { value: 'ambiental', label: 'Ambiental', color: 'teal' }
  ];

  // Efecto para cargar datos del riesgo seleccionado
  useEffect(() => {
    if (showForm && selectedRisk) {
      setFormData({
        title: selectedRisk.title,
        description: selectedRisk.description,
        category: selectedRisk.category,
        owner: selectedRisk.owner,
        probability: selectedRisk.probability,
        impact: selectedRisk.impact,
        priority: selectedRisk.priority,
        status: selectedRisk.status,
        treatment: selectedRisk.treatment,
        currentControls: selectedRisk.currentControls || '',
        mitigationPlan: selectedRisk.mitigationPlan || '',
        progress: selectedRisk.progress || 0,
        probabilityAnalysis: selectedRisk.probabilityAnalysis || '',
        consequences: selectedRisk.consequences || ''
      });
    } else if (showForm && !selectedRisk) {
      // Reset para nuevo riesgo
      setFormData({
        title: '',
        description: '',
        category: 'operacional',
        owner: employees.length > 0 ? employees[0].id : '',
        probability: 1,
        impact: 1,
        priority: 'media',
        status: 'identificado',
        treatment: 'mitigar',
        currentControls: '',
        mitigationPlan: '',
        progress: 0,
        probabilityAnalysis: '',
        consequences: ''
      });
    }
  }, [showForm, selectedRisk, employees]);

  // Funciones de cálculo
  const calculateRiskScore = (probability: number, impact: number) => probability * impact;
  
  const getRiskLevel = (score: number): string => {
    if (score <= 4) return 'bajo';
    if (score <= 9) return 'medio';
    if (score <= 15) return 'alto';
    return 'crítico';
  };

  const getRiskLevelColor = (level: string) => {
    switch(level) {
      case 'bajo': return 'text-green-600 bg-green-100';
      case 'medio': return 'text-yellow-600 bg-yellow-100';
      case 'alto': return 'text-orange-600 bg-orange-100';
      case 'crítico': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelBgColor = (level: string) => {
    switch(level) {
      case 'bajo': return 'bg-green-500';
      case 'medio': return 'bg-yellow-500';
      case 'alto': return 'bg-orange-500';
      case 'crítico': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Funciones CRUD
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const score = calculateRiskScore(formData.probability, formData.impact);
    const level = getRiskLevel(score);
    const ownerName = employees.find(emp => emp.id === formData.owner)?.name || '';
    
    if (selectedRisk) {
      // Editar
      const updatedRisk: Risk = {
        ...selectedRisk,
        ...formData,
        score,
        level,
        ownerName,
        updatedAt: new Date()
      };
      setRisks(risks.map(r => r.id === selectedRisk.id ? updatedRisk : r));
    } else {
      // Crear
      const newRisk: Risk = {
        id: Date.now().toString(),
        ...formData,
        score,
        level,
        ownerName,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setRisks([...risks, newRisk]);
    }
    
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este riesgo?')) {
      setRisks(risks.filter(r => r.id !== id));
    }
  };

  const handleViewDetails = (risk: Risk) => {
    setDetailRisk(risk);
    setShowDetails(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedRisk(null);
    setFormData({
      title: '',
      description: '',
      category: 'operacional',
      owner: '',
      probability: 1,
      impact: 1,
      priority: 'media',
      status: 'identificado',
      treatment: 'mitigar',
      currentControls: '',
      mitigationPlan: '',
      progress: 0,
      probabilityAnalysis: '',
      consequences: ''
    });
  };

  // Filtros
  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todos' || risk.category === filterCategory;
    const matchesLevel = filterLevel === 'todos' || risk.level === filterLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Estadísticas
  const stats = {
    total: risks.length,
    critical: risks.filter(r => r.level === 'crítico').length,
    high: risks.filter(r => r.level === 'alto').length,
    medium: risks.filter(r => r.level === 'medio').length,
    low: risks.filter(r => r.level === 'bajo').length,
    avgScore: risks.length > 0 ? (risks.reduce((acc, r) => acc + r.score, 0) / risks.length).toFixed(1) : 0
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Riesgos</h1>
          <p className="text-gray-600">Identifica, evalúa y mitiga los riesgos organizacionales</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedRisk(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Riesgo
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-gray-400" />
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
                <div className="h-6 w-6 rounded-full bg-red-500" />
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
                <div className="h-6 w-6 rounded-full bg-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Altos</dt>
                  <dd className="text-lg font-semibold text-orange-600">{stats.high}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Medios</dt>
                  <dd className="text-lg font-semibold text-yellow-600">{stats.medium}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Bajos</dt>
                  <dd className="text-lg font-semibold text-green-600">{stats.low}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Score Prom.</dt>
                  <dd className="text-lg font-semibold text-blue-600">{stats.avgScore}</dd>
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
                placeholder="Buscar riesgos..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="todos">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="todos">Todos los niveles</option>
            <option value="crítico">Crítico</option>
            <option value="alto">Alto</option>
            <option value="medio">Medio</option>
            <option value="bajo">Bajo</option>
          </select>
        </div>
      </div>

      {/* Tabla de riesgos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Riesgo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nivel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRisks.map((risk) => (
              <tr key={risk.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{risk.title}</div>
                  <div className="text-sm text-gray-500">{risk.description.substring(0, 60)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {categories.find(c => c.value === risk.category)?.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {risk.ownerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(risk.level)}`}>
                    {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{risk.score}</span>
                    <span className="text-xs text-gray-500 ml-1">({risk.probability}x{risk.impact})</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {risk.status.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getRiskLevelBgColor(risk.level)}`}
                      style={{ width: `${risk.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{risk.progress}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(risk)}
                    className="text-gray-600 hover:text-gray-900 mr-3"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRisk(risk);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(risk.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header del modal */}
              <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedRisk ? 'Editar Riesgo' : 'Nuevo Riesgo'}
                    </h3>
                    {selectedRisk && (
                      <p className="text-sm text-gray-500">Editando: {selectedRisk.title}</p>
                    )}
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
                    <h4 className="text-md font-medium text-gray-900 mb-4">Información Básica</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título del Riesgo *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción *
                        </label>
                        <textarea
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Responsable *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.owner}
                          onChange={(e) => setFormData({...formData, owner: e.target.value})}
                        >
                          <option value="">Seleccionar responsable</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name} - {emp.role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                          <option value="identificado">Identificado</option>
                          <option value="evaluado">Evaluado</option>
                          <option value="en_tratamiento">En Tratamiento</option>
                          <option value="mitigado">Mitigado</option>
                          <option value="cerrado">Cerrado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Evaluación del riesgo */}
                  <div className="border-b pb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Evaluación del Riesgo</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Probabilidad (1-5)
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.probability}
                          onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})}
                        >
                          <option value="1">1 - Muy Baja</option>
                          <option value="2">2 - Baja</option>
                          <option value="3">3 - Media</option>
                          <option value="4">4 - Alta</option>
                          <option value="5">5 - Muy Alta</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Impacto (1-5)
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.impact}
                          onChange={(e) => setFormData({...formData, impact: parseInt(e.target.value)})}
                        >
                          <option value="1">1 - Muy Bajo</option>
                          <option value="2">2 - Bajo</option>
                          <option value="3">3 - Medio</option>
                          <option value="4">4 - Alto</option>
                          <option value="5">5 - Muy Alto</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nivel de Riesgo
                        </label>
                        <div className={`px-3 py-2 rounded-md border text-center font-medium ${getRiskLevelColor(getRiskLevel(calculateRiskScore(formData.probability, formData.impact)))}`}>
                          <div className="text-lg">
                            {getRiskLevel(calculateRiskScore(formData.probability, formData.impact)).toUpperCase()}
                          </div>
                          <div className="text-sm">
                            Score: {calculateRiskScore(formData.probability, formData.impact)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Análisis de Probabilidad
                        </label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.probabilityAnalysis}
                          onChange={(e) => setFormData({...formData, probabilityAnalysis: e.target.value})}
                          placeholder="¿Por qué esta probabilidad?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Consecuencias Potenciales
                        </label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.consequences}
                          onChange={(e) => setFormData({...formData, consequences: e.target.value})}
                          placeholder="¿Qué podría pasar?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tratamiento */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Tratamiento del Riesgo</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Tratamiento
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.treatment}
                          onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                        >
                          <option value="aceptar">Aceptar</option>
                          <option value="mitigar">Mitigar</option>
                          <option value="transferir">Transferir</option>
                          <option value="evitar">Evitar</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prioridad
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        >
                          <option value="baja">Baja</option>
                          <option value="media">Media</option>
                          <option value="alta">Alta</option>
                          <option value="crítica">Crítica</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Controles Actuales
                        </label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.currentControls}
                          onChange={(e) => setFormData({...formData, currentControls: e.target.value})}
                          placeholder="Describe los controles existentes"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plan de Mitigación
                        </label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.mitigationPlan}
                          onChange={(e) => setFormData({...formData, mitigationPlan: e.target.value})}
                          placeholder="Acciones para reducir el riesgo"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Progreso del Tratamiento: {formData.progress}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          className="w-full"
                          value={formData.progress}
                          onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>
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
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {selectedRisk ? 'Guardar Cambios' : 'Crear Riesgo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetails && detailRisk && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detalles del Riesgo
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
                {/* Header con nivel de riesgo */}
                <div className={`rounded-lg p-4 ${getRiskLevelColor(detailRisk.level)}`}>
                  <h2 className="text-xl font-bold">{detailRisk.title}</h2>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="font-medium">Nivel: {detailRisk.level.toUpperCase()}</span>
                    <span>Score: {detailRisk.score} ({detailRisk.probability}x{detailRisk.impact})</span>
                  </div>
                </div>

                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información General</h4>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Categoría:</dt>
                        <dd className="font-medium">{categories.find(c => c.value === detailRisk.category)?.label}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Responsable:</dt>
                        <dd className="font-medium">{detailRisk.ownerName}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Estado:</dt>
                        <dd className="font-medium">{detailRisk.status.replace('_', ' ')}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Prioridad:</dt>
                        <dd className="font-medium">{detailRisk.priority}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Fechas</h4>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Creado:</dt>
                        <dd className="font-medium">{new Date(detailRisk.createdAt).toLocaleDateString()}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Actualizado:</dt>
                        <dd className="font-medium">{new Date(detailRisk.updatedAt).toLocaleDateString()}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-600">{detailRisk.description}</p>
                </div>

                {/* Análisis */}
                {(detailRisk.probabilityAnalysis || detailRisk.consequences) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {detailRisk.probabilityAnalysis && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Análisis de Probabilidad</h4>
                        <p className="text-sm text-gray-600">{detailRisk.probabilityAnalysis}</p>
                      </div>
                    )}
                    {detailRisk.consequences && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Consecuencias</h4>
                        <p className="text-sm text-gray-600">{detailRisk.consequences}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tratamiento */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tratamiento</h4>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-500">Tipo de tratamiento:</dt>
                      <dd className="font-medium">{detailRisk.treatment}</dd>
                    </div>
                    {detailRisk.currentControls && (
                      <div>
                        <dt className="text-gray-500">Controles actuales:</dt>
                        <dd className="mt-1">{detailRisk.currentControls}</dd>
                      </div>
                    )}
                    {detailRisk.mitigationPlan && (
                      <div>
                        <dt className="text-gray-500">Plan de mitigación:</dt>
                        <dd className="mt-1">{detailRisk.mitigationPlan}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-gray-500 mb-1">Progreso del tratamiento:</dt>
                      <dd>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getRiskLevelBgColor(detailRisk.level)}`}
                            style={{ width: `${detailRisk.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{detailRisk.progress}%</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedRisk(detailRisk);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar Riesgo
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
      )}
    </div>
  );
}