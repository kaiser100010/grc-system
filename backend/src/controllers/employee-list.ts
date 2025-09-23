import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Mail, Phone, Building } from 'lucide-react';
import DataTable from '../../common/DataTable/DataTable';
import { Employee, EmployeeStatus, Department } from '../../../types/resource.types';
import { useApi } from '../../../hooks/useApi';
import { useNotifications } from '../../../hooks/useNotifications';

interface EmployeeListProps {
  onEditEmployee?: (employee: Employee) => void;
  onViewEmployee?: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
  onEditEmployee, 
  onViewEmployee 
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { get, delete: deleteApi } = useApi();
  const { showNotification } = useNotifications();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await get('/api/resources/employees');
      setEmployees(response.data);
    } catch (error) {
      showNotification('Error al cargar empleados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      return;
    }

    try {
      await deleteApi(`/api/resources/employees/${employeeId}`);
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      showNotification('Empleado eliminado correctamente', 'success');
    } catch (error) {
      showNotification('Error al eliminar empleado', 'error');
    }
  };

  const getStatusBadge = (status: EmployeeStatus) => {
    const badges = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      ON_LEAVE: 'bg-yellow-100 text-yellow-800',
      TERMINATED: 'bg-red-100 text-red-800'
    };

    const labels = {
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      ON_LEAVE: 'En licencia',
      TERMINATED: 'Terminado'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getDepartmentBadge = (department: Department) => {
    const colors = {
      IT: 'bg-blue-100 text-blue-800',
      HR: 'bg-purple-100 text-purple-800',
      FINANCE: 'bg-green-100 text-green-800',
      OPERATIONS: 'bg-orange-100 text-orange-800',
      LEGAL: 'bg-gray-100 text-gray-800',
      SECURITY: 'bg-red-100 text-red-800',
      COMPLIANCE: 'bg-indigo-100 text-indigo-800'
    };

    const labels = {
      IT: 'TI',
      HR: 'RRHH',
      FINANCE: 'Finanzas',
      OPERATIONS: 'Operaciones',
      LEGAL: 'Legal',
      SECURITY: 'Seguridad',
      COMPLIANCE: 'Compliance'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[department]}`}>
        {labels[department]}
      </span>
    );
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const columns = [
    {
      header: 'Empleado',
      accessor: 'employee',
      render: (employee: Employee) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {employee.firstName} {employee.lastName}
            </div>
            <div className="text-sm text-gray-500">ID: {employee.employeeId}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Contacto',
      accessor: 'contact',
      render: (employee: Employee) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-900">
            <Mail className="w-4 h-4 mr-1 text-gray-400" />
            {employee.email}
          </div>
          {employee.phone && (
            <div className="flex items-center text-sm text-gray-500">
              <Phone className="w-4 h-4 mr-1 text-gray-400" />
              {employee.phone}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Departamento',
      accessor: 'department',
      render: (employee: Employee) => (
        <div className="space-y-1">
          {getDepartmentBadge(employee.department)}
          <div className="text-sm text-gray-500 flex items-center">
            <Building className="w-4 h-4 mr-1" />
            {employee.location}
          </div>
        </div>
      )
    },
    {
      header: 'Cargo',
      accessor: 'position',
      render: (employee: Employee) => (
        <div>
          <div className="font-medium text-gray-900">{employee.position}</div>
          {employee.manager && (
            <div className="text-sm text-gray-500">
              Reporta a: {employee.manager.firstName} {employee.manager.lastName}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: 'status',
      render: (employee: Employee) => getStatusBadge(employee.status)
    },
    {
      header: 'Fecha de Ingreso',
      accessor: 'startDate',
      render: (employee: Employee) => (
        <div className="text-sm text-gray-900">
          {new Date(employee.startDate).toLocaleDateString('es-ES')}
        </div>
      )
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      render: (employee: Employee) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewEmployee?.(employee)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEditEmployee?.(employee)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteEmployee(employee.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empleados</h1>
          <p className="text-gray-600">
            Gestiona la información de los empleados de la organización
          </p>
        </div>
        <button
          onClick={() => onEditEmployee?.(null)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Empleado
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o ID de empleado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Toggle Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 rounded-lg border transition-colors ${
              showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </button>
        </div>

        {/* Filtros expandidos */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as EmployeeStatus | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="ON_LEAVE">En licencia</option>
                <option value="TERMINATED">Terminado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value as Department | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los departamentos</option>
                <option value="IT">TI</option>
                <option value="HR">RRHH</option>
                <option value="FINANCE">Finanzas</option>
                <option value="OPERATIONS">Operaciones</option>
                <option value="LEGAL">Legal</option>
                <option value="SECURITY">Seguridad</option>
                <option value="COMPLIANCE">Compliance</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-lg font-semibold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-lg font-semibold text-gray-900">
                {employees.filter(emp => emp.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">En Licencia</p>
              <p className="text-lg font-semibold text-gray-900">
                {employees.filter(emp => emp.status === 'ON_LEAVE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="text-lg font-semibold text-gray-900">
                {employees.filter(emp => emp.status === 'INACTIVE').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de empleados */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          data={filteredEmployees}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron empleados"
        />
      </div>
    </div>
  );
};

export default EmployeeList;