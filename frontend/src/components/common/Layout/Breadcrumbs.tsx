// frontend/src/components/common/Layout/Breadcrumbs.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
  current: boolean;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const generateBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const pathSegments = path.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with home
    breadcrumbs.push({
      name: 'Dashboard',
      href: '/dashboard',
      current: path === '/dashboard'
    });

    // Route mappings
    const routeNames: Record<string, string> = {
      tasks: 'Tareas',
      risks: 'Riesgos',
      controls: 'Controles',
      incidents: 'Incidentes',
      policies: 'Políticas',
      evidence: 'Evidencias',
      resources: 'Recursos',
      employees: 'Empleados',
      vendors: 'Vendors',
      systems: 'Sistemas',
      assets: 'Assets',
      reports: 'Reportes',
      settings: 'Configuración'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

      // Skip adding dashboard again if it's the first segment
      if (currentPath === '/dashboard') return;

      breadcrumbs.push({
        name,
        href: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(pathname);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs for dashboard only
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 py-3">
          <ol className="flex items-center space-x-2">
            <li>
              <div>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </div>
            </li>

            {breadcrumbs.slice(1).map((item, index) => (
              <li key={item.href}>
                <div className="flex items-center">
                  <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
                  {item.current ? (
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      to={item.href}
                      className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumbs; 
