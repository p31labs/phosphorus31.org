/**
 * @license
 * Copyright 2026 P31 Labs
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * USE QUANTUM COHERENCE HOOK
 * Integrates quantum coherence with heartbeat/spoons system
 */

import { useEffect } from 'react';
import { useQuantumStore, useCoherence } from '../stores/quantum.store';
import { useHeartbeatStore } from '../stores/heartbeat.store';

/**
 * Hook to sync quantum coherence with heartbeat/spoons
 * High spoons = high coherence, low spoons = decoherence
 */
export function useQuantumCoherence() {
  const coherence = useCoherence();
  const demoMode = useQuantumStore((state) => state.demoMode);
  const updateCoherence = useQuantumStore((state) => state.updateCoherence);
  const updatePhase = useQuantumStore((state) => state.updatePhase);
  const spoons = useHeartbeatStore((state) => state.operator.spoons);
  const maxSpoons = useHeartbeatStore((state) => state.operator.maxSpoons);
  const heartbeatPercent = useHeartbeatStore((state) => state.operator.heartbeatPercent);

  useEffect(() => {
    if (demoMode) return; // MATA demo drives coherence via timeline
    // Calculate target coherence from spoons (0-1 scale)
    const targetCoherence = Math.max(0.3, Math.min(1.0, spoons / maxSpoons));

    // Smooth transition to target coherence
    const currentCoherence = coherence;
    const diff = targetCoherence - currentCoherence;
    const step = diff * 0.1; // 10% step per update

    if (Math.abs(diff) > 0.01) {
      updateCoherence(currentCoherence + step, 'spoons-sync');
    }

    // Update phase based on heartbeat (0.1 Hz resonance)
    const phaseIncrement = (heartbeatPercent / 100) * 0.001;
    const currentPhase = useQuantumStore.getState().quantumState.phase;
    updatePhase(currentPhase + phaseIncrement);
  }, [demoMode, spoons, maxSpoons, heartbeatPercent, coherence, updateCoherence, updatePhase]);

  return {
    coherence,
    targetCoherence: Math.max(0.3, Math.min(1.0, spoons / maxSpoons)),
    phase: useQuantumStore((state) => state.quantumState.phase),
  };
}

/**
 * Hook to get quantum-aware UI styles
 */
export function useQuantumUI() {
  const { glowIntensity, animationSpeed, colorShift, particleDensity } = useQuantumStore(
    (state) => state.uiAdaptation
  );
  const coherence = useCoherence();

  return {
    glowIntensity,
    animationSpeed,
    colorShift,
    particleDensity,
    coherence,
    glowColor: `hsla(180, 80%, 60%, ${glowIntensity * 0.6})`,
    borderGlow: `0 0 ${glowIntensity * 8}px hsla(180, 80%, 60%, ${glowIntensity * 0.6})`,
  };
}
