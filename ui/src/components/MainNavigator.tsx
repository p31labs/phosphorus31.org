import React, { useState, useEffect } from 'react';
import OnboardingCenter from '../onboarding/OnboardingCenter';
import VisualWorldEditor from '../editor/VisualWorldEditor';
import ScriptEditor from '../editor/ScriptEditor';
import { BookOpen, Box, Code, HelpCircle, Shield } from 'lucide-react';
import HelpModal from './HelpModal';
import styles from './MainNavigator.module.css';

import MigrationChecklist from './MigrationChecklist';

const NAV_ITEMS = [
  { key: 'onboarding', label: 'Onboarding', icon: BookOpen, component: OnboardingCenter },
  { key: 'world', label: 'World Editor', icon: Box, component: VisualWorldEditor },
  { key: 'script', label: 'Script Editor', icon: Code, component: ScriptEditor },
  { key: 'migration', label: 'Migration Checklist', icon: Shield, component: MigrationChecklist },
];

export default function MainNavigator() {
  const [active, setActive] = useState('onboarding');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h' || e.key === '?') {
        const target = document.activeElement as Element | null;
        const tag = target?.tagName?.toLowerCase();
        const isInput =
          tag === 'input' || tag === 'textarea' || (target as HTMLElement)?.isContentEditable;
        if (!isInput) setShowHelp(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={styles.root}>
      <nav className={styles.sidebar}>
        <div className={styles.logo}>
          <span role="img" aria-label="shield">
            🛡️
          </span>{' '}
          The Buffer
        </div>
        <div className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={
                active === item.key
                  ? `${styles.navButton} ${styles.navButtonActive}`
                  : styles.navButton
              }
            >
              {item.icon ? React.createElement(item.icon, { size: 18 }) : null}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className={styles.bottomBar}>
          <button
            className={styles.helpButton}
            title="Help & Support"
            onClick={() => setShowHelp(true)}
          >
            <HelpCircle size={20} /> <span>Help</span>
          </button>
        </div>
      </nav>
      <main className={styles.main}>
        {/* Global notification placeholder */}
        <div className={styles.globalToastRoot} id="global-toast-root"></div>
        {(() => {
          const Active = NAV_ITEMS.find((item) => item.key === active)?.component;
          return Active ? <Active /> : null;
        })()}
      </main>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
