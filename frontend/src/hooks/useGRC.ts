// src/hooks/useGRC.ts
import { useAppStore } from '../store/useAppStore';

// Hook para empleados con operaciones CRUD funcionales
export const useEmployees = () => {
  const employees = useAppStore((state) => state.employees);
  const addEmployee = useAppStore((state) => state.addEmployee);
  const updateEmployee = useAppStore((state) => state.updateEmployee);
  const deleteEmployee = useAppStore((state) => state.deleteEmployee);
  const getEmployeeById = useAppStore((state) => state.getEmployeeById);

  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
  };
};

// Hook para proveedores con operaciones CRUD funcionales
export const useVendors = () => {
  const vendors = useAppStore((state) => state.vendors);
  const addVendor = useAppStore((state) => state.addVendor);
  const updateVendor = useAppStore((state) => state.updateVendor);
  const deleteVendor = useAppStore((state) => state.deleteVendor);
  const getVendorById = useAppStore((state) => state.getVendorById);

  return {
    vendors,
    addVendor,
    updateVendor,
    deleteVendor,
    getVendorById,
  };
};

// Hook para sistemas con operaciones CRUD funcionales
export const useSystems = () => {
  const systems = useAppStore((state) => state.systems);
  const addSystem = useAppStore((state) => state.addSystem);
  const updateSystem = useAppStore((state) => state.updateSystem);
  const deleteSystem = useAppStore((state) => state.deleteSystem);
  const getSystemById = useAppStore((state) => state.getSystemById);

  return {
    systems,
    addSystem,
    updateSystem,
    deleteSystem,
    getSystemById,
  };
};

// Hook para activos con operaciones CRUD funcionales
export const useAssets = () => {
  const assets = useAppStore((state) => state.assets);
  const addAsset = useAppStore((state) => state.addAsset);
  const updateAsset = useAppStore((state) => state.updateAsset);
  const deleteAsset = useAppStore((state) => state.deleteAsset);
  const getAssetById = useAppStore((state) => state.getAssetById);

  return {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetById,
  };
};

// Hook para tareas con operaciones CRUD funcionales
export const useTasks = () => {
  const tasks = useAppStore((state) => state.tasks);
  const addTask = useAppStore((state) => state.addTask);
  const updateTask = useAppStore((state) => state.updateTask);
  const deleteTask = useAppStore((state) => state.deleteTask);
  const getTaskById = useAppStore((state) => state.getTaskById);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
  };
};

// Hook para riesgos (placeholder por ahora)
export const useRisks = () => {
  const risks = useAppStore((state) => state.risks);
  
  const addRisk = (riskData: any) => {
    console.log('Add risk:', riskData);
    // TODO: Implementar cuando tengamos tipos completos
  };
  
  const updateRisk = (id: string, riskData: any) => {
    console.log('Update risk:', id, riskData);
    // TODO: Implementar
  };
  
  const deleteRisk = (id: string) => {
    console.log('Delete risk:', id);
    // TODO: Implementar
  };

  return {
    risks,
    addRisk,
    updateRisk,
    deleteRisk,
  };
};

// Hook para controles (placeholder por ahora)
export const useControls = () => {
  const controls = useAppStore((state) => state.controls);
  
  const addControl = (controlData: any) => {
    console.log('Add control:', controlData);
    // TODO: Implementar
  };
  
  const updateControl = (id: string, controlData: any) => {
    console.log('Update control:', id, controlData);
    // TODO: Implementar
  };
  
  const deleteControl = (id: string) => {
    console.log('Delete control:', id);
    // TODO: Implementar
  };

  return {
    controls,
    addControl,
    updateControl,
    deleteControl,
  };
};

// Hook para incidentes (placeholder por ahora)
export const useIncidents = () => {
  const incidents = useAppStore((state) => state.incidents);
  
  const addIncident = (incidentData: any) => {
    console.log('Add incident:', incidentData);
    // TODO: Implementar
  };
  
  const updateIncident = (id: string, incidentData: any) => {
    console.log('Update incident:', id, incidentData);
    // TODO: Implementar
  };
  
  const deleteIncident = (id: string) => {
    console.log('Delete incident:', id);
    // TODO: Implementar
  };

  return {
    incidents,
    addIncident,
    updateIncident,
    deleteIncident,
  };
};

