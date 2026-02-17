/**
 * P31 Scope — Calm empty states. Not blank, not scary.
 * Posner mark + dim styling (Oxanium 300, #4A4A7A).
 */

import React from 'react';
import { PosnerMark } from './PosnerMark';

const EMPTY_TEXT = '#4A4A7A';

export function ScopeEmptyMessageQueue() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <PosnerMark className="mb-3" />
      <p className="font-light text-[14px]" style={{ color: EMPTY_TEXT, fontFamily: 'Oxanium, sans-serif' }}>
        No messages in queue
      </p>
      <p className="mt-1 text-[12px]" style={{ color: EMPTY_TEXT }}>
        Messages will appear here as they're processed
      </p>
    </div>
  );
}

export function ScopeEmptyAccommodationLog() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <PosnerMark className="mb-3" />
      <p className="font-light text-[14px]" style={{ color: EMPTY_TEXT, fontFamily: 'Oxanium, sans-serif' }}>
        No accommodation events recorded
      </p>
      <p className="mt-1 text-[12px]" style={{ color: EMPTY_TEXT }}>
        Events log automatically as you use the system
      </p>
    </div>
  );
}
