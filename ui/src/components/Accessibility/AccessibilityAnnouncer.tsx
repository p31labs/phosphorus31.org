/**
 * Accessibility Announcer
 * Screen reader announcements for dynamic content
 */

import React, { useEffect, useRef } from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';

interface Announcement {
  message: string;
  priority: 'polite' | 'assertive';
}

export const AccessibilityAnnouncer: React.FC = () => {
  const { screenReader } = useAccessibilityStore();
  const announcerRef = useRef<HTMLDivElement>(null);
  const announcementQueue = useRef<Announcement[]>([]);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!screenReader) return;

    announcementQueue.current.push({ message, priority });

    if (announcerRef.current) {
      announcerRef.current.setAttribute('aria-live', priority);
      announcerRef.current.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  // Expose announce function globally for use by other components
  useEffect(() => {
    (window as any).accessibilityAnnounce = announce;
    return () => {
      delete (window as any).accessibilityAnnounce;
    };
  }, [screenReader]);

  return <div ref={announcerRef} className="sr-only" aria-live="polite" aria-atomic="true" />;
};
