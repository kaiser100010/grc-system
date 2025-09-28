import { PrismaClient, UserRole, TaskStatus, TaskPriority, RiskLevel, RiskStatus, ControlType, ControlStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.activity.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.task.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.control.deleteMany();
  await prisma.risk.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.system.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@grcsystem.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Sistema',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  const riskManager = await prisma.user.create({
    data: {
      email: 'risk.manager@grcsystem.com',
      password: userPassword,
      firstName: 'Carlos',
      lastName: 'Riesgos',
      role: UserRole.RISK_MANAGER,
      emailVerified: true,
    },
  });

  const complianceOfficer = await prisma.user.create({
    data: {
      email: 'compliance@grcsystem.com',
      password: userPassword,
      firstName: 'Ana',
      lastName: 'Cumplimiento',
      role: UserRole.COMPLIANCE_OFFICER,
      emailVerified: true,
    },
  });

  console.log('✅ Usuarios creados');

  // Crear empleados - 6 EMPLEADOS COMPLETOS
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        employeeId: 'EMP001',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@empresa.com',
        department: 'IT',
        position: 'Desarrollador Senior',
        status: 'ACTIVE',
        startDate: new Date('2022-01-15'),
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP002',
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@empresa.com',
        department: 'Finanzas',
        position: 'Analista Financiero',
        status: 'ACTIVE',
        startDate: new Date('2021-06-01'),
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP003',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@empresa.com',
        department: 'Recursos Humanos',
        position: 'Gerente de RRHH',
        status: 'ACTIVE',
        startDate: new Date('2020-03-10'),
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP004',
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@empresa.com',
        department: 'Legal',
        position: 'Abogada Senior',
        status: 'ACTIVE',
        startDate: new Date('2021-09-15'),
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP005',
        firstName: 'Luis',
        lastName: 'Sánchez',
        email: 'luis.sanchez@empresa.com',
        department: 'IT',
        position: 'Administrador de Sistemas',
        status: 'ACTIVE',
        startDate: new Date('2019-11-20'),
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP006',
        firstName: 'Laura',
        lastName: 'Torres',
        email: 'laura.torres@empresa.com',
        department: 'Operaciones',
        position: 'Jefe de Operaciones',
        status: 'ON_LEAVE',
        startDate: new Date('2020-07-01'),
      },
    }),
  ]);

  console.log(`✅ Empleados creados (${employees.length} empleados)`);

  // Crear vendors
  const vendor = await prisma.vendor.create({
    data: {
      name: 'Cloud Provider Inc.',
      contactName: 'John Smith',
      contactEmail: 'john@cloudprovider.com',
      contactPhone: '+1-555-0100',
      website: 'https://cloudprovider.com',
      riskLevel: 'MEDIUM',
      status: 'ACTIVE',
      lastAssessment: new Date('2024-01-15'),
      nextAssessment: new Date('2025-01-15'),
    },
  });

  console.log('✅ Vendors creados');

  // Crear sistemas
  const system = await prisma.system.create({
    data: {
      name: 'Sistema ERP',
      description: 'Sistema principal de gestión empresarial',
      criticality: 'CRITICAL',
      environment: 'Production',
      dataTypes: ['financial', 'personal', 'operational'],
      vendorId: vendor.id,
    },
  });

  console.log('✅ Sistemas creados');

  // Crear activos
  const asset = await prisma.asset.create({
    data: {
      name: 'Servidor Principal DB',
      description: 'Servidor de base de datos principal',
      type: 'HARDWARE',
      serialNumber: 'SRV-2024-001',
      location: 'Data Center Principal',
      value: 50000,
      systemId: system.id,
    },
  });

  console.log('✅ Activos creados');

  // Crear riesgos
  const risks = await Promise.all([
    prisma.risk.create({
      data: {
        title: 'Fuga de Datos Sensibles',
        description: 'Riesgo de exposición no autorizada de información confidencial de clientes',
        level: RiskLevel.HIGH,
        status: RiskStatus.ASSESSED,
        likelihood: 3,
        impact: 5,
        riskScore: 15,
        residualRisk: 10,
        targetRisk: 5,
        ownerId: riskManager.id,
        creatorId: adminUser.id,
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Interrupción del Servicio',
        description: 'Posible caída del sistema principal que afecte la continuidad del negocio',
        level: RiskLevel.MEDIUM,
        status: RiskStatus.IDENTIFIED,
        likelihood: 2,
        impact: 4,
        riskScore: 8,
        ownerId: riskManager.id,
        creatorId: riskManager.id,
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Incumplimiento Normativo GDPR',
        description: 'Riesgo de no cumplir con los requisitos de protección de datos',
        level: RiskLevel.HIGH,
        status: RiskStatus.MITIGATED,
        likelihood: 2,
        impact: 5,
        riskScore: 10,
        residualRisk: 5,
        targetRisk: 3,
        ownerId: complianceOfficer.id,
        creatorId: complianceOfficer.id,
      },
    }),
  ]);

  console.log('✅ Riesgos creados');

  // Crear controles
  const controls = await Promise.all([
    prisma.control.create({
      data: {
        title: 'Cifrado de Datos en Reposo',
        description: 'Implementación de cifrado AES-256 para todos los datos almacenados',
        type: ControlType.PREVENTIVE,
        status: ControlStatus.IMPLEMENTED,
        framework: 'ISO 27001',
        reference: 'A.8.24',
        effectiveness: 95,
        implementationDate: new Date('2024-01-01'),
        lastTestDate: new Date('2024-08-01'),
        nextTestDate: new Date('2025-02-01'),
        ownerId: complianceOfficer.id,
        risks: {
          connect: [{ id: risks[0].id }],
        },
      },
    }),
    prisma.control.create({
      data: {
        title: 'Backup Automático Diario',
        description: 'Sistema de respaldo automático con replicación geográfica',
        type: ControlType.CORRECTIVE,
        status: ControlStatus.IMPLEMENTED,
        framework: 'NIST',
        reference: 'CP-9',
        effectiveness: 98,
        implementationDate: new Date('2023-06-01'),
        lastTestDate: new Date('2024-09-01'),
        nextTestDate: new Date('2024-12-01'),
        ownerId: riskManager.id,
        risks: {
          connect: [{ id: risks[1].id }],
        },
      },
    }),
  ]);

  console.log('✅ Controles creados');

  // Crear tareas
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Revisar Política de Seguridad',
        description: 'Actualizar la política de seguridad de la información según los nuevos requisitos',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2024-10-15'),
        progress: 60,
        assigneeId: complianceOfficer.id,
        creatorId: adminUser.id,
        riskId: risks[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Prueba de Recuperación ante Desastres',
        description: 'Ejecutar simulacro completo del plan de continuidad del negocio',
        status: TaskStatus.PENDING,
        priority: TaskPriority.CRITICAL,
        dueDate: new Date('2024-10-30'),
        startDate: new Date('2024-10-25'),
        progress: 0,
        assigneeId: riskManager.id,
        creatorId: adminUser.id,
        controlId: controls[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Auditoría de Accesos',
        description: 'Revisar y validar todos los accesos a sistemas críticos',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date('2024-11-01'),
        progress: 0,
        assigneeId: complianceOfficer.id,
        creatorId: riskManager.id,
      },
    }),
  ]);

  console.log('✅ Tareas creadas');

  // Crear políticas
  const policies = await Promise.all([
    prisma.policy.create({
      data: {
        title: 'Política de Seguridad de la Información',
        description: 'Política general que establece los lineamientos de seguridad de la información',
        version: '2.0',
        status: 'ACTIVE',
        effectiveDate: new Date('2024-01-01'),
        reviewDate: new Date('2024-07-01'),
        nextReviewDate: new Date('2025-01-01'),
        content: 'https://docs.empresa.com/politicas/seguridad-informacion-v2.pdf',
        authorId: complianceOfficer.id,
      },
    }),
    prisma.policy.create({
      data: {
        title: 'Política de Gestión de Riesgos',
        description: 'Define el proceso de identificación, evaluación y tratamiento de riesgos',
        version: '1.5',
        status: 'UNDER_REVIEW',
        effectiveDate: new Date('2023-06-01'),
        reviewDate: new Date('2024-09-01'),
        nextReviewDate: new Date('2024-12-01'),
        content: 'https://docs.empresa.com/politicas/gestion-riesgos-v1.5.pdf',
        authorId: riskManager.id,
      },
    }),
  ]);

  console.log('✅ Políticas creadas');

  // Crear incidentes
  const incident = await prisma.incident.create({
    data: {
      title: 'Intento de Acceso No Autorizado',
      description: 'Se detectaron múltiples intentos de acceso fallidos desde una IP sospechosa',
      severity: 'MEDIUM',
      status: 'RESOLVED',
      detectedDate: new Date('2024-09-15T10:30:00'),
      resolvedDate: new Date('2024-09-15T14:45:00'),
      rootCause: 'Ataque de fuerza bruta desde IP externa',
      impact: 'No se logró acceso. Sistema de prevención funcionó correctamente.',
      resolution: 'IP bloqueada. Políticas de firewall actualizadas.',
      lessonsLearned: 'Implementar rate limiting más agresivo para intentos de login',
      reporterId: complianceOfficer.id,
      assigneeId: riskManager.id,
      risks: {
        connect: [{ id: risks[0].id }],
      },
    },
  });

  console.log('✅ Incidentes creados');

  // Crear algunas actividades de ejemplo
  await prisma.activity.createMany({
    data: [
      {
        action: 'CREATE',
        entityType: 'RISK',
        entityId: risks[0].id,
        userId: adminUser.id,
        details: { message: 'Riesgo inicial creado' },
      },
      {
        action: 'UPDATE',
        entityType: 'TASK',
        entityId: tasks[0].id,
        userId: complianceOfficer.id,
        details: { message: 'Progreso actualizado a 60%' },
      },
      {
        action: 'CREATE',
        entityType: 'INCIDENT',
        entityId: incident.id,
        userId: complianceOfficer.id,
        details: { message: 'Incidente reportado' },
      },
    ],
  });

  console.log('✅ Actividades creadas');

  // Mostrar resumen final
  const totalEmployees = await prisma.employee.count();
  const totalUsers = await prisma.user.count();
  const totalRisks = await prisma.risk.count();
  const totalTasks = await prisma.task.count();

  console.log('');
  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('📊 Resumen de datos creados:');
  console.log(`   - ${totalUsers} usuarios`);
  console.log(`   - ${totalEmployees} empleados`);
  console.log(`   - ${totalRisks} riesgos`);
  console.log(`   - ${totalTasks} tareas`);
  console.log('');
  console.log('📧 Usuarios creados:');
  console.log('   Admin: admin@grcsystem.com / admin123');
  console.log('   Risk Manager: risk.manager@grcsystem.com / user123');
  console.log('   Compliance Officer: compliance@grcsystem.com / user123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error en seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });