import React from 'react';

const LoadingSpinner = ({ message = 'Loading Quantum Module...' }) => (
  <div className="loading-spinner flex-col gap-4 min-h-[60vh]">
    <div className="spinner" role="status" aria-label={message} />
    <p className="text-muted text-sm">{message}</p>
  </div>
);

export default LoadingSpinner;
