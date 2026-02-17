/**
 * MATA Demo — Synthetic data engine
 *
 * Narrative: Dysregulation → Intervention → Stability.
 * Powers the cockpit timeline and 3D Buffer (icosahedron) behavior.
 */

import { P31 } from '@p31/config';

export interface DemoTimePoint {
  time: string;
  voltage: number;
  spoons: number;
  label: string;
  color: string;
}

/** The "neurodivergent day" timeline for the MATA demo. */
export const DEMO_TIMELINE: DemoTimePoint[] = [
  {
    time: '08:00',
    voltage: 3.2,
    spoons: 10,
    label: 'Waking State',
    color: P31.tokens.phosphorus,
  },
  {
    time: '10:15',
    voltage: 7.8,
    spoons: 8,
    label: 'Context Switch Spike',
    color: P31.tokens.amber,
  },
  {
    time: '10:20',
    voltage: 6.5,
    spoons: 7,
    label: 'Haptic Intervention',
    color: P31.tokens.calcium,
  },
  {
    time: '14:30',
    voltage: 9.1,
    spoons: 3,
    label: 'Sensory Overload',
    color: P31.tokens.crimson,
  },
  {
    time: '15:00',
    voltage: 5.2,
    spoons: 2,
    label: 'Recovery/Grounding',
    color: P31.tokens.slate,
  },
];

export interface MeshLogEntry {
  id: string;
  from: string;
  msg: string;
  rssi: number;
}

/** Mock LoRa mesh traffic for the live log terminal. */
export const MESH_LOGS: MeshLogEntry[] = [
  {
    id: 'rx-1',
    from: 'N1-WILL',
    msg: 'VOLTAGE_CRITICAL (9.1V)',
    rssi: -78,
  },
  {
    id: 'tx-1',
    from: 'SYSTEM',
    msg: 'HAPTIC_FIRE: PULSE_HEAVY',
    rssi: 0,
  },
  {
    id: 'rx-2',
    from: 'N1-WILL',
    msg: 'ACK_HAPTIC',
    rssi: -80,
  },
];

/** Max spoons in the demo (for gauge scale). */
export const DEMO_MAX_SPOONS = 12;
