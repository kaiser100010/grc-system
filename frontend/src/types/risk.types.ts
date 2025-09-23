// src/types/risk.types.ts

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  type: RiskType;
  status: RiskStatus;
  owner: string; // Employee ID
  probability: RiskLevel;
  impact: RiskLevel;
  riskScore: number; // Calculated: probability * impact
  inherentRisk: number;
  residualRisk: number;
  tolerance: RiskTolerance;
  
  // Fechas
  identifiedDate: string;
  lastReviewDate: string;
  nextReviewDate: string;
  
  // Relaciones
  affectedAssets: string[]; // Asset IDs
  affectedSystems: string[]; // System IDs
  relatedControls: string[]; // Control IDs (cuando implementemos)
  
  // Evaluación
  likelihood: string;
  consequences: string;
  riskFactors: string[];
  
  // Mitigación
  mitigationPlan: string;
  mitigationActions: RiskAction[];
  currentControls: string;
  additionalControls: string;
  
  // Seguimiento
  treatment: RiskTreatment;
  progress: number; // 0-100%
  priority: Priority;
  tags: string[];
  
  // Auditoría
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  
  // Comentarios y archivos
  comments: RiskComment[];
  attachments: string[];
}

export interface RiskAction {
  id: string;
  description: string;
  responsible: string; // Employee ID
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  notes: string;
}

export interface RiskComment {
  id: string;
  text: string;
  author: string; // Employee ID
  timestamp: string;
  type: 'comment' | 'status-change' | 'review';
}

export type RiskCategory = 
  | 'operational' 
  | 'financial' 
  | 'strategic' 
  | 'compliance' 
  | 'reputational' 
  | 'technology' 
  | 'security' 
  | 'environmental' 
  | 'legal';

export type RiskType = 
  | 'internal' 
  | 'external' 
  | 'project' 
  | 'business-process' 
  | 'regulatory' 
  | 'market' 
  | 'credit' 
  | 'liquidity';

export type RiskStatus = 
  | 'identified' 
  | 'assessed' 
  | 'treatment-planned' 
  | 'treatment-implemented' 
  | 'monitoring' 
  | 'closed' 
  | 'transferred';

export type RiskLevel = 1 | 2 | 3 | 4 | 5;

export type RiskTolerance = 'low' | 'medium' | 'high';

export type RiskTreatment = 
  | 'accept' 
  | 'mitigate' 
  | 'transfer' 
  | 'avoid';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface RiskFilters {
  search: string;
  category: RiskCategory | 'all';
  status: RiskStatus | 'all';
  priority: Priority | 'all';
  owner: string | 'all';
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'all';
  treatment: RiskTreatment | 'all';
}

export interface RiskStats {
  total: number;
  byStatus: Record<RiskStatus, number>;
  byCategory: Record<RiskCategory, number>;
  byPriority: Record<Priority, number>;
  byRiskLevel: Record<string, number>;
  averageScore: number;
  highRisks: number;
  overdue: number;
}

export interface RiskMatrixData {
  probability: RiskLevel;
  impact: RiskLevel;
  risks: Risk[];
  level: 'low' | 'medium' | 'high' | 'critical';
}

// Constantes para etiquetas y opciones
export const RISK_CATEGORIES = [
  { value: 'operational', label: 'Operacional', color: 'bg-blue-100 text-blue-800' },
  { value: 'financial', label: 'Financiero', color: 'bg-green-100 text-green-800' },
  { value: 'strategic', label: 'Estratégico', color: 'bg-purple-100 text-purple-800' },
  { value: 'compliance', label: 'Cumplimiento', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'reputational', label: 'Reputacional', color: 'bg-red-100 text-red-800' },
  { value: 'technology', label: 'Tecnológico', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'security', label: 'Seguridad', color: 'bg-gray-100 text-gray-800' },
  { value: 'environmental', label: 'Ambiental', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'legal', label: 'Legal', color: 'bg-orange-100 text-orange-800' }
] as const;

export const RISK_STATUSES = [
  { value: 'identified', label: 'Identificado', color: 'bg-gray-100 text-gray-800' },
  { value: 'assessed', label: 'Evaluado', color: 'bg-blue-100 text-blue-800' },
  { value: 'treatment-planned', label: 'Plan de Tratamiento', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'treatment-implemented', label: 'Tratamiento Implementado', color: 'bg-orange-100 text-orange-800' },
  { value: 'monitoring', label: 'Monitoreo', color: 'bg-purple-100 text-purple-800' },
  { value: 'closed', label: 'Cerrado', color: 'bg-green-100 text-green-800' },
  { value: 'transferred', label: 'Transferido', color: 'bg-indigo-100 text-indigo-800' }
] as const;

export const RISK_TREATMENTS = [
  { value: 'accept', label: 'Aceptar', color: 'bg-green-100 text-green-800' },
  { value: 'mitigate', label: 'Mitigar', color: 'bg-blue-100 text-blue-800' },
  { value: 'transfer', label: 'Transferir', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'avoid', label: 'Evitar', color: 'bg-red-100 text-red-800' }
] as const;

export const RISK_LEVELS = [
  { value: 1, label: 'Muy Bajo' },
  { value: 2, label: 'Bajo' },
  { value: 3, label: 'Medio' },
  { value: 4, label: 'Alto' },
  { value: 5, label: 'Muy Alto' }
] as const;

export const PRIORITIES = [
  { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Crítica', color: 'bg-red-100 text-red-800' }
] as const;