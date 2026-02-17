import React from 'react';

export const Input = ({ id, label, className = '', ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-muted mb-2">
          {label}
        </label>
      )}
      <input id={id} className={`ui-input ${className}`} {...props} />
    </div>
  );
};

export const TextArea = ({ id, label, className = '', ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-muted mb-2">
          {label}
        </label>
      )}
      <textarea id={id} className={`ui-input ${className}`} {...props} />
    </div>
  );
};

export const Select = ({ id, label, children, className = '', ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-muted mb-2">
          {label}
        </label>
      )}
      <select id={id} className={`ui-input ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
};
