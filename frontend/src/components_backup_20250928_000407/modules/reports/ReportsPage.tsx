import React from 'react';
import { BarChart, FileText, Download, Calendar, TrendingUp, Users, Shield, AlertTriangle } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      title: 'Reporte de Cumplimiento SOX',
      description: 'Estado actual de cumplimiento de controles SOX',
      category: 'Cumplimiento',
      lastGenerated: '2024-09-01',
      frequency: 'Mensual',
      format: 'PDF',
      icon: Shield
    },
    {
      id: 2,
      title: 'Matriz de Riesgos',
      description: 'Evaluación completa de riesgos organizacionales',
      category: 'Riesgos',
      lastGenerated: '2024-08-30',
      frequency: 'Trimestral',
      format: 'Excel',
      icon: AlertTriangle
    },
    {
      id: 3,
      title: 'Dashboard Ejecutivo',
      description: 'KPIs y métricas clave para la dirección',
      category: 'Ejecutivo',
      lastGenerated: '2024-09-04',
      frequency: 'Semanal',
      format: 'PowerPoint',
      icon: TrendingUp
    },
    {
      id: 4,
      title: 'Reporte de Incidentes',
      description: 'Resumen de incidentes de seguridad y operacionales',
      category: 'Seguridad',
      lastGenerated: '2024-09-03',
      frequency: 'Mensual',
      format: 'PDF',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart className="h-6 w-6 text-teal-500" />
          Reportes y Análisis
        </h1>
        <p className="text-gray-600 mt-1">
          Genera reportes personalizados y análisis de datos GRC
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const IconComponent = report.icon;
          return (
            <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <IconComponent className="h-8 w-8 text-teal-500" />
                <div>
                  <h3 className="font-medium text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-500">{report.category}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{report.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Última generación: {new Date(report.lastGenerated).toLocaleDateString('es-ES')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-2" />
                  Frecuencia: {report.frequency} | Formato: {report.format}
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                <Download className="h-4 w-4" />
                Generar Reporte
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8 text-center">
        <BarChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Módulo en Desarrollo</h3>
        <p className="text-gray-600">El módulo de reportes completo estará disponible próximamente con análisis avanzados y reportes personalizables.</p>
      </div>
    </div>
  );
}