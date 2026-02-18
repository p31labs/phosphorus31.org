/**
 * Sovereign API Bridge — Connects P31 to external services with local token storage.
 *
 * All connections are OPTIONAL. The app works with zero connections.
 * All tokens stored in localStorage with p31:oauth: prefix — never sent to any P31 server.
 *
 * Services:
 *   - Google (Calendar, Gmail subjects, Tasks) via OAuth 2.0 PKCE
 *   - Gemini API via stored key
 *   - GAS Backend via gas-bridge.ts
 */

/* ── Types ── */

export interface BridgeResponse<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
  source: 'api' | 'local' | 'offline';
  timestamp: number;
}

export interface ServiceStatus {
  id: string;
  name: string;
  connected: boolean;
  lastSync: number | null;
  dataCount: number;
  error: string | null;
}

interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  scope: string;
}

interface PKCEChallenge {
  verifier: string;
  challenge: string;
}

/* ── Constants ── */

const TOKEN_PREFIX = 'p31:oauth:';
const GOOGLE_TOKEN_KEY = `${TOKEN_PREFIX}google:tokens`;
const GOOGLE_CLIENT_KEY = `${TOKEN_PREFIX}google:client_id`;
const GEMINI_KEY = `${TOKEN_PREFIX}gemini:key`;
const GEMINI_COUNTER_KEY = `${TOKEN_PREFIX}gemini:requests`;

// Google OAuth endpoints
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Scopes — read-only where possible
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/tasks.readonly',
].join(' ');

/* ── PKCE Helpers ── */

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values).map((v) => chars[v % chars.length]).join('');
}

async function generatePKCE(): Promise<PKCEChallenge> {
  const verifier = generateRandomString(128);
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return { verifier, challenge };
}

/* ── Token Storage ── */

function getGoogleTokens(): GoogleTokens | null {
  try {
    const raw = localStorage.getItem(GOOGLE_TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GoogleTokens;
  } catch {
    return null;
  }
}

function saveGoogleTokens(tokens: GoogleTokens): void {
  localStorage.setItem(GOOGLE_TOKEN_KEY, JSON.stringify(tokens));
}

function clearGoogleTokens(): void {
  localStorage.removeItem(GOOGLE_TOKEN_KEY);
  localStorage.removeItem(`${TOKEN_PREFIX}google:pkce`);
}

function isGoogleTokenValid(): boolean {
  const tokens = getGoogleTokens();
  if (!tokens) return false;
  return Date.now() < tokens.expires_at - 60000; // 1-minute buffer
}

/* ── Google OAuth PKCE Flow ── */

/**
 * Start Google OAuth PKCE flow. Opens popup window.
 * Requires a client ID configured in localStorage.
 */
export async function startGoogleAuth(): Promise<void> {
  const clientId = localStorage.getItem(GOOGLE_CLIENT_KEY);
  if (!clientId) {
    throw new Error('Google Client ID not configured. Set it in Connections.');
  }

  const pkce = await generatePKCE();
  localStorage.setItem(`${TOKEN_PREFIX}google:pkce`, pkce.verifier);

  const redirectUri = `${window.location.origin}/connections`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPES,
    code_challenge: pkce.challenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
  });

  window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * Handle OAuth callback — exchange code for tokens.
 * Call this when /connections loads with ?code= in the URL.
 */
export async function handleGoogleCallback(code: string): Promise<boolean> {
  const clientId = localStorage.getItem(GOOGLE_CLIENT_KEY);
  const verifier = localStorage.getItem(`${TOKEN_PREFIX}google:pkce`);

  if (!clientId || !verifier) return false;

  const redirectUri = `${window.location.origin}/connections`;

  try {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        code,
        code_verifier: verifier,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!res.ok) return false;

    const data = (await res.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      scope: string;
    };

    saveGoogleTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
      scope: data.scope,
    });

    // Clean up PKCE verifier and URL
    localStorage.removeItem(`${TOKEN_PREFIX}google:pkce`);
    window.history.replaceState({}, '', '/connections');
    return true;
  } catch {
    return false;
  }
}

