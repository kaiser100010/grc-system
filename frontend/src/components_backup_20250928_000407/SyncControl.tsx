// ARCHIVO: frontend/src/components/SyncControl.tsx
// Panel de control para gestionar la sincronización con el backend

import React, { useEffect, useState } from 'react';
import { useAppStoreEnhanced } from '../store/useAppStoreEnhanced';

export const SyncControl: React.FC = () => {
  const {
    config,
    syncState,
    syncWithBackend,
    enableSync,
    clearSyncErrors,
    applyPendingChanges
  } = useAppStoreEnhanced();

  const [isExpanded, setIsExpanded] = useState(false);
  const [autoSyncInterval, setAutoSyncInterval] = useState<NodeJS.Timeout | null>(null);

  // Auto-sync si está habilitado
  useEffect(() => {
    if (config.syncEnabled && config.autoSync) {
      const interval = setInterval(() => {
        syncWithBackend();
      }, config.syncInterval * 60 * 1000); // Convertir minutos a ms
      
      setAutoSyncInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (autoSyncInterval) {
        clearInterval(autoSyncInterval);
        setAutoSyncInterval(null);
      }
    }
  }, [config.syncEnabled, config.autoSync, config.syncInterval]);

  // Detectar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => {
      console.log('Conexión restaurada');
      if (config.syncEnabled) {
        syncWithBackend();
      }
    };

    const handleOffline = () => {
      console.log('Conexión perdida');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [config.syncEnabled]);

  const pendingCount = 
    syncState.pendingChanges.create.length +
    syncState.pendingChanges.update.length +
    syncState.pendingChanges.delete.length;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón flotante */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          rounded-full p-3 shadow-lg transition-all
          ${config.syncEnabled 
            ? syncState.isOnline 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-gray-400 hover:bg-gray-500'
          }
        `}
      >
        <div className="flex items-center gap-2 text-white">
          {syncState.isSyncing ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          )}
          {pendingCount > 0 && (
            <span className="bg-red-500 text-xs rounded-full px-2 py-1">
              {pendingCount}
            </span>
          )}
        </div>
      </button>

      {/* Panel expandido */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-80 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Control de Sincronización</h3>
          
          {/* Estado de conexión */}
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estado:</span>
              <span className={`text-sm font-medium ${
                syncState.isOnline ? 'text-green-600' : 'text-red-600'
              }`}>
                {syncState.isOnline ? 'En línea' : 'Sin conexión'}
              </span>
            </div>
            {syncState.lastSyncTime && (
              <div className="text-xs text-gray-500 mt-1">
                Última sync: {new Date(syncState.lastSyncTime).toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Toggle de sincronización */}
          <div className="mb-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sincronización:</span>
              <button
                onClick={() => enableSync(!config.syncEnabled)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${config.syncEnabled ? 'bg-blue-600' : 'bg-gray-300'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${config.syncEnabled ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </label>
          </div>

          {/* Cambios pendientes */}
          {config.syncEnabled && pendingCount > 0 && (
            <div className="mb-3 p-2 bg-yellow-50 rounded">
              <div className="text-sm text-yellow-800 mb-1">
                {pendingCount} cambios pendientes
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                {syncState.pendingChanges.create.length > 0 && (
                  <div>• {syncState.pendingChanges.create.length} creaciones</div>
                )}
                {syncState.pendingChanges.update.length > 0 && (
                  <div>• {syncState.pendingChanges.update.length} actualizaciones</div>
                )}
                {syncState.pendingChanges.delete.length > 0 && (
                  <div>• {syncState.pendingChanges.delete.length} eliminaciones</div>
                )}
              </div>
              <button
                onClick={applyPendingChanges}
                disabled={syncState.isSyncing || !syncState.isOnline}
                className="mt-2 w-full px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aplicar cambios
              </button>
            </div>
          )}

          {/* Errores */}
          {syncState.syncErrors.length > 0 && (
            <div className="mb-3 p-2 bg-red-50 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-red-800">Errores:</span>
                <button
                  onClick={clearSyncErrors}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Limpiar
                </button>
              </div>
              <div className="text-xs text-gray-600 space-y-1 max-h-20 overflow-y-auto">
                {syncState.syncErrors.map((error, i) => (
                  <div key={i}>• {error}</div>
                ))}
              </div>
            </div>
          )}

          {/* Acciones */}
          {config.syncEnabled && (
            <div className="flex gap-2">
              <button
                onClick={syncWithBackend}
                disabled={syncState.isSyncing || !syncState.isOnline}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncState.isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}
              </button>
            </div>
          )}

          {/* Modo de desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Modo: {config.syncEnabled ? 'Backend' : 'Local'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};