export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user' | 'auditor' | 'readonly';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}