import { create } from "zustand";
import { listOllamaModels, probeOllama, type OllamaModel } from "@/lib/ollama";

export type AIProvider = "demo" | "ollama" | "deepseek" | "openai-compat" | "anthropic";
export type ConnectionStatus = "idle" | "testing" | "ok" | "error";

const STORAGE_KEY = "p31_ai_provider";
const DEFAULT_OLLAMA_URL = "http://localhost:11434";

interface PersistedState {
  provider: AIProvider;
  ollamaUrl: string;
  model: string;
  apiKey: string;
  baseUrl: string;
}

function loadPersisted(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      return {
        provider: parsed.provider ?? "demo",
        ollamaUrl: parsed.ollamaUrl ?? DEFAULT_OLLAMA_URL,
        model: parsed.model ?? "",
        apiKey: parsed.apiKey ?? "",
        baseUrl: parsed.baseUrl ?? "https://api.deepseek.com",
      };
    }
  } catch { /* corrupt */ }
  return {};
}

function persist(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota */ }
}

interface ProviderState extends PersistedState {
  availableModels: OllamaModel[];
  connectionStatus: ConnectionStatus;
  connectionError: string;

  setProvider: (p: AIProvider) => void;
  setOllamaUrl: (url: string) => void;
  setModel: (m: string) => void;
  setApiKey: (k: string) => void;
  setBaseUrl: (url: string) => void;
  setConnectionStatus: (s: ConnectionStatus, err?: string) => void;

  /** Fetch models from Ollama; sets availableModels and connectionStatus. */
  probeOllama: () => Promise<void>;
  /** Send a minimal chat request to current provider; sets connectionStatus. */
  testConnection: () => Promise<void>;
}

const initial = loadPersisted();

export const useProviderStore = create<ProviderState>((set, get) => ({
  provider: initial.provider ?? "demo",
  ollamaUrl: initial.ollamaUrl ?? DEFAULT_OLLAMA_URL,
  model: initial.model ?? "",
  apiKey: initial.apiKey ?? "",
  baseUrl: initial.baseUrl ?? "https://api.deepseek.com",
  availableModels: [],
  connectionStatus: "idle",
  connectionError: "",

  setProvider: (p) => {
    set({ provider: p });
    const s = get();
    persist({ provider: p, ollamaUrl: s.ollamaUrl, model: s.model, apiKey: s.apiKey, baseUrl: s.baseUrl });
  },
  setOllamaUrl: (url) => {
    set({ ollamaUrl: url });
    const s = get();
    persist({ provider: s.provider, ollamaUrl: url, model: s.model, apiKey: s.apiKey, baseUrl: s.baseUrl });
  },
  setModel: (m) => {
    set({ model: m });
    const s = get();
    persist({ provider: s.provider, ollamaUrl: s.ollamaUrl, model: m, apiKey: s.apiKey, baseUrl: s.baseUrl });
  },
  setApiKey: (k) => {
    set({ apiKey: k });
    const s = get();
    persist({ provider: s.provider, ollamaUrl: s.ollamaUrl, model: s.model, apiKey: k, baseUrl: s.baseUrl });
  },
  setBaseUrl: (url) => {
    set({ baseUrl: url });
    const s = get();
    persist({ provider: s.provider, ollamaUrl: s.ollamaUrl, model: s.model, apiKey: s.apiKey, baseUrl: url });
  },
  setConnectionStatus: (s, err) => set({ connectionStatus: s, connectionError: err ?? "" }),

  probeOllama: async () => {
    const { ollamaUrl } = get();
    set({ connectionStatus: "testing", connectionError: "" });
    const models = await listOllamaModels(ollamaUrl);
    const ok = models.length >= 0; // listOllamaModels returns [] on failure; 200 = we got a response
    const reachable = await probeOllama(ollamaUrl);
    set({
      availableModels: models,
      connectionStatus: reachable ? "ok" : "error",
      connectionError: reachable ? "" : "Ollama not reachable. Is it running?",
    });
  },

  testConnection: async () => {
    const state = get();
    set({ connectionStatus: "testing", connectionError: "" });

    const baseUrl =
      state.provider === "ollama"
        ? state.ollamaUrl.replace(/\/$/, "")
        : state.baseUrl.replace(/\/$/, "");
    const model = state.provider === "ollama" ? (state.model || "llama3.2") : state.model || "deepseek-chat";
    const needsKey = state.provider !== "ollama" && state.provider !== "demo";
    if (needsKey && !state.apiKey?.trim()) {
      set({ connectionStatus: "error", connectionError: "API key required" });
      return;
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (state.provider !== "ollama" && state.apiKey?.trim()) {
      headers.Authorization = `Bearer ${state.apiKey.trim()}`;
    }

    try {
      const res = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "Hi" }],
          max_tokens: 5,
        }),
      });
      if (res.ok) {
        set({ connectionStatus: "ok", connectionError: "" });
      } else {
        const text = await res.text();
        set({ connectionStatus: "error", connectionError: `${res.status}: ${text.slice(0, 80)}` });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      set({ connectionStatus: "error", connectionError: msg });
    }
  },
}));

/** For tandem-ai: get config for the current request. Store first, then env, then demo. */
export function getProviderConfig(): {
  provider: AIProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
  useDemo: boolean;
} {
  const state = useProviderStore.getState();

  // Store says use a real provider with enough config
  if (state.provider === "ollama" && state.ollamaUrl) {
    return {
      provider: "ollama",
      baseUrl: state.ollamaUrl.replace(/\/$/, ""),
      apiKey: "",
      model: state.model || "llama3.2",
      useDemo: false,
    };
  }
  if (state.provider === "deepseek" && state.apiKey?.trim()) {
    return {
      provider: "deepseek",
      baseUrl: state.baseUrl.replace(/\/$/, "") || "https://api.deepseek.com",
      apiKey: state.apiKey.trim(),
      model: state.model || "deepseek-chat",
      useDemo: false,
    };
  }
  if (state.provider === "openai-compat" && state.apiKey?.trim() && state.baseUrl) {
    return {
      provider: "openai-compat",
      baseUrl: state.baseUrl.replace(/\/$/, ""),
      apiKey: state.apiKey.trim(),
      model: state.model || "gpt-4o",
      useDemo: false,
    };
  }
  // Anthropic uses a different API shape; Tandem uses OpenAI-compat only. Fall through to env/demo.
  if (state.provider === "anthropic" && state.apiKey?.trim()) {
    // Future: add Anthropic-specific request path in tandem-ai. For now use env fallback or demo.
  }

  // Fallback: env vars (backward compatible)
  const envKey = import.meta.env.VITE_DEEPSEEK_KEY;
  const envModel = import.meta.env.VITE_DEEPSEEK_MODEL || "deepseek-chat";
  const envBase = import.meta.env.VITE_AI_BASE_URL || "https://api.deepseek.com";
  if (typeof envKey === "string" && envKey.trim()) {
    return {
      provider: "deepseek",
      baseUrl: (envBase as string).replace(/\/$/, ""),
      apiKey: envKey.trim(),
      model: (envModel as string) || "deepseek-chat",
      useDemo: false,
    };
  }

  return {
    provider: "demo",
    baseUrl: "",
    apiKey: "",
    model: "",
    useDemo: true,
  };
}
