// src/utils/seedData.ts

// Tipos básicos para todas las entidades
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

// Datos semilla para empleados
const employees: Employee[] = [
  {
    id: 'emp-001',
    name: 'Ana García',
    email: 'ana.garcia@company.com',
    position: 'Senior Compliance Officer',
    department: 'Risk & Compliance',
    phone: '+34 91 234 5678',
    startDate: '2020-03-15',
    status: 'active',
    manager: 'Carlos López',
    skills: ['Risk Assessment', 'Regulatory Compliance', 'Audit Management'],
    certifications: ['CISA', 'CRISC'],
    securityClearance: 'confidential',
    riskLevel: 'low',
    lastTraining: '2024-08-15',
    createdAt: '2020-03-15T09:00:00Z',
    updatedAt: '2024-08-15T14:30:00Z'
  },
  {
    id: 'emp-002',
    name: 'Carlos López',
    email: 'carlos.lopez@company.com',
    position: 'Chief Risk Officer',
    department: 'Risk & Compliance',
    phone: '+34 91 234 5679',
    startDate: '2018-01-10',
    status: 'active',
    skills: ['Strategic Risk Management', 'Enterprise Risk', 'Board Reporting'],
    certifications: ['FRM', 'PRM'],
    securityClearance: 'secret',
    riskLevel: 'low',
    lastTraining: '2024-07-20',
    createdAt: '2018-01-10T09:00:00Z',
    updatedAt: '2024-07-20T16:45:00Z'
  },
  {
    id: 'emp-003',
    name: 'María Rodríguez',
    email: 'maria.rodriguez@company.com',
    position: 'IT Security Analyst',
    department: 'Information Technology',
    phone: '+34 91 234 5680',
    startDate: '2021-09-01',
    status: 'active',
    manager: 'Pedro Martín',
    skills: ['Cybersecurity', 'Vulnerability Assessment', 'Incident Response'],
    certifications: ['CISSP', 'CEH'],
    securityClearance: 'confidential',
    riskLevel: 'medium',
    lastTraining: '2024-09-01',
    createdAt: '2021-09-01T09:00:00Z',
    updatedAt: '2024-09-01T11:20:00Z'
  }
];

