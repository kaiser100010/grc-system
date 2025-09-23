// frontend/src/hooks/useNotifications.ts
import { useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface UseNotificationsReturn {
  showNotification: (message: string, type?: Notification['type'], title?: string, duration?: number) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

// Simple toast implementation - in a real app you might use a library like react-hot-toast
let toastContainer: HTMLDivElement | null = null;

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col space-y-2';
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const createToast = (notification: Notification) => {
  const container = createToastContainer();
  
  const toast = document.createElement('div');
  toast.id = `toast-${notification.id}`;
  toast.className = `
    max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
    transform transition-all duration-300 ease-in-out
  `;

  const typeStyles = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    warning: 'border-l-4 border-yellow-500',
    info: 'border-l-4 border-blue-500',
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const typeColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  toast.innerHTML = `
    <div class="p-4 ${typeStyles[notification.type]}">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${typeColors[notification.type]}">
            ${typeIcons[notification.type]}
          </span>
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-gray-900">${notification.title}</p>
          <p class="mt-1 text-sm text-gray-500">${notification.message}</p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onclick="this.closest('[id^=toast-]').remove()">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Add entrance animation
  toast.style.transform = 'translateX(100%)';
  toast.style.opacity = '0';
  
  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  }, 10);

  // Auto remove
  if (notification.duration) {
    setTimeout(() => {
      removeToast(notification.id);
    }, notification.duration);
  }

  return toast;
};

const removeToast = (id: string) => {
  const toast = document.getElementById(`toast-${id}`);
  if (toast) {
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }
};

export const useNotifications = (): UseNotificationsReturn => {
  const showNotification = useCallback(
    (message: string, type: Notification['type'] = 'info', title?: string, duration = 5000) => {
      const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title: title || type.charAt(0).toUpperCase() + type.slice(1),
        message,
        duration,
      };

      createToast(notification);
    },
    []
  );

  const hideNotification = useCallback((id: string) => {
    removeToast(id);
  }, []);

  const clearAllNotifications = useCallback(() => {
    const container = document.getElementById('toast-container');
    if (container) {
      container.innerHTML = '';
    }
  }, []);

  return {
    showNotification,
    hideNotification,
    clearAllNotifications,
  };
}; 
