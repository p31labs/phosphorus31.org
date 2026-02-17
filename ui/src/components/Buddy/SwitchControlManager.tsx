/**
 * P31 Buddy — switch control navigation.
 * Manages focus order and accepts switch input (e.g. space, click, external switch) to move focus.
 * Use when memory.accessibility.switchControl is true.
 */

import React, { useCallback, useEffect, useRef } from 'react';

export interface SwitchControlManagerProps {
  /** Enable switch mode (move focus on each activation) */
  enabled: boolean;
  /** Child that receives ref for focusable container */
  children: React.ReactNode;
  /** Selector for focusable elements inside the container (default: button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]) */
  focusableSelector?: string;
  className?: string;
}

const DEFAULT_FOCUSABLE =
  'button, [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SwitchControlManager({
  enabled,
  children,
  focusableSelector = DEFAULT_FOCUSABLE,
  className = '',
}: SwitchControlManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusIndexRef = useRef(0);

  const getFocusables = useCallback(() => {
    const el = containerRef.current;
    if (!el) return [];
    return Array.from(el.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      (node) => node.tabIndex >= 0 && !(node as HTMLInputElement).disabled
    );
  }, [focusableSelector]);

  const moveFocus = useCallback(
    (direction: 1 | -1) => {
      const list = getFocusables();
      if (list.length === 0) return;
      focusIndexRef.current = (focusIndexRef.current + direction + list.length) % list.length;
      list[focusIndexRef.current]?.focus();
    },
    [getFocusables]
  );

  useEffect(() => {
    if (!enabled) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        const list = getFocusables();
        const active = document.activeElement;
        const idx = list.indexOf(active as HTMLElement);
        if (idx >= 0) {
          focusIndexRef.current = idx;
          (e.target as HTMLElement).click?.();
        } else {
          moveFocus(1);
          e.preventDefault();
        }
      }
      if (e.key === 'Tab' && !e.shiftKey) {
        moveFocus(1);
        e.preventDefault();
      }
      if (e.key === 'Tab' && e.shiftKey) {
        moveFocus(-1);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [enabled, getFocusables, moveFocus]);

  return (
    <div ref={containerRef} className={className} data-switch-control={enabled ? 'true' : undefined}>
      {children}
    </div>
  );
}

export default SwitchControlManager;
