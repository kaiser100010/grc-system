// src/store/appStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interfaces
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  owner: string;
  ownerName?: string;
  probability: number;
  impact: number;
  score: number;
  level: string;
  priority: string;
  status: string;
  treatment: string;
  currentControls?: string;
  mitigationPlan?: string;
  progress?: number;
  probabilityAnalysis?: string;
  consequences?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeName?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  relatedRisk?: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Control {
  id: string;
  title: string;
  description: string;
  framework: string;
  category: string;
  owner: string;
  ownerName?: string;
  status: 'not_implemented' | 'partially_implemented' | 'implemented' | 'effective';
  effectiveness: number;
  testFrequency: string;
  lastTestDate?: Date;
  nextTestDate?: Date;
  evidence?: string[];
  relatedRisks?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reporter: string;
  reporterName?: string;
  assignee: string;
  assigneeName?: string;
  category: string;
  detectionDate: Date;
  resolutionDate?: Date;
  rootCause?: string;
  correctiveActions?: string;
  lessonsLearned?: string;
  relatedRisk?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Policy {
  id: string;
  title: string;
  description: string;
  version: string;
  category: string;
  owner: string;
  ownerName?: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  effectiveDate: Date;
  nextReviewDate: Date;
  approvers: string[];
  content?: string;
  attachments?: string[];
  relatedControls?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Vendor {
  id: string;
  name: string;
  description: string;
  category: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  status: 'active' | 'inactive' | 'pending' | 'terminated';
  contractStartDate?: Date;
  contractEndDate?: Date;
  lastAssessmentDate?: Date;
  nextAssessmentDate?: Date;
  services?: string[];
  slaTerms?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface System {
  id: string;
  name: string;
  description: string;
  type: string;
  owner: string;
  ownerName?: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  status: 'operational' | 'maintenance' | 'deprecated' | 'decommissioned';
  dataClassification: string;
  hosting: 'on-premise' | 'cloud' | 'hybrid';
  vendor?: string;
  relatedRisks?: string[];
  relatedControls?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Asset {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  owner: string;
  ownerName?: string;
  location: string;
  value?: number;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'maintenance' | 'retired' | 'disposed';
  serialNumber?: string;
  purchaseDate?: Date;
  warrantyEndDate?: Date;
  relatedSystems?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Evidence {
  id: string;
  title: string;
  description: string;
  type: string;
  controlId?: string; // (legacy, se mantiene por compatibilidad)

  // NUEVO: relación genérica
  relatedType?: 'control' | 'incident' | 'risk';
  relatedId?: string;

  uploadedBy: string;
  uploadedByName?: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  tags?: string[];
  period?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewer?: string;
  reviewerComments?: string;
  createdAt: Date;
  updatedAt: Date;
}


interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  userId: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Store State Interface
interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;

  // Entities
  employees: Employee[];
  risks: Risk[];
  tasks: Task[];
  controls: Control[];
  incidents: Incident[];
  policies: Policy[];
  vendors: Vendor[];
  systems: System[];
  assets: Asset[];
  evidence: Evidence[];
  notifications: Notification[];
  auditLogs: AuditLog[];

  // UI State
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';

  // Actions - Auth
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Actions - Employees
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Actions - Risks
  addRisk: (risk: Risk) => void;
  updateRisk: (id: string, updates: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;

  // Actions - Tasks
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Actions - Controls
  addControl: (control: Control) => void;
  updateControl: (id: string, updates: Partial<Control>) => void;
  deleteControl: (id: string) => void;

  // Actions - Incidents
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;

  // Actions - Policies
  addPolicy: (policy: Policy) => void;
  updatePolicy: (id: string, updates: Partial<Policy>) => void;
  deletePolicy: (id: string) => void;

  // Actions - Vendors
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  // Actions - Systems
  addSystem: (system: System) => void;
  updateSystem: (id: string, updates: Partial<System>) => void;
  deleteSystem: (id: string) => void;

  // Actions - Assets
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  // Actions - Evidence
  addEvidence: (evidence: Evidence) => void;
  updateEvidence: (id: string, updates: Partial<Evidence>) => void;
  deleteEvidence: (id: string) => void;

  // Actions - Notifications
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;

  // Actions - Audit Logs
  addAuditLog: (log: AuditLog) => void;
  updateAuditLog: (id: string, updates: Partial<AuditLog>) => void;
  deleteAuditLog: (id: string) => void;
  clearAuditLogs: () => void;

  // Actions - UI
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Utility Actions
  resetStore: () => void;
}

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  employees: [],
  risks: [],
  tasks: [],
  controls: [],
  incidents: [],
  policies: [],
  vendors: [],
  systems: [],
  assets: [],
  evidence: [],
  notifications: [],
  auditLogs: [],
  sidebarCollapsed: false,
  theme: 'light' as const,
};

// Create Store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Auth Actions
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Employee Actions
      addEmployee: (employee) =>
        set((state) => ({
          employees: [...state.employees, employee],
        })),
      updateEmployee: (id, updates) =>
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date() } : e
          ),
        })),
      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
        })),

      // Risk Actions
      addRisk: (risk) => {
        set((state) => ({
          risks: [...state.risks, risk],
        }));
        const { user } = get();
        if (user) {
          get().addAuditLog({
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            action: 'CREATE',
            entity: 'RISK',
            entityId: risk.id,
            timestamp: new Date(),
          });
        }
      },
      updateRisk: (id, updates) => {
        set((state) => ({
          risks: state.risks.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
          ),
        }));
        const { user } = get();
        if (user) {
          get().addAuditLog({
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            action: 'UPDATE',
            entity: 'RISK',
            entityId: id,
            changes: updates,
            timestamp: new Date(),
          });
        }
      },
      deleteRisk: (id) => {
        set((state) => ({
          risks: state.risks.filter((r) => r.id !== id),
        }));
        const { user } = get();
        if (user) {
          get().addAuditLog({
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            action: 'DELETE',
            entity: 'RISK',
            entityId: id,
            timestamp: new Date(),
          });
        }
      },

      // Task Actions
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      // Control Actions
      addControl: (control) =>
        set((state) => ({
          controls: [...state.controls, control],
        })),
      updateControl: (id, updates) =>
        set((state) => ({
          controls: state.controls.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        })),
      deleteControl: (id) =>
        set((state) => ({
          controls: state.controls.filter((c) => c.id !== id),
        })),

      // Incident Actions
      addIncident: (incident) =>
        set((state) => ({
          incidents: [...state.incidents, incident],
        })),
      updateIncident: (id, updates) =>
        set((state) => ({
          incidents: state.incidents.map((i) =>
            i.id === id ? { ...i, ...updates, updatedAt: new Date() } : i
          ),
        })),
      deleteIncident: (id) =>
        set((state) => ({
          incidents: state.incidents.filter((i) => i.id !== id),
        })),

      // Policy Actions
      addPolicy: (policy) =>
        set((state) => ({
          policies: [...state.policies, policy],
        })),
      updatePolicy: (id, updates) =>
        set((state) => ({
          policies: state.policies.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        })),
      deletePolicy: (id) =>
        set((state) => ({
          policies: state.policies.filter((p) => p.id !== id),
        })),

      // Vendor Actions
      addVendor: (vendor) =>
        set((state) => ({
          vendors: [...state.vendors, vendor],
        })),
      updateVendor: (id, updates) =>
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === id ? { ...v, ...updates, updatedAt: new Date() } : v
          ),
        })),
      deleteVendor: (id) =>
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== id),
        })),

      // System Actions
      addSystem: (system) =>
        set((state) => ({
          systems: [...state.systems, system],
        })),
      updateSystem: (id, updates) =>
        set((state) => ({
          systems: state.systems.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
          ),
        })),
      deleteSystem: (id) =>
        set((state) => ({
          systems: state.systems.filter((s) => s.id !== id),
        })),

      // Asset Actions
      addAsset: (asset) =>
        set((state) => ({
          assets: [...state.assets, asset],
        })),
      updateAsset: (id, updates) =>
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
          ),
        })),
      deleteAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
        })),

      // Evidence Actions
      addEvidence: (evidence) =>
        set((state) => ({
          evidence: [...state.evidence, evidence],
        })),
      updateEvidence: (id, updates) =>
        set((state) => ({
          evidence: state.evidence.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date() } : e
          ),
        })),
      deleteEvidence: (id) =>
        set((state) => ({
          evidence: state.evidence.filter((e) => e.id !== id),
        })),

      // Notification Actions
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // Audit Log Actions
      addAuditLog: (log) =>
        set((state) => ({
          auditLogs: [log, ...state.auditLogs].slice(0, 1000),
        })),
      updateAuditLog: (id, updates) =>
        set((state) => ({
          auditLogs: state.auditLogs.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        })),
      deleteAuditLog: (id) =>
        set((state) => ({
          auditLogs: state.auditLogs.filter((l) => l.id !== id),
        })),
      clearAuditLogs: () => set({ auditLogs: [] }),

      // UI Actions
      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),
      setTheme: (theme) => set({ theme }),

      // Utility Actions
      resetStore: () => set(initialState),
    }),
    {
      name: 'grc-system-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        employees: state.employees,
        risks: state.risks,
        tasks: state.tasks,
        controls: state.controls,
        incidents: state.incidents,
        policies: state.policies,
        vendors: state.vendors,
        systems: state.systems,
        assets: state.assets,
        evidence: state.evidence,
        notifications: state.notifications,
        auditLogs: state.auditLogs,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);

export type {
  User,
  Employee,
  Risk,
  Task,
  Control,
  Incident,
  Policy,
  Vendor,
  System,
  Asset,
  Evidence,
  Notification,
  AuditLog,
  AppState,
};

export default useAppStore;
