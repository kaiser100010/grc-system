// frontend/src/components/common/Layout/Header.tsx
import React from 'react';
import { Bell, Search, Settings, User, LogOut } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Dashboard' }) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-gray-500 relative"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
                </div>
                <div className="border-t border-gray-200">
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Nueva tarea asignada</p>
                          <p className="text-xs text-gray-500">Hace 5 minutos</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Riesgo alto detectado</p>
                          <p className="text-xs text-gray-500">Hace 1 hora</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Control completado</p>
                          <p className="text-xs text-gray-500">Hace 2 horas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-3">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <Settings className="h-6 w-6" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="p-2">
                  <button className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    <User className="h-4 w-4 mr-3" />
                    Mi Perfil
                  </button>
                  <button className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Settings className="h-4 w-4 mr-3" />
                    Configuración
                  </button>
                  <hr className="my-1" />
                  <button className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    <LogOut className="h-4 w-4 mr-3" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;