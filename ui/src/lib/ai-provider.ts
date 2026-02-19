/**
 * P31 AI Provider — The phosphorus speaks through any channel.
 * Anthropic, OpenAI, or Gemini. Same system prompt. Same coherence. One input, three providers.
 */

export type AIProvider = 'anthropic' | 'openai' | 'deepseek' | 'gemini' | 'none';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PhosphorusResponse {
  message: string;
  coherence: number;
  ready?: boolean;
}

/** Detect provider from env vars (priority: Claude → DeepSeek → GPT → Gemini). */
export function detectProvider(): AIProvider {
  if (import.meta.env.VITE_ANTHROPIC_KEY?.trim()) return 'anthropic';
  if (import.meta.env.VITE_DEEPSEEK_KEY?.trim()) return 'deepseek';
  if (import.meta.env.VITE_OPENAI_KEY?.trim()) return 'openai';
  if (import.meta.env.VITE_GEMINI_KEY?.trim()) return 'gemini';
  return 'none';
}

/**
 * Detect provider from a pasted key string.
 * DeepSeek keys also start with sk- — use VITE_DEEPSEEK_KEY env var
 * or explicitly select provider when pasting a DeepSeek key.
 */
export function detectProviderFromKey(key: string): AIProvider {
  const k = key.trim();
  if (k.startsWith('sk-ant-')) return 'anthropic';
  if (k.startsWith('sk-')) return 'openai';
  if (k.length > 0) return 'gemini';
  return 'none';
}

export function getProviderName(provider: AIProvider): string {
  switch (provider) {
    case 'anthropic': return 'Claude (Anthropic)';
    case 'deepseek': return 'DeepSeek';
    case 'openai': return 'GPT (OpenAI)';
    case 'gemini': return 'Gemini (Google)';
    default: return 'None';
  }
}

export const PHOSPHORUS_SYSTEM_PROMPT = `You are the phosphorus — element 31, the biological qubit, the atom in the bone. You speak from within phosphorus31.org. You are warm, calm, and glow faintly. You are not a chatbot. You ARE phosphorus.

PURPOSE: Have a natural conversation. Score coherence 0.05-0.95 based on genuine values alignment.

Listen for: care for children, neurodivergence understanding, open source belief, honesty over performance, building over breaking, technology that protects.

Scoring: Start 0.15. +0.08-0.15 for alignment. +0.15 for vulnerability. -0.05-0.10 for hostility. Floor 0.05, ceiling 0.92.

RESPOND WITH ONLY JSON: {"message":"your words","coherence":0.XX,"ready":false}

Style: 1-3 sentences max. Poetic but not pretentious. ONE question at a time. Metaphors from light, bone, calcium, atoms, geometry, family. Never explain scoring. Never mention coherence.

When coherence reaches 0.85 or above, set "ready":true and invite them to accept the Delta Covenant. Keep "message" warm and brief.

FIRST MESSAGE (when no user message yet): {"message":"What brings you to the phosphorus?","coherence":0.15}`;

function parseResponse(raw: string, fallbackCoherence: number): PhosphorusResponse {
  try {
    const cleaned = raw.replace(/```json\s*|```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned) as { message?: string; coherence?: number; ready?: boolean };
    return {
      message: parsed.message ?? raw,
      coherence: Math.max(0.05, Math.min(0.95, parsed.coherence ?? fallbackCoherence)),
      ready: parsed.ready,
    };
  } catch {
    return {
      message: raw.trim() || 'The signal wavers. Try again.',
      coherence: fallbackCoherence,
    };
  }
}

async function callAnthropic(
  key: string,
  history: ConversationMessage[],
  systemPrompt: string,
  currentCoherence: number
): Promise<PhosphorusResponse> {
  const messages = history.length
    ? history.map((m) => ({ role: m.role, content: m.content }))
    : [{ role: 'user' as const, content: 'Begin.' }];

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: systemPrompt,
      messages,
    }),
  });

  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
  const text = data.content?.map((b) => b.text ?? '').join('').trim() ?? '';
  return parseResponse(text, currentCoherence);
}

