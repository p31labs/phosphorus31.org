import axios from 'axios';

/**
 * Centralized API client.
 * Uses relative paths so Vite's proxy (/api -> localhost:3001) handles routing.
 * In production, set VITE_API_URL to the backend origin.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Event bus for toast notifications ──────────────────────────
const listeners = new Set();

export const onApiError = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

// Deduplication: suppress the same error message within a 10-second window
const recentMessages = new Map();
const DEDUP_WINDOW_MS = 10_000;

const notify = (type, message) => {
  const now = Date.now();
  const lastShown = recentMessages.get(message);
  if (lastShown && now - lastShown < DEDUP_WINDOW_MS) return;

  recentMessages.set(message, now);
  // Prune stale entries every 20 messages
  if (recentMessages.size > 20) {
    for (const [msg, ts] of recentMessages) {
      if (now - ts > DEDUP_WINDOW_MS) recentMessages.delete(msg);
    }
  }

  listeners.forEach((cb) => cb({ type, message }));
};

// ── Response interceptor ───────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : error.message === 'Network Error'
          ? 'Cannot reach the server. Please check your connection.'
          : 'Something went wrong. Please try again.');

    notify('error', message);
    return Promise.reject(error);
  }
);

export default api;
