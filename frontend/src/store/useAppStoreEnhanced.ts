// ARCHIVO: frontend/src/store/useAppStoreEnhanced.ts
// Store mejorado con sincronización opcional con el backend

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { seedData } from '../utils/seedData';
import { SyncService, SyncAdapter } from './syncAdapter';

// Mantener las interfaces existentes para compatibilidad
interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  phone?: string;
  startDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  manager?: string;
  skills?: string[];
  certifications?: string[];
  securityClearance?: 'none' | 'confidential' | 'secret' | 'top-secret';
  riskLevel?: 'low' | 'medium' | 'high';
  lastTraining?: string;
  createdAt: string;
  updatedAt: string;
}

// Estados de sincronización
interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime?: string;
  syncErrors: string[];
  pendingChanges: {
    create: Employee[];
    update: { id: string; data: Partial<Employee> }[];
    delete: string[];
  };
}

interface EnhancedAppState {
  // Datos existentes
  employees: Employee[];
  vendors: any[];
  systems: any[];
  assets: any[];
  tasks: any[];
  risks: any[];
  controls: any[];
  incidents: any[];
  policies: any[];
  evidence: any[];

  // Estado de sincronización
  syncState: SyncState;

  // Configuración
  config: {
    syncEnabled: boolean;
    autoSync: boolean;
    syncInterval: number; // minutos
  };

  // Acciones existentes (mantener compatibilidad)
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, employee: Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;

  // Nuevas acciones de sincronización
  syncWithBackend: () => Promise<void>;
  enableSync: (enable: boolean) => void;
  clearSyncErrors: () => void;
  applyPendingChanges: () => Promise<void>;
  
  // Acciones mejoradas con sync opcional
  addEmployeeWithSync: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEmployeeWithSync: (id: string, employee: Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteEmployeeWithSync: (id: string) => Promise<void>;

  // Resto de acciones (vendors, systems, etc.) permanecen igual
  addVendor: (vendor: any) => void;
  updateVendor: (id: string, vendor: any) => void;
  deleteVendor: (id: string) => void;
  getVendorById: (id: string) => any;

  addSystem: (system: any) => void;
  updateSystem: (id: string, system: any) => void;
  deleteSystem: (id: string) => void;
  getSystemById: (id: string) => any;

  addAsset: (asset: any) => void;
  updateAsset: (id: string, asset: any) => void;
  deleteAsset: (id: string) => void;
  getAssetById: (id: string) => any;

  addTask: (task: any) => void;
  updateTask: (id: string, task: any) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => any;

  initializeStore: () => void;
  clearAllData: () => void;
}

// Funciones auxiliares (mantener las existentes)
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const addTimestamps = () => {
  const now = new Date().toISOString();
  return { createdAt: now, updatedAt: now };
};
const updateTimestamp = () => ({ updatedAt: new Date().toISOString() });

export const useAppStoreEnhanced = create<EnhancedAppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        employees: [],
        vendors: [],
        systems: [],
        assets: [],
        tasks: [],
        risks: [],
        controls: [],
        incidents: [],
        policies: [],
        evidence: [],

        // Estado de sincronización
        syncState: {
          isOnline: navigator.onLine,
          isSyncing: false,
          syncErrors: [],
          pendingChanges: {
            create: [],
            update: [],
            delete: []
          }
        },

        // Configuración por defecto
        config: {
          syncEnabled: false, // Deshabilitado por defecto para mantener comportamiento actual
          autoSync: false,
          syncInterval: 5
        },

        // ==================== ACCIONES EXISTENTES (sin cambios) ====================
        
        addEmployee: (employeeData) => {
          const newEmployee: Employee = {
            ...employeeData,
            id: generateId('emp'),
            ...addTimestamps(),
          };

          set((state) => ({
            employees: [...state.employees, newEmployee],
          }));

          // Si sync está habilitado, agregar a pendientes
          const { config } = get();
          if (config.syncEnabled) {
            set((state) => ({
              syncState: {
                ...state.syncState,
                pendingChanges: {
                  ...state.syncState.pendingChanges,
                  create: [...state.syncState.pendingChanges.create, newEmployee]
                }
              }
            }));
          }

          console.log('Employee added:', newEmployee);
        },

        updateEmployee: (id, employeeData) => {
          set((state) => ({
            employees: state.employees.map((emp) =>
              emp.id === id ? { ...emp, ...employeeData, ...updateTimestamp() } : emp
            ),
          }));

          // Si sync está habilitado, agregar a pendientes
          const { config } = get();
          if (config.syncEnabled) {
            set((state) => ({
              syncState: {
                ...state.syncState,
                pendingChanges: {
                  ...state.syncState.pendingChanges,
                  update: [...state.syncState.pendingChanges.update, { id, data: employeeData }]
                }
              }
            }));
          }

          console.log('Employee updated:', id, employeeData);
        },

