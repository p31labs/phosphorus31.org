import React, { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  toast: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  };
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const remainingRef = useRef<number>(toast.duration ?? 5000);

  useEffect(() => {
    // initialize remaining
    remainingRef.current = toast.duration ?? 5000;
    startTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  const startTimer = () => {
    startRef.current = Date.now();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => onClose(toast.id), remainingRef.current);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const elapsed = Date.now() - startRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    startTimer();
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]}`}
      role="status"
      aria-live="polite"
      tabIndex={0}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose(toast.id);
      }}
    >
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.content}>
        <div className={styles.title}>{toast.title}</div>
        <div className={styles.message}>{toast.message}</div>
      </div>
      <button
        className={styles.closeButton}
        onClick={() => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          onClose(toast.id);
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
      <div className={styles.progressBar}>
        <div
          data-testid="toast-progress"
          className={styles.progressFill}
          style={{
            animationDuration: `${toast.duration ?? 5000}ms`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      </div>
    </div>
  );
};

export default Toast;
