/**
 * P31 Scope — Skeleton loaders for message queue and accommodation log.
 * Surface3 (#1A1A3E) pulse 0.3 → 0.6 → 0.3 over 1.5s ease-in-out.
 * prefers-reduced-motion: static gray, no pulse.
 */

import React from 'react';

const SURFACE3 = '#1A1A3E';

/** Single skeleton card matching message card dimensions (truncated text line + meta line). */
export function ScopeSkeletonCard() {
  return (
    <div
      className="scope-skeleton-card rounded border border-white/5 bg-black/20 px-3 py-2"
      style={{ minHeight: 52 }}
      aria-hidden
    >
      <div
        className="scope-skeleton-line h-3 rounded"
        style={{ backgroundColor: SURFACE3, width: '85%', marginBottom: 8 }}
      />
      <div
        className="scope-skeleton-line h-2.5 rounded"
        style={{ backgroundColor: SURFACE3, width: '40%' }}
      />
    </div>
  );
}

/** Skeleton table row for accommodation log. */
export function ScopeSkeletonTableRow() {
  return (
    <div
      className="scope-skeleton-row flex flex-wrap items-baseline gap-2 rounded border border-white/5 bg-black/20 px-3 py-2"
      style={{ minHeight: 40 }}
      aria-hidden
    >
      <div
        className="scope-skeleton-line h-3 rounded"
        style={{ backgroundColor: SURFACE3, width: '60%' }}
      />
      <div
        className="scope-skeleton-line h-2.5 rounded"
        style={{ backgroundColor: SURFACE3, width: '20%' }}
      />
    </div>
  );
}

/** Three skeleton cards for message queue loading. */
export function ScopeMessageQueueSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading messages">
      <ScopeSkeletonCard />
      <ScopeSkeletonCard />
      <ScopeSkeletonCard />
    </div>
  );
}

/** Skeleton rows for accommodation log loading. */
export function ScopeAccommodationLogSkeleton() {
  return (
    <div className="space-y-2" role="status" aria-label="Loading accommodation log">
      <ScopeSkeletonTableRow />
      <ScopeSkeletonTableRow />
      <ScopeSkeletonTableRow />
    </div>
  );
}
