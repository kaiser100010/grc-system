// frontend/src/hooks/useApi.ts
import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface UseApiReturn {
  loading: boolean;
  error: string | null;
  get: <T>(url: string) => Promise<ApiResponse<T>>;
  post: <T>(url: string, data: any) => Promise<ApiResponse<T>>;
  put: <T>(url: string, data: any) => Promise<ApiResponse<T>>;
  patch: <T>(url: string, data: any) => Promise<ApiResponse<T>>;
  delete: <T>(url: string) => Promise<ApiResponse<T>>;
}

export const useApi = (): UseApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  };

  const apiCall = useCallback(
    async <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
      try {
        setLoading(true);
        setError(null);

        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
        
        const response = await fetch(fullUrl, {
          ...options,
          headers: {
            ...getAuthHeaders(),
            ...options.headers,
          },
        });

        return await handleResponse<T>(response);
      } catch (err: any) {
        const errorMessage = err.message || 'An unexpected error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl]
  );

  const get = useCallback(
    <T>(url: string) => apiCall<T>(url, { method: 'GET' }),
    [apiCall]
  );

  const post = useCallback(
    <T>(url: string, data: any) =>
      apiCall<T>(url, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    [apiCall]
  );

  const put = useCallback(
    <T>(url: string, data: any) =>
      apiCall<T>(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    [apiCall]
  );

  const patch = useCallback(
    <T>(url: string, data: any) =>
      apiCall<T>(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    [apiCall]
  );

  const del = useCallback(
    <T>(url: string) => apiCall<T>(url, { method: 'DELETE' }),
    [apiCall]
  );

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
  };
}; 
