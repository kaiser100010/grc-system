// src/components/providers/StoreProvider.tsx
import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const initializeStore = useAppStore(state => state.initializeStore);

  useEffect(() => {
    // Inicializar el store con datos semilla al cargar la aplicación
    initializeStore();
  }, [initializeStore]);

  return <>{children}</>;
};