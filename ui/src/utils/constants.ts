/**
 * Application Constants
 * Centralized constants for P31 ecosystem
 */

// API Endpoints
export const API_ENDPOINTS = {
  BUFFER: {
    BASE: 'http://localhost:4000',
    HEALTH: '/health',
    MESSAGES: '/api/messages',
    QUEUE: '/api/queue/status',
    PING: '/api/ping/status',
    METABOLISM: '/api/metabolism',
    MONITORING: '/api/monitoring',
  },
  CENTAUR: {
    BASE: 'http://localhost:3000',
    HEALTH: '/health',
    CHAT: '/api/chat',
  },
} as const;

// Update Intervals (milliseconds)
export const UPDATE_INTERVALS = {
  METABOLISM: 5000, // 5 seconds
  BUFFER_STATUS: 3000, // 3 seconds
  PING: 30000, // 30 seconds
  GAME_STATE: 1000, // 1 second
} as const;

// Priority Costs (spoons)
export const PRIORITY_COSTS = {
  low: 0.5,
  normal: 1.0,
  high: 1.5,
  urgent: 2.0,
} as const;

// Stress Level Colors
export const STRESS_COLORS = {
  low: '#10b981', // green
  medium: '#f59e0b', // yellow
  high: '#ef4444', // red
  critical: '#dc2626', // dark red
} as const;

// Request Timeouts (milliseconds)
export const REQUEST_TIMEOUTS = {
  DEFAULT: 5000,
  LONG: 30000,
  SHORT: 2000,
} as const;

// Accessibility
export const ACCESSIBILITY = {
  MIN_FONT_SIZE: 12,
  MAX_FONT_SIZE: 32,
  DEFAULT_FONT_SIZE: 16,
  MIN_TOUCH_TARGET: 44, // pixels
} as const;
