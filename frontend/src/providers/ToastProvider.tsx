// frontend/src/providers/ToastProvider.tsx

import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#10b981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#ef4444',
            },
          },
        }}
      />
    </>
  );
};