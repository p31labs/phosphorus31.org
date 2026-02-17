import React, { useState, useEffect, useCallback } from 'react';
import { onApiError } from '../../lib/api';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const ICONS = {
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
};

let globalAddToast = () => {};

/** Imperative API: call from anywhere */
export const toast = {
  success: (message) => globalAddToast({ type: 'success', message }),
  error: (message) => globalAddToast({ type: 'error', message }),
  warning: (message) => globalAddToast({ type: 'warning', message }),
  info: (message) => globalAddToast({ type: 'info', message }),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, message }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  // Wire up the imperative API
  useEffect(() => {
    globalAddToast = addToast;
  }, [addToast]);

  // Auto-subscribe to API errors
  useEffect(() => {
    return onApiError(addToast);
  }, [addToast]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-container" role="status" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || ICONS.info;
        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <Icon className="w-5 h-5 shrink-0" aria-hidden="true" style={{ width: '1.25rem', height: '1.25rem', minWidth: '1.25rem', minHeight: '1.25rem' }} />
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 rounded hover:bg-surface transition-colors"
              aria-label="Dismiss notification"
            >
              <XMarkIcon className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
