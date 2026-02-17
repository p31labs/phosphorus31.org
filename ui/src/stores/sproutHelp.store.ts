/**
 * Sprout Help Store — Buffer ↔ Sprout
 * When a kid taps "I need help" in P31 Sprout, we surface a low-voltage prompt
 * in The Buffer. No kid data: only "someone needs help" + optional draft prompt.
 * Also emits to mesh (Whale Channel) when NODE ONE is wired via meshAdapter.
 */

import { create } from 'zustand';
import { emitSproutSignal } from '../services/meshAdapter';

const DEFAULT_DRAFT_PROMPT =
  'Can you come help when you have a moment? No rush.';

export interface SproutHelpState {
  /** Someone (no identity) has requested help from Sprout */
  requested: boolean;
  /** Pre-draft text for the operator to send; low-voltage, calm */
  draftPrompt: string;
  /** When the request was set (for optional auto-clear) */
  requestedAt: Date | null;
}

export interface SproutHelpActions {
  /** Call when "I need help" is tapped in Sprout. No kid data. */
  requestHelp: (draftPrompt?: string) => void;
  /** Clear after operator has seen / used the draft */
  clearHelp: () => void;
}

type Store = SproutHelpState & SproutHelpActions;

const initialState: SproutHelpState = {
  requested: false,
  draftPrompt: DEFAULT_DRAFT_PROMPT,
  requestedAt: null,
};

export const useSproutHelpStore = create<Store>((set) => ({
  ...initialState,

  requestHelp: (draftPrompt) => {
    emitSproutSignal('help');
    set({
      requested: true,
      draftPrompt: draftPrompt ?? DEFAULT_DRAFT_PROMPT,
      requestedAt: new Date(),
    });
  },

  clearHelp: () =>
    set({
      requested: false,
      requestedAt: null,
      draftPrompt: DEFAULT_DRAFT_PROMPT,
    }),
}));

export const useSproutHelpRequested = () =>
  useSproutHelpStore((s) => s.requested);
export const useSproutHelpDraft = () =>
  useSproutHelpStore((s) => s.draftPrompt);
