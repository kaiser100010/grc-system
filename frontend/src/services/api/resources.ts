// frontend/src/services/api/resources.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Tipos para Empleados
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  location?: string;
  startDate?: Date | string;
  endDate?: Date | string | null;
  manager?: string;
  status: string;
  skills?: string[];
  clearanceLevel?: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateEmployeeRequest {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  location?: string;
  startDate?: Date | string;
  endDate?: Date | string | null;
  manager?: string;
  status: string;
  skills?: string[];
  clearanceLevel?: string;
  notes?: string;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {}

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
      
      // El backend retorna { success: true, data: [], count: number }
      // Necesitamos transformarlo al formato esperado
      const employees = response.data.data || response.data;
      const total = response.data.count || employees.length;
      
      // Mapear los campos si es necesario
      const mappedEmployees = Array.isArray(employees) ? employees.map((emp: any) => ({
        ...emp,
        // Agregar campos adicionales que el frontend espera
        phone: emp.phone || '',
        location: emp.location || 'Madrid, Spain',
        skills: emp.skills || [],
        clearanceLevel: emp.clearanceLevel || '',
        notes: emp.notes || ''
      })) : [];
      
      return {
        data: mappedEmployees,
        total: total,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(total / (params?.limit || 10))
      };
    } catch (error) {
      console.error('Error fetching employees:', error);
      // En caso de error, lanzar el error para que el componente lo maneje
      throw new Error('No se pudieron cargar los empleados. Verifica que el servidor backend esté corriendo en http://localhost:3001');
    }
  },

  async getEmployee(id: string): Promise<Employee> {
    try {
      const response = await axios.get(`${API_URL}/employees/${id}`);
      
      // El backend retorna { success: true, data: employee }
      const employee = response.data.data || response.data;
      
      return {
        ...employee,
        phone: employee.phone || '',
        location: employee.location || 'Madrid, Spain',
        skills: employee.skills || [],
        clearanceLevel: employee.clearanceLevel || '',
        notes: employee.notes || ''
      };
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw new Error(`No se pudo cargar el empleado con ID ${id}`);
    }
  },

  async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    try {
      const response = await axios.post(`${API_URL}/employees`, data);
      // El backend retorna { success: true, data: employee }
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('No se pudo crear el empleado');
    }
  },

  async updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<Employee> {
    try {
      const response = await axios.put(`${API_URL}/employees/${id}`, data);
      // El backend retorna { success: true, data: employee }
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('No se pudo actualizar el empleado');
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/employees/${id}`);
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('No se pudo eliminar el empleado');
    }
  }
};

// Tipos para Vendors
export interface Vendor {
  id: string;
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  riskLevel: string;
  status: string;
  lastAssessment?: Date | string | null;
  nextAssessment?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateVendorRequest {
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  riskLevel: string;
  status: string;
  lastAssessment?: Date | string | null;
  nextAssessment?: Date | string | null;
}

export interface UpdateVendorRequest extends Partial<CreateVendorRequest> {}

// Servicio de Vendors
export const vendorService = {
  async getVendors(params?: any): Promise<PaginatedResponse<Vendor>> {
    try {
      const response = await axios.get(`${API_URL}/vendors`, { params });
      const vendors = response.data.data || response.data;
      const total = response.data.count || vendors.length;
      
      return {
        data: Array.isArray(vendors) ? vendors : [],
        total: total,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(total / (params?.limit || 10))
      };
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw new Error('No se pudieron cargar los proveedores');
    }
  },

  async getVendor(id: string): Promise<Vendor> {
    try {
      const response = await axios.get(`${API_URL}/vendors/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw new Error(`No se pudo cargar el proveedor con ID ${id}`);
    }
  },

  async createVendor(data: CreateVendorRequest): Promise<Vendor> {
    try {
      const response = await axios.post(`${API_URL}/vendors`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw new Error('No se pudo crear el proveedor');
    }
  },

  async updateVendor(id: string, data: UpdateVendorRequest): Promise<Vendor> {
    try {
      const response = await axios.put(`${API_URL}/vendors/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw new Error('No se pudo actualizar el proveedor');
    }
  },

  async deleteVendor(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/vendors/${id}`);
    } catch (error) {
      console.error('Error deleting vendor:', error);
      throw new Error('No se pudo eliminar el proveedor');
    }
  }
};

