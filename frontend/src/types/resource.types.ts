// frontend/src/types/resource.types.ts

// Re-exportar los tipos del servicio para mantener compatibilidad
export type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  GetEmployeesParams,
  PaginatedResponse
} from '../services/api/resources';

// Tipos para Vendors
export interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para Systems
export interface System {
  id: string;
  name: string;
  type: string;
  description?: string;
  owner: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  status: 'operational' | 'maintenance' | 'decommissioned';
  vendor?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para Assets
export interface Asset {
  id: string;
  assetId: string;
  name: string;
  type: string;
  category: string;
  value?: number;
  location: string;
  assignedTo?: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}