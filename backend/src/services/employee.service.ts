// src/services/employee.service.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface BackendEmployee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  position?: string;
  manager?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  startDate?: string | Date;
  endDate?: string | Date;
  createdAt: string;
  updatedAt: string;
}

class EmployeeService {
  async getAll(): Promise<{
    success: boolean;
    data?: BackendEmployee[];
    error?: string;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching employees:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión'
      };
    }
  }

  async getById(id: string): Promise<BackendEmployee | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      return null;
    }
  }

  async create(employee: Partial<BackendEmployee>): Promise<BackendEmployee | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/employees`, employee);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      return null;
    }
  }

  async update(id: string, employee: Partial<BackendEmployee>): Promise<BackendEmployee | null> {
    try {
      const response = await axios.put(`${API_BASE_URL}/employees/${id}`, employee);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/employees/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  }
}

const employeeService = new EmployeeService();
export default employeeService; 
