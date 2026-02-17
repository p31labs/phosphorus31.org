import React from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/solid';

/**
 * Accessible status badge with icon + text (not color-only).
 * WCAG 1.4.1 compliant.
 */
const STATUS_CONFIG = {
  active: { icon: CheckCircleIcon, css: 'status-active', label: 'Active' },
  building: { icon: ClockIcon, css: 'status-warning', label: 'Building' },
  pending: { icon: ClockIcon, css: 'status-pending', label: 'Pending' },
  paused: { icon: PauseCircleIcon, css: 'status-warning', label: 'Paused' },
  stopped: { icon: XCircleIcon, css: 'status-error', label: 'Stopped' },
  error: { icon: XCircleIcon, css: 'status-error', label: 'Error' },
  healthy: { icon: CheckCircleIcon, css: 'status-active', label: 'Healthy' },
  warning: { icon: ExclamationTriangleIcon, css: 'status-warning', label: 'Warning' },
  critical: { icon: XCircleIcon, css: 'status-error', label: 'Critical' },
};

const StatusBadge = ({ status, label }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <span className={`status-badge ${config.css}`}>
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