// Datos semilla para proveedores
const vendors: Vendor[] = [
  {
    id: 'vnd-001',
    name: 'CyberSec Solutions',
    contactEmail: 'contact@cybersec.com',
    contactPhone: '+34 93 123 4567',
    address: 'Calle Mayor 123, Madrid, España',
    category: 'security',
    status: 'active',
    contractStart: '2023-01-01',
    contractEnd: '2025-12-31',
    riskAssessment: 'low',
    complianceStatus: 'compliant',
    lastAudit: '2024-06-15',
    website: 'https://cybersec.com',
    description: 'Proveedor de soluciones de ciberseguridad empresarial',
    services: ['Penetration Testing', 'Security Consulting', 'SOC Services'],
    createdAt: '2023-01-01T09:00:00Z',
    updatedAt: '2024-06-15T14:30:00Z'
  },
  {
    id: 'vnd-002',
    name: 'CloudTech Inc',
    contactEmail: 'sales@cloudtech.com',
    contactPhone: '+1 555 123 4567',
    address: '1234 Tech Street, San Francisco, CA, USA',
    category: 'cloud',
    status: 'active',
    contractStart: '2022-06-01',
    contractEnd: '2024-05-31',
    riskAssessment: 'medium',
    complianceStatus: 'compliant',
    lastAudit: '2024-03-20',
    website: 'https://cloudtech.com',
    description: 'Servicios de infraestructura en la nube',
    services: ['Cloud Infrastructure', 'Data Storage', 'Backup Services'],
    createdAt: '2022-06-01T09:00:00Z',
    updatedAt: '2024-03-20T10:15:00Z'
  },
  {
    id: 'vnd-003',
    name: 'DataFlow Analytics',
    contactEmail: 'info@dataflow.com',
    contactPhone: '+44 20 7946 0958',
    address: '45 London Bridge Street, London, UK',
    category: 'software',
    status: 'under-review',
    contractStart: '2024-01-15',
    contractEnd: '2026-01-15',
    riskAssessment: 'high',
    complianceStatus: 'pending',
    lastAudit: '2024-01-15',
    website: 'https://dataflow.com',
    description: 'Plataforma de análisis de datos empresariales',
    services: ['Data Analytics', 'Business Intelligence', 'Machine Learning'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  }
];

// Datos semilla para sistemas
const systems: System[] = [
  {
    id: 'sys-001',
    name: 'Customer Relationship Management',
    description: 'Sistema principal de gestión de clientes',
    category: 'application',
    status: 'active',
    criticality: 'high',
    owner: 'María Rodríguez',
    technicalContact: 'Pedro Martín',
    environment: 'production',
    dataClassification: 'confidential',
    lastPatched: '2024-08-30',
    lastAssessment: '2024-07-15',
    vulnerabilities: 2,
    complianceFrameworks: ['ISO 27001', 'SOX'],
    businessProcesses: ['Customer Management', 'Sales Process'],
    dependencies: ['sys-002', 'sys-003'],
    version: '2.4.1',
    vendor: 'CloudTech Inc',
    location: 'Madrid Data Center',
    createdAt: '2022-03-15T09:00:00Z',
    updatedAt: '2024-08-30T16:20:00Z'
  },
  {
    id: 'sys-002',
    name: 'Financial Reporting System',
    description: 'Sistema de reportes financieros y contabilidad',
    category: 'application',
    status: 'active',
    criticality: 'critical',
    owner: 'Ana García',
    technicalContact: 'Carlos López',
    environment: 'production',
    dataClassification: 'restricted',
    lastPatched: '2024-09-01',
    lastAssessment: '2024-08-01',
    vulnerabilities: 0,
    complianceFrameworks: ['SOX', 'GDPR'],
    businessProcesses: ['Financial Reporting', 'Accounting'],
    dependencies: ['sys-003'],
    version: '3.1.2',
    location: 'Madrid Data Center',
    createdAt: '2021-01-10T09:00:00Z',
    updatedAt: '2024-09-01T12:45:00Z'
  }
];

// Datos semilla para activos
const assets: Asset[] = [
  {
    id: 'ast-001',
    name: 'Database Server - Primary',
    description: 'Servidor principal de base de datos para aplicaciones críticas',
    category: 'hardware',
    status: 'active',
    value: 25000,
    owner: 'Pedro Martín',
    custodian: 'María Rodríguez',
    location: 'Madrid Data Center - Rack A1',
    dataClassification: 'restricted',
    criticality: 'critical',
    serialNumber: 'SRV-2023-001',
    model: 'Dell PowerEdge R750',
    manufacturer: 'Dell Technologies',
    purchaseDate: '2023-02-15',
    warrantyEnd: '2026-02-15',
    lastInventory: '2024-08-30',
    riskLevel: 'medium',
    securityControls: ['Physical Access Control', 'Encryption at Rest', 'Network Segmentation'],
    complianceRequirements: ['ISO 27001', 'SOX'],
    createdAt: '2023-02-15T09:00:00Z',
    updatedAt: '2024-08-30T14:15:00Z'
  },
  {
    id: 'ast-002',
    name: 'Customer Database',
    description: 'Base de datos que contiene información personal de clientes',
    category: 'data',
    status: 'active',
    owner: 'Ana García',
    custodian: 'María Rodríguez',
    location: 'Madrid Data Center',
    dataClassification: 'restricted',
    criticality: 'high',
    lastInventory: '2024-09-01',
    riskLevel: 'high',
    securityControls: ['Database Encryption', 'Access Controls', 'Data Masking'],
    complianceRequirements: ['GDPR', 'LOPD'],
    createdAt: '2022-01-15T09:00:00Z',
    updatedAt: '2024-09-01T11:30:00Z'
  }
];

// Datos semilla para tareas
const tasks: Task[] = [
  {
    id: 'tsk-001',
    title: 'Quarterly Risk Assessment Review',
    description: 'Revisar y actualizar todas las evaluaciones de riesgo del trimestre',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Ana García',
    reporter: 'Carlos López',
    dueDate: '2024-09-30',
    createdAt: '2024-09-01T09:00:00Z',
    updatedAt: '2024-09-05T14:30:00Z',
    category: 'risk-management',
    tags: ['quarterly', 'risk-assessment', 'compliance'],
    progress: 37
  },
  {
    id: 'tsk-002',
    title: 'Security Awareness Training',
    description: 'Completar el módulo de capacitación en concienciación de seguridad',
    status: 'pending',
    priority: 'medium',
    assignee: 'María Rodríguez',
    reporter: 'Pedro Martín',
    dueDate: '2024-09-15',
    createdAt: '2024-09-02T10:00:00Z',
    updatedAt: '2024-09-02T10:00:00Z',
    category: 'training',
    tags: ['security', 'training', 'mandatory'],
    progress: 0
  },
  {
    id: 'tsk-003',
    title: 'GDPR Compliance Audit',
    description: 'Realizar auditoría de cumplimiento GDPR en sistemas de gestión de datos',
    status: 'completed',
    priority: 'critical',
    assignee: 'Ana García',
    reporter: 'Carlos López',
    dueDate: '2024-08-31',
    createdAt: '2024-08-01T09:00:00Z',
    updatedAt: '2024-08-31T16:45:00Z',
    completedAt: '2024-08-31T16:45:00Z',
    category: 'audit',
    tags: ['gdpr', 'compliance', 'audit'],
    progress: 100
  }
];

// Exportar todos los datos semilla
export const seedData = {
  employees,
  vendors,
  systems,
  assets,
  tasks,
  risks: [], // Placeholder por ahora
  controls: [], // Placeholder por ahora
  incidents: [], // Placeholder por ahora
  policies: [], // Placeholder por ahora
  evidence: [] // Placeholder por ahora
};