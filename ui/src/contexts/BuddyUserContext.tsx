/**
 * P31 Buddy User Context — codename-first identity for World Builder and Buddy.
 * Provides userId, codename, and Buddy memory. Real names never appear here.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { BuddyMemory, BuddyAgeGroup } from '../types/buddy';
import * as buddyMemory from '../lib/buddy/memory';

const USER_ID_KEY = 'p31_buddy_user_id';
const CODENAME_FALLBACK = 'Builder';

function getOrCreateUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id?.trim()) {
    id = 'user-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

interface BuddyUserContextValue {
  userId: string;
  codename: string;
  memory: BuddyMemory | null;
  loading: boolean;
  setCodename: (codename: string) => Promise<void>;
  setAgeGroup: (ageGroup: BuddyAgeGroup) => Promise<void>;
  refreshMemory: () => Promise<void>;
}

const BuddyUserContext = createContext<BuddyUserContextValue | null>(null);

export function BuddyUserProvider({ children }: { children: React.ReactNode }) {
  const [userId] = useState(getOrCreateUserId);
  const [memory, setMemory] = useState<BuddyMemory | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMemory = useCallback(async () => {
    const m = await buddyMemory.getBuddyMemory(userId);
    setMemory(m);
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const m = await buddyMemory.getBuddyMemory(userId);
      if (!cancelled) {
        setMemory(m);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const setCodename = useCallback(
    async (codename: string) => {
      const trimmed = codename.trim() || CODENAME_FALLBACK;
      const updated = await buddyMemory.updateCodename(userId, trimmed);
      setMemory(updated);
    },
    [userId]
  );

  const codename = memory?.codename ?? CODENAME_FALLBACK;

  const setAgeGroup = useCallback(
    async (ageGroup: BuddyAgeGroup) => {
      const m = memory ?? (await buddyMemory.ensureBuddyMemory(userId, codename, ageGroup));
      const updated = { ...m, ageGroup, lastSeen: Date.now() };
      await buddyMemory.setBuddyMemory(updated);
      setMemory(updated);
    },
    [userId, memory, codename]
  );

  const value: BuddyUserContextValue = {
    userId,
    codename,
    memory,
    loading,
    setCodename,
    setAgeGroup,
    refreshMemory,
  };

  return <BuddyUserContext.Provider value={value}>{children}</BuddyUserContext.Provider>;
}

export function useBuddyUser(): BuddyUserContextValue {
  const ctx = useContext(BuddyUserContext);
  if (!ctx) {
    return {
      userId: '',
      codename: CODENAME_FALLBACK,
      memory: null,
      loading: false,
      setCodename: async () => {},
      setAgeGroup: async () => {},
      refreshMemory: async () => {},
    };
  }
  return ctx;
}