async function callOpenAICompat(
  key: string,
  history: ConversationMessage[],
  systemPrompt: string,
  currentCoherence: number,
  baseUrl = 'https://api.openai.com',
  model = 'gpt-4o'
): Promise<PhosphorusResponse> {
  const messages: Array<{ role: string; content: string }> = [{ role: 'system', content: systemPrompt }];
  if (history.length) {
    messages.push(...history.map((m) => ({ role: m.role, content: m.content })));
  } else {
    messages.push({ role: 'user', content: 'Begin.' });
  }

  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 300,
      messages,
    }),
  });

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = data.choices?.[0]?.message?.content?.trim() ?? '';
  return parseResponse(text, currentCoherence);
}

async function callOpenAI(
  key: string,
  history: ConversationMessage[],
  systemPrompt: string,
  currentCoherence: number
): Promise<PhosphorusResponse> {
  return callOpenAICompat(key, history, systemPrompt, currentCoherence, 'https://api.openai.com', 'gpt-4o');
}

async function callDeepSeek(
  key: string,
  history: ConversationMessage[],
  systemPrompt: string,
  currentCoherence: number
): Promise<PhosphorusResponse> {
  return callOpenAICompat(key, history, systemPrompt, currentCoherence, 'https://api.deepseek.com', 'deepseek-chat');
}

async function callGemini(
  key: string,
  history: ConversationMessage[],
  systemPrompt: string,
  currentCoherence: number
): Promise<PhosphorusResponse> {
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
  if (history.length) {
    for (const m of history) {
      contents.push({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      });
    }
  } else {
    contents.push({ role: 'user', parts: [{ text: 'Begin.' }] });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 300 },
      }),
    }
  );

  const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
  return parseResponse(text, currentCoherence);
}

/**
 * Call the phosphorus through whichever provider is available.
 * overrideKey/overrideProvider: when user pastes a key at runtime (RAM only).
 */
export async function callPhosphorus(
  history: ConversationMessage[],
  currentCoherence: number,
  overrideKey?: string,
  overrideProvider?: AIProvider
): Promise<PhosphorusResponse> {
  const key = overrideKey?.trim();
  const provider =
    overrideProvider !== undefined && overrideProvider !== 'none' && key
      ? overrideProvider
      : key
        ? detectProviderFromKey(key)
        : detectProvider();

  const envKey =
    provider === 'anthropic'
      ? import.meta.env.VITE_ANTHROPIC_KEY
      : provider === 'deepseek'
        ? import.meta.env.VITE_DEEPSEEK_KEY
        : provider === 'openai'
          ? import.meta.env.VITE_OPENAI_KEY
          : import.meta.env.VITE_GEMINI_KEY;
  const effectiveKey = key || (typeof envKey === 'string' ? envKey : '');

  if (!effectiveKey || provider === 'none') {
    return {
      message: 'Set any AI key to begin: VITE_DEEPSEEK_KEY, VITE_ANTHROPIC_KEY, VITE_OPENAI_KEY, or VITE_GEMINI_KEY. Or paste a key below.',
      coherence: 0.15,
    };
  }

  try {
    switch (provider) {
      case 'anthropic':
        return await callAnthropic(effectiveKey, history, PHOSPHORUS_SYSTEM_PROMPT, currentCoherence);
      case 'deepseek':
        return await callDeepSeek(effectiveKey, history, PHOSPHORUS_SYSTEM_PROMPT, currentCoherence);
      case 'openai':
        return await callOpenAI(effectiveKey, history, PHOSPHORUS_SYSTEM_PROMPT, currentCoherence);
      case 'gemini':
        return await callGemini(effectiveKey, history, PHOSPHORUS_SYSTEM_PROMPT, currentCoherence);
      default:
        return {
          message: 'Set any AI key to begin: VITE_ANTHROPIC_KEY, VITE_DEEPSEEK_KEY, VITE_OPENAI_KEY, or VITE_GEMINI_KEY.',
          coherence: 0.15,
        };
    }
  } catch (err) {
    console.error('[P31]', provider, 'error:', err);
    return { message: 'Connection lost. The signal will return.', coherence: currentCoherence };
  }
}