        deleteEmployee: (id) => {
          set((state) => ({
            employees: state.employees.filter((emp) => emp.id !== id),
          }));

          // Si sync está habilitado, agregar a pendientes
          const { config } = get();
          if (config.syncEnabled) {
            set((state) => ({
              syncState: {
                ...state.syncState,
                pendingChanges: {
                  ...state.syncState.pendingChanges,
                  delete: [...state.syncState.pendingChanges.delete, id]
                }
              }
            }));
          }

          console.log('Employee deleted:', id);
        },

        getEmployeeById: (id) => {
          const state = get();
          return state.employees.find((emp) => emp.id === id);
        },

        // ==================== NUEVAS ACCIONES CON SINCRONIZACIÓN ====================
        
        syncWithBackend: async () => {
          const { config } = get();
          if (!config.syncEnabled) {
            console.log('Sincronización deshabilitada');
            return;
          }

          set((state) => ({
            syncState: { ...state.syncState, isSyncing: true, syncErrors: [] }
          }));

          try {
            // 1. Obtener empleados del backend
            const result = await SyncService.syncEmployeesFromBackend();
            
            if (result.success && result.data) {
              // 2. Merge con datos locales (priorizar backend)
              const backendIds = new Set(result.data.map(e => e.id));
              const localOnlyEmployees = get().employees.filter(e => !backendIds.has(e.id));
              
              set((state) => ({
                employees: [...result.data, ...localOnlyEmployees],
                syncState: {
                  ...state.syncState,
                  isSyncing: false,
                  lastSyncTime: new Date().toISOString(),
                  isOnline: true
                }
              }));
              
              console.log(`Sincronización completa: ${result.data.length} empleados del backend`);
            } else {
              throw new Error(result.error || 'Error de sincronización');
            }
          } catch (error) {
            console.error('Error en sincronización:', error);
            set((state) => ({
              syncState: {
                ...state.syncState,
                isSyncing: false,
                syncErrors: [error instanceof Error ? error.message : 'Error desconocido'],
                isOnline: false
              }
            }));
          }
        },

        enableSync: (enable) => {
          set((state) => ({
            config: { ...state.config, syncEnabled: enable }
          }));
          
          if (enable) {
            // Intentar sincronización inicial
            get().syncWithBackend();
          }
        },

        clearSyncErrors: () => {
          set((state) => ({
            syncState: { ...state.syncState, syncErrors: [] }
          }));
        },

        applyPendingChanges: async () => {
          const { syncState, config } = get();
          if (!config.syncEnabled || !syncState.pendingChanges) return;

          const errors: string[] = [];
          
          // Aplicar creaciones
          for (const emp of syncState.pendingChanges.create) {
            const result = await SyncService.createEmployeeInBackend(emp);
            if (!result.success) {
              errors.push(`Error creando ${emp.name}: ${result.error}`);
            }
          }

          // Aplicar actualizaciones
          for (const update of syncState.pendingChanges.update) {
            const emp = get().getEmployeeById(update.id);
            if (emp) {
              const result = await SyncService.updateEmployeeInBackend(update.id, { ...emp, ...update.data });
              if (!result.success) {
                errors.push(`Error actualizando ${update.id}: ${result.error}`);
              }
            }
          }

          // Aplicar eliminaciones
          for (const id of syncState.pendingChanges.delete) {
            const result = await SyncService.deleteEmployeeFromBackend(id);
            if (!result.success) {
              errors.push(`Error eliminando ${id}: ${result.error}`);
            }
          }

          // Limpiar pendientes y actualizar errores
          set((state) => ({
            syncState: {
              ...state.syncState,
              pendingChanges: { create: [], update: [], delete: [] },
              syncErrors: errors
            }
          }));

          // Re-sincronizar para obtener estado actualizado
          if (errors.length === 0) {
            await get().syncWithBackend();
          }
        },

        // Versiones con sync inmediato
        addEmployeeWithSync: async (employeeData) => {
          const newEmployee: Employee = {
            ...employeeData,
            id: generateId('emp'),
            ...addTimestamps(),
          };

          // Agregar localmente primero (optimistic update)
          set((state) => ({
            employees: [...state.employees, newEmployee],
          }));

          // Sincronizar con backend si está habilitado
          if (get().config.syncEnabled) {
            const result = await SyncService.createEmployeeInBackend(newEmployee);
            if (result.success && result.data) {
              // Actualizar con datos del backend
              set((state) => ({
                employees: state.employees.map(e => 
                  e.id === newEmployee.id ? result.data! : e
                )
              }));
            } else {
              // Rollback en caso de error
              set((state) => ({
                employees: state.employees.filter(e => e.id !== newEmployee.id),
                syncState: {
                  ...state.syncState,
                  syncErrors: [...state.syncState.syncErrors, result.error || 'Error al crear']
                }
              }));
            }
          }
        },

        updateEmployeeWithSync: async (id, employeeData) => {
          const oldEmployee = get().getEmployeeById(id);
          
          // Actualizar localmente primero
          set((state) => ({
            employees: state.employees.map((emp) =>
              emp.id === id ? { ...emp, ...employeeData, ...updateTimestamp() } : emp
            ),
          }));

          // Sincronizar con backend si está habilitado
          if (get().config.syncEnabled && oldEmployee) {
            const result = await SyncService.updateEmployeeInBackend(id, { ...oldEmployee, ...employeeData });
            if (!result.success) {
              // Rollback en caso de error
              set((state) => ({
                employees: state.employees.map((emp) =>
                  emp.id === id ? oldEmployee : emp
                ),
                syncState: {
                  ...state.syncState,
                  syncErrors: [...state.syncState.syncErrors, result.error || 'Error al actualizar']
                }
              }));
            }
          }
        },

