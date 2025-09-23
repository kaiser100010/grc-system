// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@grc.com',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@grc.com',
      firstName: 'Manager',
      lastName: 'User',
      password: await bcrypt.hash('manager123', 10),
      role: 'MANAGER',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@grc.com',
      firstName: 'Regular',
      lastName: 'User',
      password: await bcrypt.hash('user123', 10),
      role: 'USER',
    },
  });

  console.log('✅ Users created');

  // Create employees
  const ceo = await prisma.employee.create({
    data: {
      firstName: 'Carlos',
      lastName: 'Rodriguez',
      email: 'carlos.rodriguez@grc.com',
      employeeId: 'EMP001',
      phone: '+34 600 123 456',
      position: 'CEO',
      department: 'OPERATIONS',
      location: 'Madrid, España',
      startDate: new Date('2020-01-15'),
      status: 'ACTIVE',
      skills: ['Leadership', 'Strategy', 'Management'],
      clearanceLevel: 'TOP_SECRET',
      notes: 'Chief Executive Officer',
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  });

  const cto = await prisma.employee.create({
    data: {
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana.garcia@grc.com',
      employeeId: 'EMP002',
      phone: '+34 600 234 567',
      position: 'CTO',
      department: 'IT',
      location: 'Madrid, España',
      startDate: new Date('2020-03-01'),
      status: 'ACTIVE',
      skills: ['Software Architecture', 'Team Leadership', 'Cloud Technologies'],
      clearanceLevel: 'SECRET',
      managerId: ceo.id,
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  });

  const hrManager = await prisma.employee.create({
    data: {
      firstName: 'María',
      lastName: 'López',
      email: 'maria.lopez@grc.com',
      employeeId: 'EMP003',
      phone: '+34 600 345 678',
      position: 'HR Manager',
      department: 'HR',
      location: 'Madrid, España',
      startDate: new Date('2020-05-15'),
      status: 'ACTIVE',
      skills: ['Recruitment', 'Employee Relations', 'Policy Development'],
      clearanceLevel: 'CONFIDENTIAL',
      managerId: ceo.id,
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  });

  const developer1 = await prisma.employee.create({
    data: {
      firstName: 'José',
      lastName: 'Martínez',
      email: 'jose.martinez@grc.com',
      employeeId: 'EMP004',
      phone: '+34 600 456 789',
      position: 'Senior Developer',
      department: 'IT',
      location: 'Madrid, España',
      startDate: new Date('2021-01-10'),
      status: 'ACTIVE',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      clearanceLevel: 'CONFIDENTIAL',
      managerId: cto.id,
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  });

  const developer2 = await prisma.employee.create({
    data: {
      firstName: 'Laura',
      lastName: 'Fernández',
      email: 'laura.fernandez@grc.com',
      employeeId: 'EMP005',
      phone: '+34 600 567 890',
      position: 'Frontend Developer',
      department: 'IT',
      location: 'Barcelona, España',
      startDate: new Date('2021-06-01'),
      status: 'ACTIVE',
      skills: ['React', 'Vue.js', 'CSS', 'UI/UX'],
      clearanceLevel: 'NONE',
      managerId: cto.id,
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  });

  const complianceOfficer = await prisma.employee.create({
    data: {
      firstName: 'Pedro',
      lastName: 'Sánchez',
      email: 'pedro.sanchez@grc.com',
      employeeId: 'EMP006',
      phone: '+34 600 678 901',
      position: 'Compliance Officer',
      department: 'COMPLIANCE',
      location: 'Madrid, España',
      startDate: new Date('2020-09-01'),
      status: 'ACTIVE',
      skills: ['Risk Management', 'Audit', 'Regulatory Compliance'],
      clearanceLevel: 'SECRET',
      managerId: ceo.id,
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  });

  const financeManager = await prisma.employee.create({
    data: {
      firstName: 'Isabella',
      lastName: 'Torres',
      email: 'isabella.torres@grc.com',
      employeeId: 'EMP007',
      phone: '+34 600 789 012',
      position: 'Finance Manager',
      department: 'FINANCE',
      location: 'Madrid, España',
      startDate: new Date('2020-11-15'),
      status: 'ACTIVE',
      skills: ['Financial Analysis', 'Budget Planning', 'Reporting'],
      clearanceLevel: 'CONFIDENTIAL',
      managerId: ceo.id,
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  });

  // Employee on leave
  await prisma.employee.create({
    data: {
      firstName: 'Miguel',
      lastName: 'Ruiz',
      email: 'miguel.ruiz@grc.com',
      employeeId: 'EMP008',
      phone: '+34 600 890 123',
      position: 'Security Analyst',
      department: 'SECURITY',
      location: 'Valencia, España',
      startDate: new Date('2021-03-01'),
      status: 'ON_LEAVE',
      skills: ['Cybersecurity', 'Incident Response', 'SIEM'],
      clearanceLevel: 'SECRET',
      managerId: cto.id,
      notes: 'On paternity leave until end of month',
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  });

  console.log('✅ Employees created');

  // Create some sample risks
  const risk1 = await prisma.risk.create({
    data: {
      title: 'Data Breach Risk',
      description: 'Potential unauthorized access to customer data',
      category: 'TECHNOLOGY',
      likelihood: 3,
      impact: 5,
      riskLevel: 'HIGH',
      status: 'IDENTIFIED',
      riskOwner: complianceOfficer.employeeId,
      mitigationPlan: 'Implement additional security controls and monitoring',
      reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdBy: adminUser.id,
    },
  });

  const risk2 = await prisma.risk.create({
    data: {
      title: 'Regulatory Compliance Risk',
      description: 'Risk of non-compliance with GDPR regulations',
      category: 'COMPLIANCE',
      likelihood: 2,
      impact: 4,
      riskLevel: 'MEDIUM',
      status: 'ASSESSED',
      riskOwner: complianceOfficer.employeeId,
      createdBy: adminUser.id,
    },
  });

  console.log('✅ Risks created');

  // Create some sample tasks
  await prisma.task.create({
    data: {
      title: 'Implement Multi-Factor Authentication',
      description: 'Deploy MFA across all systems to enhance security',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      createdBy: adminUser.id,
      riskId: risk1.id,
      assignments: {
        create: [
          {
            employeeId: developer1.id,
          },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: 'GDPR Compliance Review',
      description: 'Review current processes for GDPR compliance',
      status: 'PENDING',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      createdBy: managerUser.id,
      riskId: risk2.id,
      assignments: {
        create: [
          {
            employeeId: complianceOfficer.id,
          },
        ],
      },
    },
  });

  console.log('✅ Tasks created');

  // Create some sample controls
  await prisma.control.create({
    data: {
      title: 'Access Control Review',
      description: 'Monthly review of user access rights',
      controlType: 'DETECTIVE',
      framework: 'ISO27001',
      frequency: 'MONTHLY',
      status: 'ACTIVE',
      effectiveness: 'EFFECTIVE',
      owner: complianceOfficer.employeeId,
      implementation: 'Automated reports generated monthly',
      lastTested: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      nextReview: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 days from now
      createdBy: adminUser.id,
      riskId: risk1.id,
    },
  });

  console.log('✅ Controls created');

  // Create vendors
  await prisma.vendor.create({
    data: {
      name: 'Microsoft Corporation',
      contactEmail: 'support@microsoft.com',
      contactPhone: '+1-800-642-7676',
      address: 'One Microsoft Way, Redmond, WA 98052',
      status: 'ACTIVE',
      riskLevel: 'LOW',
    },
  });

  await prisma.vendor.create({
    data: {
      name: 'AWS (Amazon Web Services)',
      contactEmail: 'aws-support@amazon.com',
      contactPhone: '+1-206-266-4064',
      address: '410 Terry Ave N, Seattle, WA 98109',
      status: 'ACTIVE',
      riskLevel: 'LOW',
    },
  });

  console.log('✅ Vendors created');

  // Create systems
  await prisma.system.create({
    data: {
      name: 'GRC Management System',
      description: 'Main GRC application for managing governance, risk and compliance',
      owner: cto.employeeId,
      status: 'ACTIVE',
      criticality: 'HIGH',
    },
  });

  await prisma.system.create({
    data: {
      name: 'Employee Portal',
      description: 'Internal portal for employee self-service',
      owner: hrManager.employeeId,
      status: 'ACTIVE',
      criticality: 'MEDIUM',
    },
  });

  console.log('✅ Systems created');

  // Create assets
  await prisma.asset.create({
    data: {
      name: 'Customer Database',
      type: 'DATA',
      owner: cto.employeeId,
      status: 'ACTIVE',
      value: 1000000,
      location: 'AWS EU-West-1',
    },
  });

  await prisma.asset.create({
    data: {
      name: 'Production Server Cluster',
      type: 'HARDWARE',
      owner: cto.employeeId,
      status: 'ACTIVE',
      value: 250000,
      location: 'Madrid Data Center',
    },
  });

  console.log('✅ Assets created');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('- Users: 3 (admin, manager, user)');
  console.log('- Employees: 8 (including CEO, CTO, developers, etc.)');
  console.log('- Risks: 2');
  console.log('- Tasks: 2');
  console.log('- Controls: 1');
  console.log('- Vendors: 2');
  console.log('- Systems: 2');
  console.log('- Assets: 2');
  console.log('\n🔐 Login credentials:');
  console.log('- Admin: admin@grc.com / admin123');
  console.log('- Manager: manager@grc.com / manager123');
  console.log('- User: user@grc.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });