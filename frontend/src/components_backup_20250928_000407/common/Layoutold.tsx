// src/components/common/Layout.tsx

import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  AlertTriangle,
  Shield,
  CheckSquare,
  AlertCircle,
  FileText,
  Database,
  Users,
  Briefcase,
  Server,
  Package,
  Upload,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  User,
  HelpCircle,
  Activity,
  BarChart3,
  Calendar,
  MessageSquare,
  Lock,
  Key,
  Globe,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import useAppStore from '../../store/appStore';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  badge?: number;
  children?: MenuItem[];
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    user, 
    logout, 
    sidebarCollapsed, 
    toggleSidebar,
    theme,
    setTheme,
    notifications,
    risks,
    tasks,
    incidents
  } = useAppStore();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['governance', 'resources']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Calcular badges
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const criticalRisks = risks.filter(r => r.level === 'crítico').length;
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating').length;
  const overdueTasks = tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return t.status !== 'completed' && dueDate < new Date();
  }).length;

  // Estructura del menú
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'governance',
      label: 'Gobernanza',
      icon: Shield,
      children: [
        {
          id: 'risks',
          label: 'Riesgos',
          icon: AlertTriangle,
          path: '/risks',
          badge: criticalRisks > 0 ? criticalRisks : undefined
        },
        {
          id: 'controls',
          label: 'Controles',
          icon: Shield,
          path: '/controls'
        },
        {
          id: 'policies',
          label: 'Políticas',
          icon: FileText,
          path: '/policies'
        },
        {
          id: 'compliance',
          label: 'Cumplimiento',
          icon: CheckSquare,
          path: '/compliance'
        }
      ]
    },
    {
      id: 'operations',
      label: 'Operaciones',
      icon: Activity,
      children: [
        {
          id: 'tasks',
          label: 'Tareas',
          icon: CheckSquare,
          path: '/tasks',
          badge: overdueTasks > 0 ? overdueTasks : undefined
        },
        {
          id: 'incidents',
          label: 'Incidentes',
          icon: AlertCircle,
          path: '/incidents',
          badge: openIncidents > 0 ? openIncidents : undefined
        },
        {
          id: 'evidence',
          label: 'Evidencias',
          icon: Upload,
          path: '/evidence'
        },
        {
          id: 'audits',
          label: 'Auditorías',
          icon: Database,
          path: '/audits'
        }
      ]
    },
    {
      id: 'resources',
      label: 'Recursos',
      icon: Package,
      children: [
        {
          id: 'employees',
          label: 'Empleados',
          icon: Users,
          path: '/employees'
        },
        {
          id: 'vendors',
          label: 'Proveedores',
          icon: Briefcase,
          path: '/vendors'
        },
        {
          id: 'systems',
          label: 'Sistemas',
          icon: Server,
          path: '/systems'
        },
        {
          id: 'assets',
          label: 'Activos',
          icon: Package,
          path: '/assets'
        }
      ]
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: BarChart3,
      path: '/reports'
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      path: '/settings'
    }
  ];

  // Funciones de navegación
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId);

  const isPathActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isParentActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some(child => isPathActive(child.path));
  };

  // Renderizar item del menú
  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = isMenuExpanded(item.id);
    const isActive = isPathActive(item.path) || isParentActive(item.children);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleMenu(item.id)}
            className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            } ${depth > 0 ? 'ml-4' : ''}`}
          >
            <div className="flex items-center">
              <Icon className={`h-5 w-5 mr-3 ${sidebarCollapsed && depth === 0 ? 'mr-0' : ''}`} />
              {!sidebarCollapsed && (
                <span>{item.label}</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            )}
          </button>
          {!sidebarCollapsed && isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path || '#'}
        className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        } ${depth > 0 ? 'ml-4' : ''}`}
      >
        <div className="flex items-center">
          <Icon className={`h-5 w-5 mr-3 ${sidebarCollapsed && depth === 0 ? 'mr-0' : ''}`} />
          {!sidebarCollapsed && (
            <span>{item.label}</span>
          )}
        </div>
        {!sidebarCollapsed && item.badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar Desktop */}
      <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 ${
        sidebarCollapsed ? 'md:w-16' : 'md:w-64'
      }`}>
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-lg">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              {!sidebarCollapsed && (
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  GRC System
                </span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>

          {/* User section */}
          {!sidebarCollapsed && user && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className={`md:pl-${sidebarCollapsed ? '16' : '64'} flex flex-col flex-1`}>
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Search bar */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Right side buttons */}
              <div className="flex items-center space-x-4">
                {/* Theme toggle */}
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </button>

                {/* Help button */}
                <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  <HelpCircle className="h-5 w-5" />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                    )}
                  </button>

                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Notificaciones
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.slice(0, 5).map(notification => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          to="/notifications"
                          className="text-sm text-blue-600 hover:text-blue-500"
                          onClick={() => setShowNotifications(false)}
                        >
                          Ver todas
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </button>

                  {/* User dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="inline h-4 w-4 mr-2" />
                        Mi Perfil
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="inline h-4 w-4 mr-2" />
                        Configuración
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowMobileMenu(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                    GRC System
                  </span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {menuItems.map(item => renderMenuItem(item))}
                </nav>
              </div>
              {user && (
                <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <div>
                © 2024 GRC System. Todos los derechos reservados.
              </div>
              <div className="flex items-center space-x-4">
                <span>Versión 1.0.0</span>
                <span>•</span>
                <Link to="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Privacidad
                </Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Términos
                </Link>
                <span>•</span>
                <Link to="/support" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Soporte
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}