import React from 'react';
import { Settings, User, Shield, Bell, Database, Globe, Palette } from 'lucide-react';

export default function SettingsPage() {
  const settingsSections = [
    {
      id: 'profile',
      title: 'Perfil de Usuario',
      description: 'Administra tu información personal y preferencias de cuenta',
      icon: User,
      color: 'blue'
    },
    {
      id: 'security',
      title: 'Seguridad',
      description: 'Configuraciones de seguridad, autenticación y privacidad',
      icon: Shield,
      color: 'green'
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Gestiona alertas, recordatorios y notificaciones del sistema',
      icon: Bell,
      color: 'yellow'
    },
    {
      id: 'system',
      title: 'Sistema',
      description: 'Configuraciones generales del sistema y administración',
      icon: Database,
      color: 'purple'
    },
    {
      id: 'integration',
      title: 'Integraciones',
      description: 'Conecta con sistemas externos y APIs de terceros',
      icon: Globe,
      color: 'indigo'
    },
    {
      id: 'appearance',
      title: 'Apariencia',
      description: 'Personaliza la interfaz, tema y configuraciones visuales',
      icon: Palette,
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'green': return 'text-green-500 bg-green-50 border-green-200';
      case 'yellow': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'purple': return 'text-purple-500 bg-purple-50 border-purple-200';
      case 'indigo': return 'text-indigo-500 bg-indigo-50 border-indigo-200';
      case 'pink': return 'text-pink-500 bg-pink-50 border-pink-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-gray-500" />
          Configuración del Sistema
        </h1>
        <p className="text-gray-600 mt-1">
          Administra configuraciones, preferencias y ajustes del sistema GRC
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => {
          const IconComponent = section.icon;
          const colorClasses = getColorClasses(section.color);
          
          return (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg border ${colorClasses}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{section.title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{section.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Configuraciones en Desarrollo</h3>
        <p className="text-gray-600">
          El módulo de configuraciones completo estará disponible próximamente con opciones avanzadas de personalización y administración del sistema.
        </p>
      </div>
    </div>
  );
}