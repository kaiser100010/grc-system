// ARCHIVO: frontend/src/services/employee.service.ts
// Servicio de empleados corregido para trabajar con el backend actual

import axios from 'axios';
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeFilters, EmployeeResponse } from '../types/employee.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const employeeService = {
  // Obtener todos los empleados - USANDO LA RUTA CORRECTA
  async getAll(filters?: EmployeeFilters): Promise<EmployeeResponse> {
    try {
      // Primero intenta con /resources/employees que es la que funciona
      const { data } = await api.get('/resources/employees', { params: filters });
      return data;
    } catch (error) {
      // Si falla, intenta con /api/employees
      try {
        const { data } = await api.get('/api/employees', { params: filters });
        return data;
      } catch (fallbackError) {
        console.error('Error fetching employees:', fallbackError);
        throw fallbackError;
      }
    }
  },

  // Obtener un empleado por ID
  async getById(id: string): Promise<Employee> {
    const { data } = await api.get(`/api/employees/${id}`);
    return data.data || data;
  },

  // Crear nuevo empleado
  async create(employee: CreateEmployeeRequest): Promise<Employee> {
    const { data } = await api.post('/api/employees', employee);
    return data.data || data;
  },

  // Actualizar empleado
  async update(id: string, employee: UpdateEmployeeRequest): Promise<Employee> {
    const { data } = await api.put(`/api/employees/${id}`, employee);
    return data.data || data;
  },

  // Eliminar empleado
  async delete(id: string): Promise<void> {
    await api.delete(`/api/employees/${id}`);
  },

  // Búsqueda de empleados
  async search(query: string): Promise<Employee[]> {
    const { data } = await api.get('/api/employees/search', {
      params: { q: query }
    });
    return data.data || data;
  },

  // Exportar empleados
  async export(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const { data } = await api.get('/api/employees/export', {
      params: { format },
      responseType: 'blob'
    });
    return data;
  },

  // Importar empleados
  async import(file: File): Promise<{ success: boolean; imported: number; errors?: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await api.post('/api/employees/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  }
};

export default employeeService;