// Tipos para Systems
export interface System {
  id: string;
  name: string;
  description?: string;
  criticality: string;
  environment?: string;
  dataTypes: string[];
  vendorId?: string;
  vendor?: Vendor;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateSystemRequest {
  name: string;
  description?: string;
  criticality: string;
  environment?: string;
  dataTypes: string[];
  vendorId?: string;
}

export interface UpdateSystemRequest extends Partial<CreateSystemRequest> {}

// Servicio de Systems
export const systemService = {
  async getSystems(params?: any): Promise<PaginatedResponse<System>> {
    try {
      const response = await axios.get(`${API_URL}/systems`, { params });
      const systems = response.data.data || response.data;
      const total = response.data.count || systems.length;
      
      return {
        data: Array.isArray(systems) ? systems : [],
        total: total,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(total / (params?.limit || 10))
      };
    } catch (error) {
      console.error('Error fetching systems:', error);
      throw new Error('No se pudieron cargar los sistemas');
    }
  },

  async getSystem(id: string): Promise<System> {
    try {
      const response = await axios.get(`${API_URL}/systems/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching system:', error);
      throw new Error(`No se pudo cargar el sistema con ID ${id}`);
    }
  },

  async createSystem(data: CreateSystemRequest): Promise<System> {
    try {
      const response = await axios.post(`${API_URL}/systems`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating system:', error);
      throw new Error('No se pudo crear el sistema');
    }
  },

  async updateSystem(id: string, data: UpdateSystemRequest): Promise<System> {
    try {
      const response = await axios.put(`${API_URL}/systems/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating system:', error);
      throw new Error('No se pudo actualizar el sistema');
    }
  },

  async deleteSystem(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/systems/${id}`);
    } catch (error) {
      console.error('Error deleting system:', error);
      throw new Error('No se pudo eliminar el sistema');
    }
  }
};

// Tipos para Assets
export interface Asset {
  id: string;
  name: string;
  description?: string;
  type: string;
  serialNumber?: string;
  location?: string;
  value?: number;
  systemId?: string;
  system?: System;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateAssetRequest {
  name: string;
  description?: string;
  type: string;
  serialNumber?: string;
  location?: string;
  value?: number;
  systemId?: string;
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {}

// Servicio de Assets
export const assetService = {
  async getAssets(params?: any): Promise<PaginatedResponse<Asset>> {
    try {
      const response = await axios.get(`${API_URL}/assets`, { params });
      const assets = response.data.data || response.data;
      const total = response.data.count || assets.length;
      
      return {
        data: Array.isArray(assets) ? assets : [],
        total: total,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(total / (params?.limit || 10))
      };
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw new Error('No se pudieron cargar los activos');
    }
  },

  async getAsset(id: string): Promise<Asset> {
    try {
      const response = await axios.get(`${API_URL}/assets/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw new Error(`No se pudo cargar el activo con ID ${id}`);
    }
  },

  async createAsset(data: CreateAssetRequest): Promise<Asset> {
    try {
      const response = await axios.post(`${API_URL}/assets`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw new Error('No se pudo crear el activo');
    }
  },

  async updateAsset(id: string, data: UpdateAssetRequest): Promise<Asset> {
    try {
      const response = await axios.put(`${API_URL}/assets/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating asset:', error);
      throw new Error('No se pudo actualizar el activo');
    }
  },

  async deleteAsset(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/assets/${id}`);
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw new Error('No se pudo eliminar el activo');
    }
  }
};