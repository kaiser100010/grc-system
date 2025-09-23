// frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Opcional: Providers para estado global, theme, etc.
// import { AuthProvider } from './components/auth/AuthProvider';
// import { ThemeProvider } from './contexts/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Si tienes providers, envuélvelos aquí */}
    {/* <AuthProvider> */}
    {/* <ThemeProvider> */}
    <App />
    {/* </ThemeProvider> */}
    {/* </AuthProvider> */}
  </React.StrictMode>
);