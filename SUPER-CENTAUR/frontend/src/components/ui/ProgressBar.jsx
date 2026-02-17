import React from 'react';

/**
 * Semantic, accessible progress bar.
 * Replaces ASCII art and non-semantic div bars.
 */
const ProgressBar = ({ value = 0, max = 100, label, gradient, className = '' }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted">{label}</span>
          <span className="text-xs font-semibold text-main">{Math.round(percent)}%</span>
        </div>
      )}
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(percent)}%`}
      >
        <div
          className="progress-bar-fill"
          style={{
            width: `${percent}%`,
            ...(gradient ? { background: `linear-gradient(90deg, ${gradient})` } : {}),
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