        deleteEmployeeWithSync: async (id) => {
          const employee = get().getEmployeeById(id);
          
          // Eliminar localmente primero
          set((state) => ({
            employees: state.employees.filter((emp) => emp.id !== id),
          }));

          // Sincronizar con backend si está habilitado
          if (get().config.syncEnabled) {
            const result = await SyncService.deleteEmployeeFromBackend(id);
            if (!result.success && employee) {
              // Rollback en caso de error
              set((state) => ({
                employees: [...state.employees, employee],
                syncState: {
                  ...state.syncState,
                  syncErrors: [...state.syncState.syncErrors, result.error || 'Error al eliminar']
                }
              }));
            }
          }
        },

        // Resto de acciones sin cambios...
        addVendor: (vendorData) => {
          const newVendor = {
            ...vendorData,
            id: generateId('vnd'),
            ...addTimestamps(),
          };
          set((state) => ({ vendors: [...state.vendors, newVendor] }));
        },
        
        updateVendor: (id, vendorData) => {
          set((state) => ({
            vendors: state.vendors.map((vendor) =>
              vendor.id === id ? { ...vendor, ...vendorData, ...updateTimestamp() } : vendor
            ),
          }));
        },
        
        deleteVendor: (id) => {
          set((state) => ({
            vendors: state.vendors.filter((vendor) => vendor.id !== id),
          }));
        },
        
        getVendorById: (id) => {
          return get().vendors.find((vendor) => vendor.id === id);
        },

        // Systems
        addSystem: (systemData) => {
          const newSystem = {
            ...systemData,
            id: generateId('sys'),
            ...addTimestamps(),
          };
          set((state) => ({ systems: [...state.systems, newSystem] }));
        },
        
        updateSystem: (id, systemData) => {
          set((state) => ({
            systems: state.systems.map((system) =>
              system.id === id ? { ...system, ...systemData, ...updateTimestamp() } : system
            ),
          }));
        },
        
        deleteSystem: (id) => {
          set((state) => ({
            systems: state.systems.filter((system) => system.id !== id),
          }));
        },
        
        getSystemById: (id) => {
          return get().systems.find((system) => system.id === id);
        },

        // Assets
        addAsset: (assetData) => {
          const newAsset = {
            ...assetData,
            id: generateId('ast'),
            ...addTimestamps(),
          };
          set((state) => ({ assets: [...state.assets, newAsset] }));
        },
        
        updateAsset: (id, assetData) => {
          set((state) => ({
            assets: state.assets.map((asset) =>
              asset.id === id ? { ...asset, ...assetData, ...updateTimestamp() } : asset
            ),
          }));
        },
        
        deleteAsset: (id) => {
          set((state) => ({
            assets: state.assets.filter((asset) => asset.id !== id),
          }));
        },
        
        getAssetById: (id) => {
          return get().assets.find((asset) => asset.id === id);
        },

        // Tasks
        addTask: (taskData) => {
          const newTask = {
            ...taskData,
            id: generateId('tsk'),
            ...addTimestamps(),
          };
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        },
        
        updateTask: (id, taskData) => {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...taskData, ...updateTimestamp() } : task
            ),
          }));
        },
        
        deleteTask: (id) => {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }));
        },
        
        getTaskById: (id) => {
          return get().tasks.find((task) => task.id === id);
        },

        // Acciones generales
        initializeStore: () => {
          const state = get();
          if (state.employees.length === 0) {
            set({
              employees: seedData.employees,
              vendors: seedData.vendors,
              systems: seedData.systems,
              assets: seedData.assets,
              tasks: seedData.tasks,
              risks: seedData.risks,
              controls: seedData.controls,
              incidents: seedData.incidents,
              policies: seedData.policies,
              evidence: seedData.evidence,
            });
          }
        },

        clearAllData: () => {
          set({
            employees: [],
            vendors: [],
            systems: [],
            assets: [],
            tasks: [],
            risks: [],
            controls: [],
            incidents: [],
            policies: [],
            evidence: [],
          });
        },
      }),
      {
        name: 'grc-store-enhanced',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          employees: state.employees,
          vendors: state.vendors,
          systems: state.systems,
          assets: state.assets,
          tasks: state.tasks,
          risks: state.risks,
          controls: state.controls,
          incidents: state.incidents,
          policies: state.policies,
          evidence: state.evidence,
          config: state.config
        }),
      }
    ),
    {
      name: 'GRC-Store-Enhanced'
    }
  )
);
setTimeout(() => {
  const state = useAppStoreEnhanced.getState();
  if (state.employees.length === 0) {
    console.log('Inicializando datos del store...');
    state.initializeStore();
  }
}, 200);