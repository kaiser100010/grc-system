import React from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { 
  Shield, 
  BarChart3, 
  CheckSquare, 
  AlertTriangle, 
  FileText, 
  Users, 
  LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare },
    { name: 'Riesgos', href: '/risks', icon: AlertTriangle },
    { name: 'Controles', href: '/controls', icon: Shield },
    { name: 'Incidentes', href: '/incidents', icon: AlertTriangle },
    { name: 'Politicas', href: '/policies', icon: FileText },
    { name: 'Evidencias', href: '/evidence', icon: FileText },
    { name: 'Empleados', href: '/resources/employees', icon: Users },
    { name: 'Proveedores', href: '/resources/vendors', icon: Users },
    { name: 'Sistemas', href: '/resources/systems', icon: Users },
    { name: 'Activos', href: '/resources/assets', icon: Users }
  ];

  return (
    <>
      {/* Global CSS Reset for this component */}
      <style>{`
        .layout-container {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        .layout-sidebar {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 250px !important;
          height: 100vh !important;
          background: white !important;
          border-right: 1px solid #e5e7eb !important;
          overflow-y: auto !important;
          z-index: 1000 !important;
          box-sizing: border-box !important;
        }
        
        .layout-main {
          position: fixed !important;
          top: 0 !important;
          left: 250px !important;
          right: 0 !important;
          bottom: 0 !important;
          background: #f9fafb !important;
          overflow-y: auto !important;
          z-index: 1 !important;
          box-sizing: border-box !important;
        }
        
        .sidebar-logo {
          padding: 16px !important;
          border-bottom: 1px solid #e5e7eb !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }
        
        .sidebar-nav {
          padding: 16px 8px !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }
        
        .nav-link {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          padding: 8px 12px !important;
          margin: 2px 0 !important;
          border-radius: 6px !important;
          text-decoration: none !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #4b5563 !important;
          transition: all 0.2s !important;
          box-sizing: border-box !important;
        }
        
        .nav-link:hover {
          background: #f3f4f6 !important;
          color: #111827 !important;
        }
        
        .nav-link.active {
          background: #dbeafe !important;
          color: #1e40af !important;
        }
        
        .sidebar-user {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          padding: 16px !important;
          border-top: 1px solid #e5e7eb !important;
          background: white !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          box-sizing: border-box !important;
        }
        
        .user-avatar {
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          background: #4f46e5 !important;
          color: white !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }
        
        .logout-btn {
          padding: 4px !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          color: #6b7280 !important;
          margin-left: auto !important;
        }
        
        .logout-btn:hover {
          color: #374151 !important;
        }
        
        .main-content {
          padding: 24px !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          min-height: 100% !important;
        }
      `}</style>

      <div className="layout-container">
        {/* Sidebar */}
        <div className="layout-sidebar">
          {/* Logo */}
          <div className="sidebar-logo">
            <Shield style={{ width: '24px', height: '24px', color: '#4f46e5' }} />
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
              GRC System
            </span>
          </div>
          
          {/* Navigation */}
          <div className="sidebar-nav">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <IconComponent style={{ width: '18px', height: '18px' }} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
          
          {/* User section */}
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: 0 }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                {user?.role}
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              <LogOut style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="layout-main">
          <div className="main-content">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}