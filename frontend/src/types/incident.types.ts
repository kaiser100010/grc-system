export interface Incident {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'privacy' | 'operational' | 'compliance' | 'safety' | 'financial' | 'reputation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reporter: string;
  discoveryDate: string;
  reportedDate: string;
  createdAt: string;
  updatedAt: string;
}