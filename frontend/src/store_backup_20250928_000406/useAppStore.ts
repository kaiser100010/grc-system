// src/stores/useAppStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { seedData } from '../utils/seedData';

// Tipos para todas las entidades principales
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

interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  category: 'software' | 'hardware' | 'consulting' | 'cloud' | 'security' | 'other';
  status: 'active' | 'inactive' | 'under-review' | 'blacklisted';
  contractStart?: string;
  contractEnd?: string;
  riskAssessment?: 'low' | 'medium' | 'high';
  complianceStatus?: 'compliant' | 'non-compliant' | 'pending';
  lastAudit?: string;
  website?: string;
  description?: string;
  services?: string[];
  createdAt: string;
  updatedAt: string;
}

interface System {
  id: string;
  name: string;
  description?: string;
  category: 'application' | 'database' | 'infrastructure' | 'network' | 'security' | 'other';
  status: 'active' | 'inactive' | 'maintenance' | 'deprecated';
  criticality: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  technicalContact?: string;
  environment: 'production' | 'staging' | 'development' | 'test';
  dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
  lastPatched?: string;
  lastAssessment?: string;
  vulnerabilities?: number;
  complianceFrameworks?: string[];
  businessProcesses?: string[];
  dependencies?: string[];
  version?: string;
  vendor?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface Asset {
  id: string;
  name: string;
  description?: string;
  category: 'hardware' | 'software' | 'data' | 'document' | 'intellectual-property' | 'other';
  status: 'active' | 'inactive' | 'disposed' | 'missing';
  value?: number;
  owner: string;
  custodian?: string;
  location?: string;
  dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
  criticality: 'low' | 'medium' | 'high' | 'critical';
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  warrantyEnd?: string;
  lastInventory?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  securityControls?: string[];
  complianceRequirements?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  reporter: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  category: 'compliance' | 'risk-management' | 'audit' | 'training' | 'incident-response' | 'policy-review' | 'other';
  tags?: string[];
  progress?: number;
}

interface AppState {
  // Datos principales
  employees: Employee[];
  vendors: Vendor[];
  systems: System[];
  assets: Asset[];
  tasks: Task[];
  risks: any[];
  controls: any[];
  incidents: any[];
  policies: any[];
  evidence: any[];

  // Acciones para empleados
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, employee: Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;

  // Acciones para proveedores
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVendor: (id: string, vendor: Partial<Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteVendor: (id: string) => void;
  getVendorById: (id: string) => Vendor | undefined;

  // Acciones para sistemas
  addSystem: (system: Omit<System, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSystem: (id: string, system: Partial<Omit<System, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteSystem: (id: string) => void;
  getSystemById: (id: string) => System | undefined;

  // Acciones para activos
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAsset: (id: string, asset: Partial<Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteAsset: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;

  // Acciones para tareas
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;

  // Acciones generales
  initializeStore: () => void;
  clearAllData: () => void;
}

// Funciones auxiliares
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const addTimestamps = () => {
  const now = new Date().toISOString();
  return { createdAt: now, updatedAt: now };
};

const updateTimestamp = () => ({ updatedAt: new Date().toISOString() });

export const useAppStore = create<AppState>()(
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

      // Acciones para empleados
      addEmployee: (employeeData) => {
        const newEmployee: Employee = {
          ...employeeData,
          id: generateId('emp'),
          ...addTimestamps(),
        };
        
        set((state) => ({
          employees: [...state.employees, newEmployee],
        }));
        
        console.log('Employee added:', newEmployee);
      },

      updateEmployee: (id, employeeData) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...employeeData, ...updateTimestamp() } : emp
          ),
        }));
        
        console.log('Employee updated:', id, employeeData);
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        }));
        
        console.log('Employee deleted:', id);
      },

      getEmployeeById: (id) => {
        const state = get();
        return state.employees.find((emp) => emp.id === id);
      },

      // Acciones para proveedores
      addVendor: (vendorData) => {
        const newVendor: Vendor = {
          ...vendorData,
          id: generateId('vnd'),
          ...addTimestamps(),
        };
        
        set((state) => ({
          vendors: [...state.vendors, newVendor],
        }));
        
        console.log('Vendor added:', newVendor);
      },

      updateVendor: (id, vendorData) => {
        set((state) => ({
          vendors: state.vendors.map((vendor) =>
            vendor.id === id ? { ...vendor, ...vendorData, ...updateTimestamp() } : vendor
          ),
        }));
        
        console.log('Vendor updated:', id, vendorData);
      },

      deleteVendor: (id) => {
        set((state) => ({
          vendors: state.vendors.filter((vendor) => vendor.id !== id),
        }));
        
        console.log('Vendor deleted:', id);
      },

      getVendorById: (id) => {
        const state = get();
        return state.vendors.find((vendor) => vendor.id === id);
      },

      // Acciones para sistemas
      addSystem: (systemData) => {
        const newSystem: System = {
          ...systemData,
          id: generateId('sys'),
          ...addTimestamps(),
        };
        
        set((state) => ({
          systems: [...state.systems, newSystem],
        }));
        
        console.log('System added:', newSystem);
      },

      updateSystem: (id, systemData) => {
        set((state) => ({
          systems: state.systems.map((system) =>
            system.id === id ? { ...system, ...systemData, ...updateTimestamp() } : system
          ),
        }));
        
        console.log('System updated:', id, systemData);
      },

      deleteSystem: (id) => {
        set((state) => ({
          systems: state.systems.filter((system) => system.id !== id),
        }));
        
        console.log('System deleted:', id);
      },

      getSystemById: (id) => {
        const state = get();
        return state.systems.find((system) => system.id === id);
      },

      // Acciones para activos
      addAsset: (assetData) => {
        const newAsset: Asset = {
          ...assetData,
          id: generateId('ast'),
          ...addTimestamps(),
        };
        
        set((state) => ({
          assets: [...state.assets, newAsset],
        }));
        
        console.log('Asset added:', newAsset);
      },

      updateAsset: (id, assetData) => {
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === id ? { ...asset, ...assetData, ...updateTimestamp() } : asset
          ),
        }));
        
        console.log('Asset updated:', id, assetData);
      },

      deleteAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id),
        }));
        
        console.log('Asset deleted:', id);
      },

      getAssetById: (id) => {
        const state = get();
        return state.assets.find((asset) => asset.id === id);
      },

      // Acciones para tareas
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId('tsk'),
          ...addTimestamps(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        
        console.log('Task added:', newTask);
      },

      updateTask: (id, taskData) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...taskData, ...updateTimestamp() } : task
          ),
        }));
        
        console.log('Task updated:', id, taskData);
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
        
        console.log('Task deleted:', id);
      },

      getTaskById: (id) => {
        const state = get();
        return state.tasks.find((task) => task.id === id);
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
      name: 'grc-store',
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
      }),
    }
  )
);