/**
 * Refresh Google access token using refresh token.
 */
async function refreshGoogleToken(): Promise<boolean> {
  const tokens = getGoogleTokens();
  const clientId = localStorage.getItem(GOOGLE_CLIENT_KEY);
  if (!tokens?.refresh_token || !clientId) return false;

  try {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        refresh_token: tokens.refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    if (!res.ok) return false;

    const data = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };

    saveGoogleTokens({
      ...tokens,
      access_token: data.access_token,
      expires_at: Date.now() + data.expires_in * 1000,
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Get a valid Google access token, refreshing if needed.
 */
async function getGoogleAccessToken(): Promise<string | null> {
  if (isGoogleTokenValid()) {
    return getGoogleTokens()!.access_token;
  }

  const refreshed = await refreshGoogleToken();
  if (refreshed) {
    return getGoogleTokens()!.access_token;
  }

  return null;
}

/* ── Google API Calls ── */

async function googleGet<T>(endpoint: string): Promise<BridgeResponse<T>> {
  const token = await getGoogleAccessToken();
  if (!token) {
    return { ok: false, data: null, error: 'Not authenticated', source: 'offline', timestamp: Date.now() };
  }

  try {
    const res = await fetch(`https://www.googleapis.com${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      if (res.status === 401) {
        clearGoogleTokens();
        return { ok: false, data: null, error: 'Token expired', source: 'offline', timestamp: Date.now() };
      }
      return { ok: false, data: null, error: `API error: ${res.status}`, source: 'api', timestamp: Date.now() };
    }

    const data = (await res.json()) as T;
    return { ok: true, data, error: null, source: 'api', timestamp: Date.now() };
  } catch (err) {
    return { ok: false, data: null, error: String(err), source: 'offline', timestamp: Date.now() };
  }
}

/**
 * Get upcoming calendar events (next 7 days).
 */
export async function getCalendarEvents(): Promise<BridgeResponse<Array<{ summary: string; start: string; end: string }>>> {
  const now = new Date();
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    timeMin: now.toISOString(),
    timeMax: weekLater.toISOString(),
    maxResults: '20',
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  const result = await googleGet<{ items?: Array<{ summary: string; start: { dateTime?: string; date?: string }; end: { dateTime?: string; date?: string } }> }>(
    `/calendar/v3/calendars/primary/events?${params}`
  );

  if (!result.ok || !result.data?.items) {
    return { ...result, data: null };
  }

  const events = result.data.items.map((e) => ({
    summary: e.summary || '(untitled)',
    start: e.start.dateTime || e.start.date || '',
    end: e.end.dateTime || e.end.date || '',
  }));

  return { ok: true, data: events, error: null, source: 'api', timestamp: Date.now() };
}

/**
 * Get recent Gmail subjects (no message body — just subjects for voltage assessment).
 */
export async function getGmailSubjects(): Promise<BridgeResponse<Array<{ subject: string; from: string; date: string }>>> {
  const result = await googleGet<{ messages?: Array<{ id: string }> }>(
    '/gmail/v1/users/me/messages?maxResults=10&labelIds=INBOX'
  );

  if (!result.ok || !result.data?.messages) {
    return { ...result, data: null };
  }

  const subjects: Array<{ subject: string; from: string; date: string }> = [];
  for (const msg of result.data.messages.slice(0, 10)) {
    const detail = await googleGet<{ payload?: { headers?: Array<{ name: string; value: string }> } }>(
      `/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`
    );

    if (detail.ok && detail.data?.payload?.headers) {
      const headers = detail.data.payload.headers;
      subjects.push({
        subject: headers.find((h) => h.name === 'Subject')?.value || '(no subject)',
        from: headers.find((h) => h.name === 'From')?.value || 'unknown',
        date: headers.find((h) => h.name === 'Date')?.value || '',
      });
    }
  }

  return { ok: true, data: subjects, error: null, source: 'api', timestamp: Date.now() };
}

/**
 * Get Google Tasks lists and items.
 */
export async function getTaskLists(): Promise<BridgeResponse<Array<{ title: string; tasks: Array<{ title: string; status: string }> }>>> {
  const result = await googleGet<{ items?: Array<{ id: string; title: string }> }>(
    '/tasks/v1/users/@me/lists'
  );

  if (!result.ok || !result.data?.items) {
    return { ...result, data: null };
  }

  const lists: Array<{ title: string; tasks: Array<{ title: string; status: string }> }> = [];
  for (const list of result.data.items.slice(0, 5)) {
    const tasksResult = await googleGet<{ items?: Array<{ title: string; status: string }> }>(
      `/tasks/v1/lists/${list.id}/tasks?maxResults=20`
    );

    lists.push({
      title: list.title,
      tasks: tasksResult.ok && tasksResult.data?.items
        ? tasksResult.data.items.map((t) => ({ title: t.title, status: t.status }))
        : [],
    });
  }

  return { ok: true, data: lists, error: null, source: 'api', timestamp: Date.now() };
}

/* ── Gemini API ── */

/**
 * Check if Gemini API key is configured.
 */
export function isGeminiConfigured(): boolean {
  return !!localStorage.getItem(GEMINI_KEY);
}

/**
 * Store Gemini API key.
 */
export function setGeminiKey(key: string): void {
  localStorage.setItem(GEMINI_KEY, key);
}

/**
 * Clear Gemini API key.
 */
export function clearGeminiKey(): void {
  localStorage.removeItem(GEMINI_KEY);
  localStorage.removeItem(GEMINI_COUNTER_KEY);
}

/**
 * Get Gemini request count.
 */
export function getGeminiRequestCount(): number {
  return parseInt(localStorage.getItem(GEMINI_COUNTER_KEY) || '0', 10);
}

/**
 * Call Gemini API with a prompt.
 */
export async function callGemini(prompt: string, model: string = 'gemini-2.0-flash'): Promise<BridgeResponse<string>> {
  const key = localStorage.getItem(GEMINI_KEY);
  if (!key) {
    return { ok: false, data: null, error: 'Gemini API key not configured', source: 'offline', timestamp: Date.now() };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      return { ok: false, data: null, error: `Gemini API error: ${res.status}`, source: 'api', timestamp: Date.now() };
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Increment request counter
    const count = getGeminiRequestCount() + 1;
    localStorage.setItem(GEMINI_COUNTER_KEY, String(count));

    return { ok: true, data: text, error: null, source: 'api', timestamp: Date.now() };
  } catch (err) {
    return { ok: false, data: null, error: String(err), source: 'offline', timestamp: Date.now() };
  }
}

/* ── Service Status ── */

/**
 * Get status of all configured services.
 */
export function getAllServiceStatus(): ServiceStatus[] {
  const googleTokens = getGoogleTokens();
  const geminiKey = localStorage.getItem(GEMINI_KEY);
  const gasUrl = localStorage.getItem('p31:gas-url') || '';

  return [
    {
      id: 'google',
      name: 'Google (Calendar, Gmail, Tasks)',
      connected: isGoogleTokenValid(),
      lastSync: googleTokens?.expires_at ? googleTokens.expires_at - 3600000 : null,
      dataCount: 0,
      error: googleTokens && !isGoogleTokenValid() ? 'Token expired — reconnect' : null,
    },
    {
      id: 'gemini',
      name: 'Gemini AI',
      connected: !!geminiKey,
      lastSync: null,
      dataCount: getGeminiRequestCount(),
      error: null,
    },
    {
      id: 'gas',
      name: 'GAS Backend (Shelter)',
      connected: !!gasUrl,
      lastSync: null,
      dataCount: 0,
      error: null,
    },
  ];
}

/* ── Google Config ── */

export function setGoogleClientId(clientId: string): void {
  localStorage.setItem(GOOGLE_CLIENT_KEY, clientId);
}

export function getGoogleClientId(): string {
  return localStorage.getItem(GOOGLE_CLIENT_KEY) || '';
}

export function isGoogleConnected(): boolean {
  return isGoogleTokenValid();
}

export function disconnectGoogle(): void {
  clearGoogleTokens();
}

export function disconnectGemini(): void {
  clearGeminiKey();
}
