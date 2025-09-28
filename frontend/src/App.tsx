// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TestSyncPage } from './pages/TestSync';

// Importar componentes
import { EmployeeList, EmployeeDetails } from './components/modules/resources/employees';

// Layout simple
const SimpleLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold">GRC System</h1>
            <nav className="flex space-x-4">
              <a href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
              <a href="/resources/employees" className="text-gray-700 hover:text-gray-900">Employees</a>
              <a href="/test-sync" className="text-gray-700 hover:text-gray-900">Test Sync</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

// Dashboard placeholder
const DashboardPlaceholder = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900">Total Employees</h3>
        <p className="text-3xl font-bold text-blue-600">5</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900">Active Tasks</h3>
        <p className="text-3xl font-bold text-green-600">0</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-900">Open Risks</h3>
        <p className="text-3xl font-bold text-yellow-600">0</p>
      </div>
    </div>
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <p className="text-gray-600">
        Welcome to the GRC System. Navigate to the Employees section to manage your organization's employees.
      </p>
    </div>
  </div>
);

// Login placeholder
const LoginPlaceholder = () => {
  const handleLogin = () => {
    localStorage.setItem('token', 'dummy-token');
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login to GRC System</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="user@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="password"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

// Protected route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <>
      {/* Toaster for notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: 'white',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: 'white',
            },
          },
        }}
      />

      <Router>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<LoginPlaceholder />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SimpleLayout>
                  <Navigate to="/dashboard" replace />
                </SimpleLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SimpleLayout>
                  <DashboardPlaceholder />
                </SimpleLayout>
              </ProtectedRoute>
            }
          />

          {/* Employee routes */}
          <Route
            path="/resources/employees"
            element={
              <ProtectedRoute>
                <SimpleLayout>
                  <EmployeeList />
                </SimpleLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/resources/employees/:id"
            element={
              <ProtectedRoute>
                <SimpleLayout>
                  <EmployeeDetails />
                </SimpleLayout>
              </ProtectedRoute>
            }
          />

          {/* Test Sync route - MOVIDO AQUÍ DENTRO DE ROUTES */}
          <Route
            path="/test-sync"
            element={
              <SimpleLayout>
                <TestSyncPage />
              </SimpleLayout>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900">404</h1>
                  <p className="mt-2 text-gray-600">Page not found</p>
                  <a href="/dashboard" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            }
          />
		  		<Route
  path="/test-sync"
  element={
    <SimpleLayout>
      <TestSyncPage />
    </SimpleLayout>
  }
/>
        </Routes>
      </Router>
    </>
  );
}

export default App;