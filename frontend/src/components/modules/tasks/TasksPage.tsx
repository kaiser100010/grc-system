// src/components/modules/tasks/TasksPage.tsx

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Flag,
  Tag,
  Paperclip,
  MessageSquare,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  TrendingUp,
  BarChart3,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Columns,
  List
} from 'lucide-react';
import useAppStore from '../../../store/appStore';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeName?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  relatedRisk?: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  attachments?: number;
  comments?: number;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

const taskCategories = [
  { value: 'Auditoría', label: 'Auditoría', color: 'purple' },
  { value: 'Compliance', label: 'Compliance', color: 'blue' },
  { value: 'Riesgos', label: 'Gestión de Riesgos', color: 'red' },
  { value: 'Controles', label: 'Controles', color: 'green' },
  { value: 'Políticas', label: 'Políticas', color: 'yellow' },
  { value: 'Incidentes', label: 'Incidentes', color: 'orange' },
  { value: 'Formación', label: 'Formación', color: 'indigo' },
  { value: 'Otros', label: 'Otros', color: 'gray' }
];

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, employees, risks } = useAppStore();
  
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterPriority, setFilterPriority] = useState('todos');
  const [filterAssignee, setFilterAssignee] = useState('todos');
  const [filterCategory, setFilterCategory] = useState('todos');
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium' as const,
    status: 'pending' as const,
    category: 'Otros',
    relatedRisk: '',
    progress: 0,
    estimatedHours: 0,
    tags: [] as string[],
    tagInput: ''
  });

  // Cargar datos cuando se selecciona una tarea para editar
  useEffect(() => {
    if (showForm && selectedTask) {
      setFormData({
        title: selectedTask.title,
        description: selectedTask.description,
        assignee: selectedTask.assignee,
        dueDate: new Date(selectedTask.dueDate).toISOString().split('T')[0],
        priority: selectedTask.priority,
        status: selectedTask.status,
        category: selectedTask.category,
        relatedRisk: selectedTask.relatedRisk || '',
        progress: selectedTask.progress,
        estimatedHours: selectedTask.estimatedHours || 0,
        tags: selectedTask.tags || [],
        tagInput: ''
      });
    } else if (showForm && !selectedTask) {
      // Reset para nueva tarea
      setFormData({
        title: '',
        description: '',
        assignee: employees.length > 0 ? employees[0].id : '',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'pending',
        category: 'Otros',
        relatedRisk: '',
        progress: 0,
        estimatedHours: 0,
        tags: [],
        tagInput: ''
      });
    }
  }, [showForm, selectedTask, employees]);

  // Funciones de utilidad
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'critical': return <ArrowUp className="h-3 w-3" />;
      case 'high': return <ArrowUp className="h-3 w-3" />;
      case 'medium': return <ArrowRight className="h-3 w-3" />;
      case 'low': return <ArrowDown className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return PlayCircle;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'completed': return 'Completada';
      case 'in_progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  // CRUD Functions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assigneeName = employees.find(emp => emp.id === formData.assignee)?.name || '';
    
    if (selectedTask) {
      // Editar
      const updatedTask: Task = {
        ...selectedTask,
        ...formData,
        assigneeName,
        dueDate: new Date(formData.dueDate),
        updatedAt: new Date()
      };
      updateTask(selectedTask.id, updatedTask);
    } else {
      // Crear
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        assigneeName,
        dueDate: new Date(formData.dueDate),
        attachments: 0,
        comments: 0,
        actualHours: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addTask(newTask);
    }
    
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      deleteTask(id);
    }
  };

  const handleViewDetails = (task: Task) => {
    setDetailTask(task);
    setShowDetails(true);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { 
        ...task, 
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : task.progress,
        updatedAt: new Date()
      });
    }
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

  const closeForm = () => {
    setShowForm(false);
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      category: 'Otros',
      relatedRisk: '',
      progress: 0,
      estimatedHours: 0,
      tags: [],
      tagInput: ''
    });
  };

  // Filtros
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'todos' || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'todos' || task.assignee === filterAssignee;
    const matchesCategory = filterCategory === 'todos' || task.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesCategory;
  });

  // Agrupar tareas por estado para vista Kanban
  const tasksByStatus = {
    pending: filteredTasks.filter(t => t.status === 'pending'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    cancelled: filteredTasks.filter(t => t.status === 'cancelled')
  };

  // Estadísticas
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return t.status !== 'completed' && dueDate < new Date();
    }).length,
    completionRate: tasks.length > 0 
      ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
      : 0
  };

  // Componente de tarjeta de tarea para Kanban
  const TaskCard = ({ task }: { task: Task }) => {
    const dueDate = new Date(task.dueDate);
    const isOverdue = task.status !== 'completed' && dueDate < new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTask(task);
                setShowForm(true);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <Edit2 className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(task.id);
              }}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {getPriorityIcon(task.priority)}
            <span className="ml-1">{task.priority}</span>
          </span>
          <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {isOverdue ? `Vencida hace ${Math.abs(daysUntilDue)}d` : 
             daysUntilDue === 0 ? 'Vence hoy' :
             daysUntilDue > 0 ? `En ${daysUntilDue}d` : ''}
          </span>
        </div>
        
        {task.progress > 0 && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progreso</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>{task.assigneeName}</span>
          </div>
          <div className="flex items-center gap-2">
            {task.attachments && task.attachments > 0 && (
              <span className="flex items-center">
                <Paperclip className="h-3 w-3 mr-0.5" />
                {task.attachments}
              </span>
            )}
            {task.comments && task.comments > 0 && (
              <span className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-0.5" />
                {task.comments}
              </span>
            )}
          </div>
        </div>
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Tareas</h1>
          <p className="text-gray-600">Administra y realiza seguimiento de las tareas del equipo</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedTask(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckSquare className="h-6 w-6 text-gray-400" />
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
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completadas</dt>
                  <dd className="text-lg font-semibold text-green-600">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlayCircle className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">En Progreso</dt>
                  <dd className="text-lg font-semibold text-blue-600">{stats.inProgress}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                  <dd className="text-lg font-semibold text-gray-600">{stats.pending}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Vencidas</dt>
                  <dd className="text-lg font-semibold text-red-600">{stats.overdue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completación</dt>
                  <dd className="text-lg font-semibold text-purple-600">{stats.completionRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y vista */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="todos">Todas las prioridades</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
          >
            <option value="todos">Todos los asignados</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="todos">Todas las categorías</option>
            {taskCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Vista Kanban"
            >
              <Columns className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Vista Lista"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Vista Kanban */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Columna Pendiente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                Pendiente
              </h3>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                {tasksByStatus.pending.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.pending.map(task => (
                <div key={task.id} onClick={() => handleViewDetails(task)}>
                  <TaskCard task={task} />
                </div>
              ))}
              {tasksByStatus.pending.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No hay tareas pendientes</p>
              )}
            </div>
          </div>

          {/* Columna En Progreso */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <PlayCircle className="h-4 w-4 mr-2 text-blue-500" />
                En Progreso
              </h3>
              <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {tasksByStatus.in_progress.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.in_progress.map(task => (
                <div key={task.id} onClick={() => handleViewDetails(task)}>
                  <TaskCard task={task} />
                </div>
              ))}
              {tasksByStatus.in_progress.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No hay tareas en progreso</p>
              )}
            </div>
          </div>

          {/* Columna Completada */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Completada
              </h3>
              <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                {tasksByStatus.completed.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.completed.map(task => (
                <div key={task.id} onClick={() => handleViewDetails(task)}>
                  <TaskCard task={task} />
                </div>
              ))}
              {tasksByStatus.completed.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No hay tareas completadas</p>
              )}
            </div>
          </div>

          {/* Columna Cancelada */}
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                Cancelada
              </h3>
              <span className="bg-red-200 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                {tasksByStatus.cancelled.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.cancelled.map(task => (
                <div key={task.id} onClick={() => handleViewDetails(task)}>
                  <TaskCard task={task} />
                </div>
              ))}
              {tasksByStatus.cancelled.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No hay tareas canceladas</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vista Lista */}
      {viewMode === 'list' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarea
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Límite
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
              {filteredTasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status);
                const dueDate = new Date(task.dueDate);
                const isOverdue = task.status !== 'completed' && dueDate < new Date();
                
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{task.assigneeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)}
                        <span className="ml-1">{task.priority}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {getStatusLabel(task.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {dueDate.toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 max-w-[100px]">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(task)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 hover:text-red-900"
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

      {/* Modal del formulario */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header del modal */}
              <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckSquare className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedTask ? 'Editar Tarea' : 'Nueva Tarea'}
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
                    <h4 className="text-md font-medium text-gray-900 mb-4">Información Básica</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asignado a *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.assignee}
                          onChange={(e) => setFormData({...formData, assignee: e.target.value})}
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
                          Fecha límite *
                        </label>
                        <input
                          type="date"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          {taskCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prioridad
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        >
                          <option value="low">Baja</option>
                          <option value="medium">Media</option>
                          <option value="high">Alta</option>
                          <option value="critical">Crítica</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Estado y Progreso */}
                  <div className="border-b pb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Estado y Progreso</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="in_progress">En Progreso</option>
                          <option value="completed">Completada</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Horas estimadas
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.estimatedHours}
                          onChange={(e) => setFormData({...formData, estimatedHours: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Progreso: {formData.progress}%
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

                  {/* Vinculaciones */}
                  <div className="border-b pb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Vinculaciones</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Riesgo relacionado
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    </div>
                  </div>

                  {/* Etiquetas */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Etiquetas</h4>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {selectedTask ? 'Guardar Cambios' : 'Crear Tarea'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetails && detailTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detalles de la Tarea
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
                {/* Header con estado */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{detailTask.title}</h2>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(detailTask.status)}`}>
                      {getStatusLabel(detailTask.status)}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(detailTask.priority)}`}>
                      Prioridad: {detailTask.priority}
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-600">{detailTask.description || 'Sin descripción'}</p>
                </div>

                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Asignado a:</dt>
                        <dd className="font-medium">{detailTask.assigneeName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Categoría:</dt>
                        <dd className="font-medium">{detailTask.category}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Fecha límite:</dt>
                        <dd className="font-medium">{new Date(detailTask.dueDate).toLocaleDateString()}</dd>
                      </div>
                      {detailTask.estimatedHours && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Horas estimadas:</dt>
                          <dd className="font-medium">{detailTask.estimatedHours}h</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Progreso</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-500">Completado</span>
                          <span className="text-lg font-bold text-blue-600">{detailTask.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full"
                            style={{ width: `${detailTask.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Etiquetas */}
                {detailTask.tags && detailTask.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                      {detailTask.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cambiar estado */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cambiar Estado</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleStatusChange(detailTask.id, 'pending');
                        setShowDetails(false);
                      }}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        detailTask.status === 'pending' 
                          ? 'bg-gray-200 text-gray-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Pendiente
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(detailTask.id, 'in_progress');
                        setShowDetails(false);
                      }}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        detailTask.status === 'in_progress' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                      }`}
                    >
                      En Progreso
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(detailTask.id, 'completed');
                        setShowDetails(false);
                      }}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        detailTask.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      Completada
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(detailTask.id, 'cancelled');
                        setShowDetails(false);
                      }}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        detailTask.status === 'cancelled' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                      }`}
                    >
                      Cancelada
                    </button>
                  </div>
                </div>

                {/* Fechas */}
                <div className="border-t pt-4">
                  <dl className="text-sm text-gray-500">
                    <div className="flex justify-between">
                      <dt>Creada:</dt>
                      <dd>{new Date(detailTask.createdAt).toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Última actualización:</dt>
                      <dd>{new Date(detailTask.updatedAt).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedTask(detailTask);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar Tarea
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