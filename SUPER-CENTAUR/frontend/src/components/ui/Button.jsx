import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  // Base is primary. Secondary overrides background.
  const variantStyles = variant === 'secondary'
    ? 'bg-secondary border-secondary'
    : variant === 'accent'
    ? 'bg-accent border-accent'
    : 'bg-primary border-primary';

  return (
    <button 
      className={`ui-button ${variantStyles} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
