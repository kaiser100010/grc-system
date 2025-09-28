// ARCHIVO: frontend/src/store/syncAdapter.ts
// Capa de adaptación para sincronización gradual con el backend

import employeeService from '../services/employee.service';

// Tipos del backend
interface BackendEmployee {
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

// Tipos del store local
interface StoreEmployee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  phone?: string;
  startDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  manager?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Adaptador para convertir entre formatos del backend y el store
 */
export class SyncAdapter {
  /**
   * Convierte empleado del backend al formato del store
   */
  static backendToStore(backendEmp: BackendEmployee): StoreEmployee {
    return {
      id: backendEmp.id,
      name: `${backendEmp.firstName} ${backendEmp.lastName}`,
      email: backendEmp.email,
      position: backendEmp.position || 'Sin asignar',
      department: backendEmp.department || 'Sin asignar',
      startDate: backendEmp.startDate ? new Date(backendEmp.startDate).toISOString() : new Date().toISOString(),
      status: this.mapStatus(backendEmp.status),
      manager: backendEmp.manager,
      createdAt: backendEmp.createdAt,
      updatedAt: backendEmp.updatedAt
    };
  }

  /**
   * Convierte empleado del store al formato del backend
   */
  static storeToBackend(storeEmp: Partial<StoreEmployee>): Partial<BackendEmployee> {
    const nameParts = (storeEmp.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      employeeId: storeEmp.id?.replace('emp-', 'EMP') || `EMP${Date.now()}`,
      firstName,
      lastName,
      email: storeEmp.email,
      department: storeEmp.department === 'Sin asignar' ? undefined : storeEmp.department,
      position: storeEmp.position === 'Sin asignar' ? undefined : storeEmp.position,
      manager: storeEmp.manager,
      status: this.reverseMapStatus(storeEmp.status || 'active'),
      startDate: storeEmp.startDate
    };
  }

  /**
   * Mapea status del backend al store
   */
  private static mapStatus(backendStatus: string): 'active' | 'inactive' | 'on-leave' {
    const statusMap: Record<string, 'active' | 'inactive' | 'on-leave'> = {
      'ACTIVE': 'active',
      'INACTIVE': 'inactive',
      'ON_LEAVE': 'on-leave',
      'TERMINATED': 'inactive'
    };
    return statusMap[backendStatus] || 'active';
  }

  /**
   * Mapea status del store al backend
   */
  private static reverseMapStatus(storeStatus: string): 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED' {
    const statusMap: Record<string, 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED'> = {
      'active': 'ACTIVE',
      'inactive': 'INACTIVE',
      'on-leave': 'ON_LEAVE'
    };
    return statusMap[storeStatus] || 'ACTIVE';
  }
}

/**
 * Servicio de sincronización con manejo de errores y reintentos
 */
export class SyncService {
  private static retryCount = 3;
  private static retryDelay = 1000; // ms

  /**
   * Sincroniza empleados del backend al store
   */
  static async syncEmployeesFromBackend(): Promise<{
    success: boolean;
    data?: StoreEmployee[];
    error?: string;
  }> {
    try {
      const response = await this.retryOperation(() => employeeService.getAll());
      
      if (response.success && response.data) {
        const storeEmployees = response.data.map(emp => 
          SyncAdapter.backendToStore(emp as any)
        );
        return { success: true, data: storeEmployees };
      }
      
      return { 
        success: false, 
        error: response.error || 'Error desconocido' 
      };
    } catch (error) {
      console.error('Error sincronizando empleados:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error de sincronización' 
      };
    }
  }

  /**
   * Crea empleado en el backend
   */
  static async createEmployeeInBackend(storeEmployee: Partial<StoreEmployee>): Promise<{
    success: boolean;
    data?: StoreEmployee;
    error?: string;
  }> {
    try {
      const backendFormat = SyncAdapter.storeToBackend(storeEmployee);
      const response = await this.retryOperation(() => 
        employeeService.create(backendFormat as any)
      );
      
      if (response) {
        const storeFormat = SyncAdapter.backendToStore(response as any);
        return { success: true, data: storeFormat };
      }
      
      return { success: false, error: 'Error al crear empleado' };
    } catch (error) {
      console.error('Error creando empleado:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al crear' 
      };
    }
  }

  /**
   * Actualiza empleado en el backend
   */
  static async updateEmployeeInBackend(id: string, storeEmployee: Partial<StoreEmployee>): Promise<{
    success: boolean;
    data?: StoreEmployee;
    error?: string;
  }> {
    try {
      const backendFormat = SyncAdapter.storeToBackend(storeEmployee);
      const response = await this.retryOperation(() => 
        employeeService.update(id, backendFormat as any)
      );
      
      if (response) {
        const storeFormat = SyncAdapter.backendToStore(response as any);
        return { success: true, data: storeFormat };
      }
      
      return { success: false, error: 'Error al actualizar empleado' };
    } catch (error) {
      console.error('Error actualizando empleado:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar' 
      };
    }
  }

  /**
   * Elimina empleado del backend
   */
  static async deleteEmployeeFromBackend(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await this.retryOperation(() => employeeService.delete(id));
      return { success: true };
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al eliminar' 
      };
    }
  }

  /**
   * Operación con reintentos automáticos
   */
  private static async retryOperation<T>(
    operation: () => Promise<T>,
    retries = this.retryCount
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        console.log(`Reintentando operación... (${this.retryCount - retries + 1}/${this.retryCount})`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retryOperation(operation, retries - 1);
      }
      throw error;
    }
  }
}