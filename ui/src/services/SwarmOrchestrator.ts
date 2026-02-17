/**
 * SwarmOrchestrator — top-down layer that listens to coherence and voice,
 * and issues swarm goals so the swarm, Buddy, and coherence act as one system.
 */

import { useSwarmStore } from '../stores/swarm.store';
import { useCoherenceStore } from '../stores/coherence.store';

const COHERENCE_LOW = 0.4;
const COHERENCE_HIGH = 0.8;

export function initSwarmOrchestrator(): () => void {
  let prevCoherence = useCoherenceStore.getState().globalCoherence;

  const unsubCoherence = useCoherenceStore.subscribe(() => {
    const coherence = useCoherenceStore.getState().globalCoherence;
    const currentGoal = useSwarmStore.getState().goal;

    if (coherence < COHERENCE_LOW && prevCoherence >= COHERENCE_LOW) {
      if (currentGoal?.type !== 'repair') {
        if (import.meta.env?.DEV) console.log('[orchestrator] coherence dropped below', COHERENCE_LOW, '→ goal=repair');
        useSwarmStore.getState().setGoal({ type: 'repair', priority: 10 });
        buddySay('Coherence is dropping. Swarm, focus on repairs.');
      }
    } else if (coherence > COHERENCE_HIGH && prevCoherence <= COHERENCE_HIGH) {
      if (!currentGoal || currentGoal.type === 'explore') {
        if (import.meta.env?.DEV) console.log('[orchestrator] coherence above', COHERENCE_HIGH, '→ goal=sierpinski');
        useSwarmStore.getState().setGoal({ type: 'sierpinski', depth: 3 });
        buddySay("Coherence is high! Swarm, let's build a Sierpinski tetrahedron.");
      }
    } else if (coherence > 0.6 && currentGoal?.type === 'repair') {
      if (import.meta.env?.DEV) console.log('[orchestrator] coherence restored → goal=explore');
      useSwarmStore.getState().setGoal({ type: 'explore' });
      buddySay('Coherence restored. Swarm, resume exploration.');
    } else if (
      coherence >= COHERENCE_LOW &&
      coherence <= COHERENCE_HIGH &&
      prevCoherence > COHERENCE_HIGH &&
      currentGoal?.type === 'sierpinski'
    ) {
      // Just dropped from high into middle band → revert to explore (test plan step 8)
      if (import.meta.env?.DEV) console.log('[orchestrator] coherence in middle band → goal=explore');
      useSwarmStore.getState().setGoal({ type: 'explore' });
      buddySay('Coherence steady. Swarm, explore.');
    }

    prevCoherence = coherence;
  });

  function buddySay(message: string): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('buddy-say', { detail: { message } }));
    }
  }

  const handleVoiceCommand = (e: Event): void => {
    const ev = e as CustomEvent<string>;
    const command = (ev.detail ?? '').toLowerCase().trim();
    if (!command) return;
    if (import.meta.env?.DEV) console.log('[orchestrator] voice-command received:', command);

    const swarm = useSwarmStore.getState();

    if (/build\s+sierpinski|sierpinski\s+(depth\s+)?\d+|depth\s+\d+/.test(command)) {
      const match = command.match(/\d+/);
      const depth = Math.min(6, Math.max(1, parseInt(match?.[0] ?? '3', 10) || 3));
      swarm.setGoal({ type: 'sierpinski', depth });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('buddy-say', {
            detail: { message: `Setting swarm to build Sierpiński depth ${depth}.` },
          })
        );
      }
      return;
    }

    if (/repair|fix|weak/.test(command)) {
      swarm.setGoal({ type: 'repair', priority: 10 });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('buddy-say', { detail: { message: 'Swarm, focus on repairs.' } })
        );
      }
      return;
    }

    if (/explore|wander/.test(command)) {
      swarm.setGoal({ type: 'explore' });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('buddy-say', { detail: { message: 'Swarm, explore.' } })
        );
      }
      return;
    }

    if (/stop|pause|clear\s*swarm/.test(command)) {
      swarm.setGoal(null);
      swarm.setRunning(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('buddy-say', { detail: { message: 'Swarm stopped.' } })
        );
      }
      return;
    }

    if (/start|resume|run/.test(command)) {
      swarm.setRunning(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('buddy-say', { detail: { message: 'Swarm resumed.' } })
        );
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('voice-command', handleVoiceCommand);
  }

  return () => {
    unsubCoherence();
    if (typeof window !== 'undefined') {
      window.removeEventListener('voice-command', handleVoiceCommand);
    }
  };
}
