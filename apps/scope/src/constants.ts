/**
 * Single source of truth for voltage levels, colors, and labels.
 * Used by VoltageMeter, MessageQueue, and store logic.
 */

export type VoltageLevel = 'green' | 'amber' | 'red' | 'black'

export const VOLTAGE_LEVEL_TO_NUM: Record<VoltageLevel, number> = {
  green: 2,
  amber: 5,
  red: 8,
  black: 10,
}

export const VOLTAGE_COLORS: Record<VoltageLevel, string> = {
  green: '#00FF88',
  amber: '#FFB800',
  red: '#FF00CC',
  black: '#FF00CC',
}

export const VOLTAGE_LABELS: Record<VoltageLevel, string> = {
  green: 'GREEN',
  amber: 'AMBER',
  red: 'RED',
  black: 'BLACK',
}

/** For message queue: priority → voltage level */
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent'

export function priorityToVoltage(p: MessagePriority): VoltageLevel {
  switch (p) {
    case 'urgent': return 'red'
    case 'high': return 'amber'
    case 'low':
    case 'normal':
    default: return 'green'
  }
}

/** Badge style for queue cards (dot + label + glow) */
export const VOLTAGE_BADGE_STYLES: Record<VoltageLevel, { bg: string; label: string; glow: string; outline?: string }> = {
  green: { bg: VOLTAGE_COLORS.green, label: VOLTAGE_LABELS.green, glow: 'rgba(0,255,136,0.4)' },
  amber: { bg: VOLTAGE_COLORS.amber, label: VOLTAGE_LABELS.amber, glow: 'rgba(255,184,0,0.4)' },
  red: { bg: VOLTAGE_COLORS.red, label: VOLTAGE_LABELS.red, glow: 'rgba(255,0,204,0.4)' },
  black: {
    bg: '#1a0000',
    label: VOLTAGE_LABELS.black,
    glow: 'rgba(255,0,0,0.5)',
    outline: '1px solid rgba(255,0,0,0.6)',
  },
}

export function levelToNumeric(level: VoltageLevel): number {
  return VOLTAGE_LEVEL_TO_NUM[level] ?? 2
}
