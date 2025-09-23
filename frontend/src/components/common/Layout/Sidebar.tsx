// frontend/src/components/common/Layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  CheckSquare,
  AlertTriangle,
  Shield,
  FileText,
  AlertCircle,
  Users,
  Building,
  Server,
  Package,
  Folder,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current?: boolean;
  children?: NavigationItem[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: pathname === '/dashboard'
    },
    {
      name: 'Tareas',
      href: '/tasks',
      icon: CheckSquare,
      current: pathname.startsWith('/tasks')
    },
    {
      name: 'Riesgos',
      href: '/risks',
      icon: AlertTriangle,
      current: pathname.startsWith('/risks')
    },
    {
      name: 'Controles',
      href: '/controls',
      icon: Shield,
      current: pathname.startsWith('/controls')
    },
    {
      name: 'Incidentes',
      href: '/incidents',
      icon: AlertCircle,
      current: pathname.startsWith('/incidents')
    },
    {
      name: 'Políticas',
      href: '/policies',
      icon: FileText,
      current: pathname.startsWith('/policies')
    },
    {
      name: 'Evidencias',
      href: '/evidence',
      icon: Folder,
      current: pathname.startsWith('/evidence')
    },
    {
      name: 'Recursos',
      href: '#',
      icon: Building,
      current: pathname.startsWith('/resources'),
      children: [
        {
          name: 'Empleados',
          href: '/resources/employees',
          icon: Users,
          current: pathname === '/resources/employees'
        },
        {
          name: 'Vendors',
          href: '/resources/vendors',
          icon: Building,
          current: pathname === '/resources/vendors'
        },
        {
          name: 'Sistemas',
          href: '/resources/systems',
          icon: Server,
          current: pathname === '/resources/systems'
        },
        {
          name: 'Assets',
          href: '/resources/assets',
          icon: Package,
          current: pathname === '/resources/assets'
        }
      ]
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: BarChart3,
      current: pathname.startsWith('/reports')
    },
    {
      name: 'Configuración',
      href: '/settings',
      icon: Settings,
      current: pathname.startsWith('/settings')
    }
  ];

  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  React.useEffect(() => {
    // Auto-expandir elementos que contienen la ruta actual
    navigation.forEach(item => {
      if (item.children && item.children.some(child => child.current)) {
        setExpandedItems(prev => prev.includes(item.name) ? prev : [...prev, item.name]);
      }
    });
  }, [pathname]);

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);

    return (
      <li key={item.name}>
        <div className="relative">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.name)}
              className={`
                w-full text-left group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${level > 0 ? 'pl-8' : ''}
                ${item.current
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                `}
              />
              <span className="flex-1">{item.name}</span>
              {hasChildren && (
                <div className="ml-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              )}
            </button>
          ) : (
            <Link
              to={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${level > 0 ? 'pl-8' : ''}
                ${item.current
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                `}
              />
              {item.name}
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && (
          <ul className="mt-1 space-y-1">
            {item.children?.map(child => renderNavigationItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-semibold text-gray-900">GRC System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map(item => renderNavigationItem(item))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Usuario</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 
