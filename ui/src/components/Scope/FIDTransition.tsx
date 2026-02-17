/**
 * P31 Scope — FIDTransition: smooth view transition (First Input Delay–aware).
 * Wraps route/content changes with spring-like opacity + slight transform.
 */

import React, { useEffect, useState } from 'react';
import { useAnimationEnabled } from '@/store/useSensoryStore';

export interface FIDTransitionProps {
  children: React.ReactNode;
  /** Unique key for the current view (e.g. route or section id). */
  viewKey: string;
  className?: string;
  duration?: number;
}

export function FIDTransition({
  children,
  viewKey,
  className = '',
  duration = 280,
}: FIDTransitionProps) {
  const animationEnabled = useAnimationEnabled();
  const [displayKey, setDisplayKey] = useState(viewKey);
  const [isEntering, setIsEntering] = useState(true);
  const [content, setContent] = useState(children);

  useEffect(() => {
    if (viewKey === displayKey) {
      setContent(children);
      return;
    }
    setIsEntering(false);
    const exitTimer = setTimeout(() => {
      setDisplayKey(viewKey);
      setContent(children);
      setIsEntering(true);
    }, animationEnabled ? duration : 0);

    return () => clearTimeout(exitTimer);
  }, [viewKey, children, displayKey, duration, animationEnabled]);

  const transitionStyle = animationEnabled
    ? {
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        opacity: isEntering ? 1 : 0,
        transform: isEntering ? 'translateY(0)' : 'translateY(6px)',
      }
    : { opacity: 1, transform: 'none' };

  return (
    <div className={`scope-fid-transition ${className}`} style={transitionStyle}>
      {content}
    </div>
  );
}
