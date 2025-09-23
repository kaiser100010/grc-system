export interface Control {
  id: string;
  title: string;
  description: string;
  category: 'preventive' | 'detective' | 'corrective' | 'administrative' | 'technical' | 'physical';
  type: 'manual' | 'automated' | 'hybrid';
  effectiveness: 'not-effective' | 'partially-effective' | 'effective' | 'highly-effective';
  status: 'active' | 'inactive' | 'under-review' | 'deprecated';
  owner: string;
  createdAt: string;
  updatedAt: string;
}