export interface Policy {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'privacy' | 'hr' | 'it' | 'financial' | 'operational' | 'compliance';
  status: 'draft' | 'under-review' | 'approved' | 'active' | 'archived' | 'superseded';
  version: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}