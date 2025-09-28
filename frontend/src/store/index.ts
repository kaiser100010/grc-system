// src/store/index.ts
// Exporta ambos stores durante la migración

export { useAppStore } from './useAppStore';
export { useAppStoreEnhanced } from './useAppStoreEnhanced';

// Para migración gradual, puedes crear un alias
export const useStore = process.env.REACT_APP_USE_ENHANCED === 'true' 
  ? useAppStoreEnhanced 
  : useAppStore;