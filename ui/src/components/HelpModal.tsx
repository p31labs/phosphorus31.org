import React from 'react';
import { X, BookOpen, MessageCircle, ExternalLink, Zap } from 'lucide-react';
import styles from './HelpModal.module.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useNotifications } from './NotificationContext';

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { defaultDuration, setDefaultToastDuration } = useNotifications();
  const closeBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // when modal becomes open, focus and install key handlers
    if (isOpen) {
      closeBtnRef.current?.focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && modalRef.current) {
        // basic focus trap
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, isOpen]);

  // Only render modal if open
  if (!isOpen) return null;

  const helpSections = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      content:
        'Welcome to The Buffer! Start with the Onboarding Center to learn about creating worlds, scripts, and quantum features.',
      links: [
        { text: 'Quick Start Guide', href: '#' },
        { text: 'Video Tutorials', href: '#' },
      ],
    },
    {
      icon: Zap,
      title: 'Quantum Features',
      content:
        'Explore advanced quantum-enhanced tools for progress tracking, search, and metrics throughout the platform.',
      links: [
        { text: 'Quantum UI Guide', href: '#' },
        { text: 'Performance Tips', href: '#' },
      ],
    },
    {
      icon: MessageCircle,
      title: 'Community & Support',
      content: 'Connect with other creators, share your worlds, and get help from the community.',
      links: [
        {
          text: 'GitHub Discussions',
          href: 'https://github.com/trimtab-signal/cognitive-shield/discussions',
          external: true,
        },
        { text: 'Discord Server', href: '#' },
      ],
    },
  ];

  // Sanity: log whether icons are valid React elements (tests can expose this if failing)
  // (will be removed after debugging)
  // eslint-disable-next-line no-console
  console.log(
    'HelpModal icons valid:',
    helpSections.map((s) => React.isValidElement(s.icon))
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        <div className={styles.header}>
          <h2 id="help-modal-title">🛡️ The Buffer Help</h2>
          <button
            ref={closeBtnRef}
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close help"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {helpSections.map((section, index) => (
            <div key={index} className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  {section.icon ? React.createElement(section.icon, { size: 20 }) : null}
                </div>
                <h3>{section.title}</h3>
              </div>
              <p className={styles.sectionContent}>{section.content}</p>
              <div className={styles.sectionLinks}>
                {section.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className={styles.link}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    {link.text}
                    {link.external && <ExternalLink size={12} />}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>⚙️</div>
              <h3>Notification Settings</h3>
            </div>
            <div className={styles.sectionContent}>
              <label htmlFor="toast-duration">Default toast duration</label>
              <div>
                <select
                  id="toast-duration"
                  value={defaultDuration}
                  onChange={(e) => setDefaultToastDuration(parseInt(e.target.value, 10))}
                >
                  <option value={2000}>2 seconds</option>
                  <option value={5000}>5 seconds</option>
                  <option value={10000}>10 seconds</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <p>
            Need more help? Visit our{' '}
            <a
              href="https://github.com/trimtab-signal/cognitive-shield"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub repository
            </a>{' '}
            or join the discussion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
