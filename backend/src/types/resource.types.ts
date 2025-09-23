// Employee Types
export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED'
}

export enum Department {
  IT = 'IT',
  HR = 'HR',
  FINANCE = 'FINANCE',
  OPERATIONS = 'OPERATIONS',
  LEGAL = 'LEGAL',
  SECURITY = 'SECURITY',
  COMPLIANCE = 'COMPLIANCE'
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  phone?: string;
  position: string;
  department: Department;
  location: string;
  startDate: string;
  endDate?: string;
  managerId?: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
  };
  status: EmployeeStatus;
  skills?: string[];
  clearanceLevel?: 'NONE' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}