// frontend/src/services/api/resources.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Tipos para Empleados
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  location: string;
  startDate: string;
  endDate?: string;
  managerId?: string;
  status: string;
  skills: string[];
  clearanceLevel?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  location: string;
  startDate: string;
  endDate?: string;
  managerId?: string;
  status: string;
  skills: string[];
  clearanceLevel?: string;
  notes?: string;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {}

export interface GetEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Servicio de Empleados
export const employeeService = {
  async getEmployees(params?: GetEmployeesParams): Promise<PaginatedResponse<Employee>> {
    try {
      const response = await axios.get(`${API_URL}/employees`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Retornar datos mock para desarrollo
      return {
        data: [
          {
            id: '1',
            employeeId: 'EMP001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            phone: '+1 555-0100',
            position: 'Senior Developer',
            department: 'IT',
            location: 'New York, USA',
            startDate: '2023-01-15',
            status: 'active',
            skills: ['JavaScript', 'React', 'Node.js'],
            clearanceLevel: 'CONFIDENTIAL',
            notes: 'Team lead for Project X',
            createdAt: '2023-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          },
          {
            id: '2',
            employeeId: 'EMP002',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@company.com',
            phone: '+1 555-0101',
            position: 'Product Manager',
            department: 'Operations',
            location: 'San Francisco, USA',
            startDate: '2022-06-01',
            status: 'active',
            skills: ['Product Strategy', 'Agile', 'Data Analysis'],
            clearanceLevel: 'SECRET',
            createdAt: '2022-06-01T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          }
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      };
    }
  },

  async getEmployee(id: string): Promise<Employee> {
    try {
      const response = await axios.get(`${API_URL}/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      // Retornar datos mock para desarrollo
      return {
        id: '1',
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1 555-0100',
        position: 'Senior Developer',
        department: 'IT',
        location: 'New York, USA',
        startDate: '2023-01-15',
        status: 'active',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
        clearanceLevel: 'CONFIDENTIAL',
        notes: 'Team lead for Project X. Excellent performance reviews.',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      };
    }
  },

  async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    try {
      const response = await axios.post(`${API_URL}/employees`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<Employee> {
    try {
      const response = await axios.put(`${API_URL}/employees/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/employees/${id}`);
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }
};