// src/types/task.types.ts

export interface Task {
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
  attachments?: string[];
  comments?: TaskComment[];
  relatedItems?: RelatedItem[];
  estimatedHours?: number;
  actualHours?: number;
  progress?: number; // 0-100
  dependencies?: string[]; // Task IDs
  recurringSchedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    interval: number;
    endDate?: string;
  };
}

export interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  content: string;
  createdAt: string;
  isInternal?: boolean;
}

export interface RelatedItem {
  id: string;
  type: 'risk' | 'control' | 'incident' | 'policy' | 'evidence' | 'asset' | 'system';
  title: string;
}