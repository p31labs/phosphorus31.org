/**
 * Ollama probe utility — list models, health check. 3s timeout so UI doesn't hang.
 * Sovereign AI: no API key. Your hardware, your models.
 */

const DEFAULT_BASE = "http://localhost:11434";
const PROBE_TIMEOUT_MS = 3000;

export interface OllamaModel {
  name: string;
  size: number;
  sizeFormatted: string;
}

function formatSize(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} KB`;
  return `${bytes} B`;
}

/**
 * Fetch with timeout. Aborts after PROBE_TIMEOUT_MS.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = PROBE_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Probe Ollama: list models from /api/tags. Returns empty array on failure or timeout.
 */
export async function listOllamaModels(baseUrl: string = DEFAULT_BASE): Promise<OllamaModel[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/tags`;
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return [];
    const data = (await res.json()) as { models?: Array<{ name: string; size?: number }> };
    const models = data.models ?? [];
    return models.map((m) => ({
      name: m.name,
      size: m.size ?? 0,
      sizeFormatted: formatSize(m.size ?? 0),
    }));
  } catch {
    return [];
  }
}

/**
 * Health check: can we reach Ollama? Returns true if /api/tags returns 200.
 */
export async function probeOllama(baseUrl: string = DEFAULT_BASE): Promise<boolean> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/tags`;
  try {
    const res = await fetchWithTimeout(url);
    return res.ok;
  } catch {
    return false;
  }
}
