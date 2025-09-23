import axios from 'axios';
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeFilters, EmployeeResponse } from '../types/employee.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class EmployeeService {
  async getEmployees(filters: EmployeeFilters = {}): Promise<EmployeeResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/employees?${params.toString()}`);
    return response.data.data;
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const response = await api.get(`/employees/${id}`);
    return response.data.data.employee;
  }

  async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    const response = await api.post('/employees', data);
    return response.data.data.employee;
  }

  async updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<Employee> {
    const response = await api.put(`/employees/${id}`, data);
    return response.data.data.employee;
  }

  async deleteEmployee(id: string): Promise<void> {
    await api.delete(`/employees/${id}`);
  }
}

export const employeeService = new EmployeeService();