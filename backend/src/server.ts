// backend/src/server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mock Employee Data
const mockEmployees = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 555-0100',
    position: 'Senior Developer',
    department: 'IT',
    location: 'New York, USA',
    startDate: '2023-01-15',
    status: 'active',
    skills: ['JavaScript', 'React', 'Node.js'],
    clearanceLevel: 'CONFIDENTIAL',
    notes: 'Team lead for Project X',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1 555-0101',
    position: 'Product Manager',
    department: 'Operations',
    location: 'San Francisco, USA',
    startDate: '2022-06-01',
    status: 'active',
    skills: ['Product Strategy', 'Agile', 'Data Analysis'],
    clearanceLevel: 'SECRET',
    createdAt: '2022-06-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1 555-0102',
    position: 'DevOps Engineer',
    department: 'IT',
    location: 'Austin, USA',
    startDate: '2021-03-10',
    status: 'active',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    clearanceLevel: 'SECRET',
    createdAt: '2021-03-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@company.com',
    phone: '+1 555-0103',
    position: 'HR Manager',
    department: 'Human Resources',
    location: 'Chicago, USA',
    startDate: '2020-11-01',
    status: 'active',
    skills: ['Recruitment', 'Employee Relations', 'HRIS'],
    clearanceLevel: 'CONFIDENTIAL',
    createdAt: '2020-11-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '5',
    employeeId: 'EMP005',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@company.com',
    phone: '+1 555-0104',
    position: 'Financial Analyst',
    department: 'Finance',
    location: 'Boston, USA',
    startDate: '2023-07-15',
    status: 'active',
    skills: ['Financial Modeling', 'Excel', 'SAP'],
    clearanceLevel: 'CONFIDENTIAL',
    createdAt: '2023-07-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Employee endpoints
app.get('/api/employees', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string)?.toLowerCase() || '';
  const department = req.query.department as string || '';
  const status = req.query.status as string || '';

  // Filter employees
  let filteredEmployees = [...mockEmployees];
  
  if (search) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.firstName.toLowerCase().includes(search) ||
      emp.lastName.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search) ||
      emp.employeeId.toLowerCase().includes(search)
    );
  }

  if (department) {
    filteredEmployees = filteredEmployees.filter(emp => emp.department === department);
  }

  if (status) {
    filteredEmployees = filteredEmployees.filter(emp => emp.status === status);
  }

  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  res.json({
    data: paginatedEmployees,
    total: filteredEmployees.length,
    page,
    limit,
    totalPages: Math.ceil(filteredEmployees.length / limit)
  });
});

app.get('/api/employees/:id', (req, res) => {
  const employee = mockEmployees.find(emp => emp.id === req.params.id);
  
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.post('/api/employees', (req, res) => {
  const newEmployee = {
    id: String(mockEmployees.length + 1),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockEmployees.push(newEmployee);
  res.status(201).json(newEmployee);
});

app.put('/api/employees/:id', (req, res) => {
  const index = mockEmployees.findIndex(emp => emp.id === req.params.id);
  
  if (index !== -1) {
    mockEmployees[index] = {
      ...mockEmployees[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    res.json(mockEmployees[index]);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  const index = mockEmployees.findIndex(emp => emp.id === req.params.id);
  
  if (index !== -1) {
    mockEmployees.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

// Catch all route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Employees API: http://localhost:${PORT}/api/employees`);
});

export default app;