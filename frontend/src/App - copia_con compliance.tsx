// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAppStore from './store/appStore';

// Layout
import Layout from './components/common/Layout/Layout';

// Pages
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './components/modules/dashboard/DashboardPage';
import RisksPage from './components/modules/risks/RisksPage';
import ControlsPage from './components/modules/controls/ControlsPage';
import TasksPage from './components/modules/tasks/TasksPage';
import IncidentsPage from './components/modules/incidents/IncidentsPage';
import PoliciesPage from './components/modules/policies/PoliciesPage';
import EvidencePage from './components/modules/evidence/EvidencePage';
import EmployeesPage from './components/modules/resources/employees/EmployeesPage';
import VendorsPage from './components/modules/resources/vendors/VendorsPage';
import SystemsPage from './components/modules/resources/systems/SystemsPage';
import AssetsPage from './components/modules/resources/assets/AssetsPage';
import ReportsPage from './components/modules/reports/ReportsPage';
import SettingsPage from './components/modules/settings/SettingsPage';
//import ProfilePage from './components/modules/profile/ProfilePage';
//import NotificationsPage from './components/modules/notifications/NotificationsPage';
//import CompliancePage from './components/modules/compliance/CompliancePage';
//import AuditsPage from './components/modules/audits/AuditsPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Public Route Component (redirects to dashboard if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { user, addEmployee, addRisk, addControl, addTask, addIncident, addPolicy, addVendor, addSystem, addAsset } = useAppStore();

  // Initialize with sample data on first load
  useEffect(() => {
    const initializeData = () => {
      // Check if data already exists
      const hasData = localStorage.getItem('grc-system-storage');
      if (hasData) return;

      // Add sample employees
      const sampleEmployees = [
        { id: '1', name: 'Ana Rodríguez', email: 'ana@empresa.com', role: 'Risk Manager', department: 'Risk Management', status: 'active' as const },
        { id: '2', name: 'Carlos López', email: 'carlos@empresa.com', role: 'Compliance Officer', department: 'Compliance', status: 'active' as const },
        { id: '3', name: 'María García', email: 'maria@empresa.com', role: 'Security Lead', department: 'IT Security', status: 'active' as const },
        { id: '4', name: 'Luis Martínez', email: 'luis@empresa.com', role: 'Auditor', department: 'Internal Audit', status: 'active' as const },
        { id: '5', name: 'Carmen Silva', email: 'carmen@empresa.com', role: 'Operations Manager', department: 'Operations', status: 'active' as const }
      ];

      sampleEmployees.forEach(emp => addEmployee(emp));

      // Add sample risks
      const sampleRisks = [
        {
          id: '1',
          title: 'Fuga de datos sensibles',
          description: 'Riesgo de exposición de información confidencial de clientes',
          category: 'seguridad',
          owner: '3',
          ownerName: 'María García',
          probability: 4,
          impact: 5,
          score: 20,
          level: 'crítico',
          priority: 'crítica',
          status: 'en_tratamiento',
          treatment: 'mitigar',
          currentControls: 'Firewall, IDS/IPS, Encriptación',
          mitigationPlan: 'Implementar DLP, auditoría de seguridad',
          progress: 65,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Incumplimiento regulatorio GDPR',
          description: 'Riesgo de no cumplir con requisitos de protección de datos',
          category: 'cumplimiento',
          owner: '2',
          ownerName: 'Carlos López',
          probability: 3,
          impact: 4,
          score: 12,
          level: 'alto',
          priority: 'alta',
          status: 'evaluado',
          treatment: 'mitigar',
          currentControls: 'Políticas de privacidad',
          mitigationPlan: 'Auditoría GDPR, actualización de procesos',
          progress: 40,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      sampleRisks.forEach(risk => addRisk(risk));

      // Add sample controls
      const sampleControls = [
        {
          id: '1',
          title: 'Control de Acceso',
          description: 'Gestión de identidades y accesos a sistemas críticos',
          framework: 'ISO 27001',
          category: 'Acceso',
          owner: '3',
          ownerName: 'María García',
          status: 'implemented' as const,
          effectiveness: 85,
          testFrequency: 'Mensual',
          lastTestDate: new Date(),
          nextTestDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Backup y Recuperación',
          description: 'Respaldo periódico de datos críticos',
          framework: 'ISO 27001',
          category: 'Continuidad',
          owner: '5',
          ownerName: 'Carmen Silva',
          status: 'partially_implemented' as const,
          effectiveness: 70,
          testFrequency: 'Trimestral',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      sampleControls.forEach(control => addControl(control));

      // Add sample tasks
      const sampleTasks = [
        {
          id: '1',
          title: 'Revisión de políticas de seguridad',
          description: 'Actualizar políticas según nuevos requisitos',
          assignee: '3',
          assigneeName: 'María García',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 'high' as const,
          status: 'in_progress' as const,
          category: 'Políticas',
          progress: 60,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Auditoría de accesos',
          description: 'Revisar permisos de usuarios en sistemas críticos',
          assignee: '4',
          assigneeName: 'Luis Martínez',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          priority: 'medium' as const,
          status: 'pending' as const,
          category: 'Auditoría',
          progress: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      sampleTasks.forEach(task => addTask(task));

      // Add sample incidents
      const sampleIncidents = [
        {
          id: '1',
          title: 'Intento de acceso no autorizado',
          description: 'Detectado intento de acceso a servidor de producción',
          severity: 'high' as const,
          status: 'investigating' as const,
          reporter: '3',
          reporterName: 'María García',
          assignee: '3',
          assigneeName: 'María García',
          category: 'Seguridad',
          detectionDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      sampleIncidents.forEach(incident => addIncident(incident));

      // Add sample policies
      const samplePolicies = [
        {
          id: '1',
          title: 'Política de Seguridad de la Información',
          description: 'Política general de seguridad para toda la organización',
          version: '2.0',
          category: 'Seguridad',
          owner: '3',
          ownerName: 'María García',
          status: 'published' as const,
          effectiveDate: new Date(),
          nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          approvers: ['1', '2'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      samplePolicies.forEach(policy => addPolicy(policy));

      // Add sample vendors
      const sampleVendors = [
        {
          id: '1',
          name: 'CloudTech Solutions',
          description: 'Proveedor de servicios cloud',
          category: 'Tecnología',
          contactName: 'Juan Pérez',
          contactEmail: 'juan@cloudtech.com',
          contactPhone: '+34 900 123 456',
          criticality: 'high' as const,
          riskScore: 75,
          status: 'active' as const,
          contractStartDate: new Date(),
          contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      sampleVendors.forEach(vendor => addVendor(vendor));

      // Add sample systems
      const sampleSystems = [
        {
          id: '1',
          name: 'ERP Principal',
          description: 'Sistema de gestión empresarial',
          type: 'ERP',
          owner: '5',
          ownerName: 'Carmen Silva',
          criticality: 'critical' as const,
          status: 'operational' as const,
          dataClassification: 'Confidencial',
          hosting: 'cloud' as const,
          vendor: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      sampleSystems.forEach(system => addSystem(system));

      // Add sample assets
      const sampleAssets = [
        {
          id: '1',
          name: 'Servidor Base de Datos',
          description: 'Servidor principal de base de datos Oracle',
          type: 'Hardware',
          category: 'Infraestructura',
          owner: '3',
          ownerName: 'María García',
          location: 'Centro de Datos Principal',
          value: 50000,
          criticality: 'critical' as const,
          status: 'active' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      sampleAssets.forEach(asset => addAsset(asset));
    };

    initializeData();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Default redirect */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Main Routes */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="risks" element={<RisksPage />} />
          <Route path="controls" element={<ControlsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="evidence" element={<EvidencePage />} />
//          <Route path="compliance" element={<CompliancePage />} />
//          <Route path="audits" element={<AuditsPage />} />
          
          {/* Resources Routes */}
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="systems" element={<SystemsPage />} />
          <Route path="assets" element={<AssetsPage />} />
          
          {/* Other Routes */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
              <a href="/dashboard" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Volver al Dashboard
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;