import React from 'react';
import { useNotifications } from './NotificationContext';
import Toast from './Toast';
import styles from './ToastContainer.module.css';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