// Hook para políticas (placeholder por ahora)
export const usePolicies = () => {
  const policies = useAppStore((state) => state.policies);
  
  const addPolicy = (policyData: any) => {
    console.log('Add policy:', policyData);
    // TODO: Implementar
  };
  
  const updatePolicy = (id: string, policyData: any) => {
    console.log('Update policy:', id, policyData);
    // TODO: Implementar
  };
  
  const deletePolicy = (id: string) => {
    console.log('Delete policy:', id);
    // TODO: Implementar
  };

  return {
    policies,
    addPolicy,
    updatePolicy,
    deletePolicy,
  };
};

// Hook para evidencias (placeholder por ahora)
export const useEvidence = () => {
  const evidence = useAppStore((state) => state.evidence);
  
  const addEvidence = (evidenceData: any) => {
    console.log('Add evidence:', evidenceData);
    // TODO: Implementar
  };
  
  const updateEvidence = (id: string, evidenceData: any) => {
    console.log('Update evidence:', id, evidenceData);
    // TODO: Implementar
  };
  
  const deleteEvidence = (id: string) => {
    console.log('Delete evidence:', id);
    // TODO: Implementar
  };

  return {
    evidence,
    addEvidence,
    updateEvidence,
    deleteEvidence,
  };
};

// Hook para estadísticas del dashboard con cálculos reales
export const useDashboardStats = () => {
  return useAppStore((state) => ({
    totalEmployees: state.employees.length,
    totalVendors: state.vendors.length,
    totalSystems: state.systems.length,
    totalAssets: state.assets.length,
    totalTasks: state.tasks.length,
    
    // Estadísticas de empleados
    activeEmployees: state.employees.filter(emp => emp.status === 'active').length,
    inactiveEmployees: state.employees.filter(emp => emp.status === 'inactive').length,
    onLeaveEmployees: state.employees.filter(emp => emp.status === 'on-leave').length,
    highRiskEmployees: state.employees.filter(emp => emp.riskLevel === 'high').length,
    
    // Estadísticas de proveedores
    activeVendors: state.vendors.filter(vendor => vendor.status === 'active').length,
    underReviewVendors: state.vendors.filter(vendor => vendor.status === 'under-review').length,
    highRiskVendors: state.vendors.filter(vendor => vendor.riskAssessment === 'high').length,
    compliantVendors: state.vendors.filter(vendor => vendor.complianceStatus === 'compliant').length,
    
    // Estadísticas de sistemas
    activeSystems: state.systems.filter(sys => sys.status === 'active').length,
    criticalSystems: state.systems.filter(sys => sys.criticality === 'critical').length,
    systemsWithVulnerabilities: state.systems.filter(sys => (sys.vulnerabilities || 0) > 0).length,
    
    // Estadísticas de activos
    activeAssets: state.assets.filter(asset => asset.status === 'active').length,
    criticalAssets: state.assets.filter(asset => asset.criticality === 'critical').length,
    highRiskAssets: state.assets.filter(asset => asset.riskLevel === 'high').length,
    
    // Estadísticas de tareas
    completedTasks: state.tasks.filter(task => task.status === 'completed').length,
    pendingTasks: state.tasks.filter(task => task.status === 'pending').length,
    inProgressTasks: state.tasks.filter(task => task.status === 'in-progress').length,
    overdueTasks: state.tasks.filter(task => {
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate < today && task.status !== 'completed';
    }).length,
    criticalTasks: state.tasks.filter(task => task.priority === 'critical').length,
    
    // Estadísticas generales para otras entidades (cuando se implementen)
    totalRisks: state.risks.length,
    totalControls: state.controls.length,
    totalIncidents: state.incidents.length,
    totalPolicies: state.policies.length,
    totalEvidence: state.evidence.length,
  }));
};

// Hook para acciones globales del store
export const useStoreActions = () => {
  const initializeStore = useAppStore((state) => state.initializeStore);
  const clearAllData = useAppStore((state) => state.clearAllData);

  return {
    initializeStore,
    clearAllData,
  };
};