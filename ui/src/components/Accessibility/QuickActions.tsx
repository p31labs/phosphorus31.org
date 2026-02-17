/**
 * Quick Actions - One-touch actions for common tasks
 * Large buttons for easy access
 */

import React from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { SimpleButton } from './SimpleButton';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const { fontSize, simplifiedUI } = useAccessibilityStore();

  const buttonSize = fontSize === 'xlarge' ? 'xlarge' : fontSize === 'large' ? 'large' : 'medium';

  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="actions-grid">
        {actions.map((action) => (
          <SimpleButton
            key={action.id}
            label={`${action.icon} ${action.label}`}
            onClick={action.action}
            variant={action.color || 'primary'}
            size={buttonSize}
            fullWidth={simplifiedUI}
          />
        ))}
      </div>
    </div>
  );
};
