// frontend/src/components/modules/resources/employees/EmployeeList.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { employeeService } from '../../../../services/api/resources';
import { EmployeeForm } from './EmployeeForm';
import type { Employee, GetEmployeesParams } from '../../../../types/resource.types';

export const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const departments = [
    'IT',
    'Finance',
    'Human Resources',
    'Operations',
    'Sales',
    'Marketing',
    'Legal',
    'Customer Service',
    'Research & Development',
    'Administration'
  ];

  const statuses = [
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'gray' },
    { value: 'on_leave', label: 'On Leave', color: 'yellow' },
    { value: 'terminated', label: 'Terminated', color: 'red' }
  ];

  useEffect(() => {
    loadEmployees();
  }, [currentPage, searchTerm, selectedDepartment, selectedStatus]);

  const loadEmployees = async (showToast = false) => {
    setIsLoading(true);
    
    try {
      const params: GetEmployeesParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        department: selectedDepartment || undefined,
        status: selectedStatus || undefined
      };
      
      const response = await employeeService.getEmployees(params);
      setEmployees(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
      
      if (showToast) {
        toast.success('Employees list refreshed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load employees';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadEmployees(true);
  };

  const handleDelete = async (id: string) => {
    const employeeToDelete = employees.find(e => e.id === id);
    setIsDeleting(true);
    
    try {
      await employeeService.deleteEmployee(id);
      setShowDeleteConfirm(null);
      toast.success(`Employee ${employeeToDelete?.firstName} ${employeeToDelete?.lastName} deleted successfully`);
      loadEmployees();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete employee';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) {
      toast.error('No employees selected');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedEmployees.length} employees?`)) {
      return;
    }

    const deletePromises = selectedEmployees.map(id => employeeService.deleteEmployee(id));
    
    toast.promise(
      Promise.all(deletePromises),
      {
        loading: `Deleting ${selectedEmployees.length} employees...`,
        success: () => {
          setSelectedEmployees([]);
          loadEmployees();
          return `Successfully deleted ${selectedEmployees.length} employees`;
        },
        error: 'Failed to delete some employees'
      }
    );
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEmployee(null);
    loadEmployees();
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleExport = async () => {
    const exportToast = toast.loading('Preparing export...');
    
    try {
      const allEmployees = await employeeService.getEmployees({ limit: 1000 });
      const csv = convertToCSV(allEmployees.data);
      downloadCSV(csv, 'employees.csv');
      toast.success('Employees exported successfully', { id: exportToast });
    } catch (err: any) {
      toast.error('Failed to export employees', { id: exportToast });
    }
  };

  const convertToCSV = (data: Employee[]) => {
    const headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Department', 'Position', 'Status', 'Location', 'Start Date'];
    const rows = data.map(emp => [
      emp.employeeId,
      emp.firstName,
      emp.lastName,
      emp.email,
      emp.department,
      emp.position,
      emp.status,
      emp.location,
      emp.startDate
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    const statusConfig = statuses.find(s => s.value === status);
    const color = statusConfig?.color || 'gray';
    
    return {
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800'
    }[color];
  };

  const getStatusLabel = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) 
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(emp => emp.id));
    }
  };

  // Calculate stats
  const activeCount = employees.filter(e => e.status === 'active').length;
  const onLeaveCount = employees.filter(e => e.status === 'on_leave').length;
  const departmentCount = new Set(employees.map(e => e.department)).size;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600 mt-1">Manage your organization's employees</p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedEmployees.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedEmployees.length})
              </button>
            )}
            <button
              onClick={handleRefresh}
              className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600">{onLeaveCount}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departmentCount}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === employees.length && employees.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    style={{ 
                      accentColor: '#3b82f6',
                      cursor: 'pointer'
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                    <p className="mt-2 text-gray-500">Loading employees...</p>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || selectedDepartment || selectedStatus 
                      ? 'No employees found matching your filters'
                      : 'No employees found. Click "Add Employee" to create one.'}
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => toggleEmployeeSelection(employee.id)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        style={{ 
                          accentColor: '#3b82f6',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                        <div className="text-xs text-gray-400">ID: {employee.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {employee.location}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                        {getStatusLabel(employee.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/resources/employees/${employee.id}`)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingEmployee(employee);
                            setShowForm(true);
                          }}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(employee.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};