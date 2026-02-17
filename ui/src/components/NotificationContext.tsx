import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  defaultDuration: number;
  setDefaultToastDuration: (ms: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Default toast duration (ms), persisted in localStorage
  const [defaultDuration, setDefaultDuration] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('toast.defaultDuration');
      return saved ? parseInt(saved, 10) : 5000;
    } catch {
      return 5000;
    }
  });

  const setDefaultToastDuration = useCallback((ms: number) => {
    setDefaultDuration(ms);
    try {
      localStorage.setItem('toast.defaultDuration', String(ms));
    } catch {
      /* ignore */
    }
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Date.now().toString();
      const newToast: Toast = { ...toast, id, duration: toast.duration ?? defaultDuration };
      setToasts((prev) => [...prev, newToast]);
    },
    [defaultDuration]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        clearToasts,
        defaultDuration,
        setDefaultToastDuration,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
