// src/pages/TestSync.tsx
import React from 'react';
import { useAppStoreEnhanced } from '../store/useAppStoreEnhanced';
import { SyncControl } from '../components/SyncControl';

export const TestSyncPage: React.FC = () => {
  const { 
    employees, 
    config, 
    syncWithBackend,
    enableSync
  } = useAppStoreEnhanced();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test de Sincronización</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Estado Actual</h2>
          <p>Modo: {config.syncEnabled ? 'Backend' : 'Local'}</p>
          <p>Empleados en store: {employees.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Acciones</h2>
          <button
            onClick={() => enableSync(!config.syncEnabled)}
            className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
          >
            {config.syncEnabled ? 'Desactivar' : 'Activar'} Sync
          </button>
          <button
            onClick={syncWithBackend}
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={!config.syncEnabled}
          >
            Sincronizar
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Departamento</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-t">
                <td className="px-4 py-2">{emp.id}</td>
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">{emp.email}</td>
                <td className="px-4 py-2">{emp.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <SyncControl />
    </div>
  );
};