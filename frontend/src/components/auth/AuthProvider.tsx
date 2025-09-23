import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organization: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!token && !!user;

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // Simulación de login - validar credenciales de prueba
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay

      const validCredentials = [
        { email: 'admin@grc.com', password: 'admin123', role: 'admin', name: 'Administrador' },
        { email: 'manager@grc.com', password: 'manager123', role: 'manager', name: 'Manager' },
        { email: 'user@grc.com', password: 'user123', role: 'user', name: 'Usuario' }
      ];

      const credential = validCredentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (credential) {
        const mockUser: User = {
          id: '1',
          email: credential.email,
          firstName: credential.name,
          lastName: 'Demo',
          role: credential.role,
          organization: {
            id: '1',
            name: 'Empresa Demo GRC'
          }
        };

        const mockToken = `mock-token-${Date.now()}`;
        
        setUser(mockUser);
        setToken(mockToken);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('temp-token', mockToken);
        localStorage.setItem('temp-user', JSON.stringify(mockUser));

        return { success: true };
      } else {
        throw new Error('Credenciales incorrectas');
      }

    } catch (error: any) {
      const message = error.message || 'Error de autenticación';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('temp-token');
    localStorage.removeItem('temp-user');
  };

  const clearError = () => setError(null);

  // Verificar si hay sesión guardada (sin llamadas al backend)
  React.useEffect(() => {
    const savedToken = localStorage.getItem('temp-token');
    const savedUser = localStorage.getItem('temp-user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading saved session:', error);
        localStorage.removeItem('temp-token');
        localStorage.removeItem('temp-user');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}