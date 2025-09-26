// backend/src/server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File path for data persistence
const DATA_FILE = path.join(__dirname, 'employees-data.json');

// Initial mock data
const initialEmployees = [
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

// Load or initialize data
let employees: any[] = [];

const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      employees = JSON.parse(data);
      console.log(`📂 Loaded ${employees.length} employees from file`);
    } else {
      employees = [...initialEmployees];
      saveData();
      console.log(`📝 Initialized with ${employees.length} default employees`);
    }
  } catch (error) {
    console.error('Error loading data:', error);
    employees = [...initialEmployees];
  }
};

const saveData = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(employees, null, 2));
    console.log(`💾 Saved ${employees.length} employees to file`);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Load data on startup
loadData();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    employeesCount: employees.length 
  });
});

// Employee endpoints
app.get('/api/employees', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string)?.toLowerCase() || '';
  const department = req.query.department as string || '';
  const status = req.query.status as string || '';

  // Filter employees
  let filteredEmployees = [...employees];
  
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
  const employee = employees.find(emp => emp.id === req.params.id);
  
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.post('/api/employees', (req, res) => {
  // Generate new ID
  const maxId = employees.reduce((max, emp) => {
    const id = parseInt(emp.id);
    return id > max ? id : max;
  }, 0);
  
  const newEmployee = {
    id: String(maxId + 1),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  employees.push(newEmployee);
  saveData(); // Persist to file
  
  console.log(`✅ Created employee: ${newEmployee.firstName} ${newEmployee.lastName}`);
  res.status(201).json(newEmployee);
});

app.put('/api/employees/:id', (req, res) => {
  const index = employees.findIndex(emp => emp.id === req.params.id);
  
  if (index !== -1) {
    employees[index] = {
      ...employees[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    saveData(); // Persist to file
    
    console.log(`✏️ Updated employee: ${employees[index].firstName} ${employees[index].lastName}`);
    res.json(employees[index]);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  const index = employees.findIndex(emp => emp.id === req.params.id);
  
  if (index !== -1) {
    const deleted = employees.splice(index, 1)[0];
    saveData(); // Persist to file
    
    console.log(`🗑️ Deleted employee: ${deleted.firstName} ${deleted.lastName}`);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

// Reset data endpoint (for development)
app.post('/api/reset-data', (req, res) => {
  employees = [...initialEmployees];
  saveData();
  console.log('🔄 Data reset to initial state');
  res.json({ message: 'Data reset successfully', count: employees.length });
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
  console.log(`💾 Data persistence: Enabled (${DATA_FILE})`);
  console.log(`🔄 Reset data: POST http://localhost:${PORT}/api/reset-data`);
});

export default app;