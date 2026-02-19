import { useSpoonStore } from "@/stores/spoon-store";
import { useShelterStore, createDefaultPlayer } from "@/stores/shelter-store";
import { useProviderStore, type AIProvider } from "@/stores/provider-store";
import SpoonGauge from "@/components/shared/SpoonGauge";

const PLAYER_KEY = "p31_shelter_player";
const QUEST_KEY = "p31_shelter_quests";

const PROVIDER_LABELS: Record<AIProvider, string> = {
  demo: "Demo (no API)",
  ollama: "Ollama (local)",
  deepseek: "DeepSeek",
  "openai-compat": "OpenAI-compatible",
  anthropic: "Anthropic",
};

export default function SettingsView() {
  const { calibrate } = useSpoonStore();
  const { player, setPlayer } = useShelterStore();
  const {
    provider,
    ollamaUrl,
    model,
    apiKey,
    baseUrl,
    availableModels,
    connectionStatus,
    connectionError,
    setProvider,
    setOllamaUrl,
    setModel,
    setApiKey,
    setBaseUrl,
    probeOllama,
    testConnection,
  } = useProviderStore();

  const handleReset = () => {
    if (!confirm("Reset all game progress? Energy and buffer data are preserved.")) return;
    const fresh = createDefaultPlayer();
    setPlayer(fresh);
    localStorage.removeItem(PLAYER_KEY);
    localStorage.removeItem(QUEST_KEY);
  };

  return (
    <div className="px-5 py-4 max-w-[600px] mx-auto w-full space-y-6">
      <h2 className="text-[11px] font-bold tracking-[2px] text-phosphor uppercase">
        Settings
      </h2>

      {/* Energy Calibration */}
      <section className="rounded-lg border border-white/[0.06] bg-void-1 p-4 space-y-3">
        <h3 className="text-[10px] font-bold tracking-wider text-txt-dim uppercase">
          Energy Calibration
        </h3>
        <SpoonGauge interactive onCalibrate={(v) => calibrate(v)} />
      </section>

      {/* AI Provider — sovereign: Ollama = zero cloud */}
      <section className="rounded-lg border border-white/[0.06] bg-void-1 p-4 space-y-3">
        <h3 className="text-[10px] font-bold tracking-wider text-txt-dim uppercase">
          AI Provider
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            aria-label="AI provider"
            value={provider}
            onChange={(e) => {
              const p = e.target.value as AIProvider;
              setProvider(p);
              if (p === "ollama") probeOllama();
            }}
            className="bg-void-2 border border-white/10 rounded px-2 py-1.5 text-[10px] text-txt font-medium focus:outline-none focus:ring-1 focus:ring-phosphor"
          >
            {(Object.keys(PROVIDER_LABELS) as AIProvider[]).map((p) => (
              <option key={p} value={p}>
                {PROVIDER_LABELS[p]}
              </option>
            ))}
          </select>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              connectionStatus === "ok"
                ? "bg-phosphor"
                : connectionStatus === "error"
                  ? "bg-rose"
                  : connectionStatus === "testing"
                    ? "bg-amber animate-pulse"
                    : "bg-white/20"
            }`}
            title={connectionStatus === "ok" ? "Connected" : connectionStatus === "error" ? connectionError : connectionStatus === "testing" ? "Testing…" : "Idle"}
          />
          <button
            type="button"
            onClick={() => testConnection()}
            disabled={connectionStatus === "testing"}
            className="text-[9px] font-bold tracking-wider uppercase text-phosphor hover:text-phosphor/80 disabled:opacity-50"
          >
            Test connection
          </button>
        </div>
        {provider === "demo" && (
          <p className="text-[9px] text-txt-muted">
            Configure a provider above to use Tandem with a real model. Demo uses built-in replies.
          </p>
        )}
        {provider === "ollama" && (
          <div className="space-y-2">
            <label className="block text-[9px] text-txt-dim uppercase tracking-wider">Ollama URL</label>
            <input
              type="url"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              onBlur={() => probeOllama()}
              placeholder="http://localhost:11434"
              className="w-full bg-void-2 border border-white/10 rounded px-2 py-1.5 text-[10px] text-txt focus:outline-none focus:ring-1 focus:ring-phosphor"
            />
            <label className="block text-[9px] text-txt-dim uppercase tracking-wider">Model</label>
            <select
              aria-label="Ollama model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-void-2 border border-white/10 rounded px-2 py-1.5 text-[10px] text-txt focus:outline-none focus:ring-1 focus:ring-phosphor"
            >
              <option value="">Select model</option>
              {availableModels.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} — {m.sizeFormatted}
                </option>
              ))}
            </select>
          </div>
        )}
        {(provider === "deepseek" || provider === "openai-compat") && (
          <div className="space-y-2">
            <label className="block text-[9px] text-txt-dim uppercase tracking-wider">API key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-…"
              className="w-full bg-void-2 border border-white/10 rounded px-2 py-1.5 text-[10px] text-txt focus:outline-none focus:ring-1 focus:ring-phosphor"
            />
            <label className="block text-[9px] text-txt-dim uppercase tracking-wider">Base URL</label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={provider === "deepseek" ? "https://api.deepseek.com" : "https://api.openai.com"}
              className="w-full bg-void-2 border border-white/10 rounded px-2 py-1.5 text-[10px] text-txt focus:outline-none focus:ring-1 focus:ring-phosphor"
            />
            <label className="block text-[9px] text-txt-dim uppercase tracking-wider">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={provider === "deepseek" ? "deepseek-chat" : "gpt-4o"}
              className="w-full bg-void-2 border border-white/10 rounded px-2 py-1.5 text-[10px] text-txt focus:outline-none focus:ring-1 focus:ring-phosphor"
            />
          </div>
        )}
        {provider === "anthropic" && (
          <p className="text-[9px] text-txt-muted">
            Anthropic support in Tandem is planned. Use Ollama or DeepSeek for now.
          </p>
        )}
      </section>

      {/* Player Info */}
      <section className="rounded-lg border border-white/[0.06] bg-void-1 p-4 space-y-2">
        <h3 className="text-[10px] font-bold tracking-wider text-txt-dim uppercase">
          Player
        </h3>
        <div className="text-[10px] text-txt-dim space-y-1">
          <p>Title: <span className="text-violet font-bold">{player.title}</span></p>
          <p>Level: <span className="text-txt font-bold">{player.level}</span></p>
          <p>Prestige: <span className="text-amber font-bold">{player.prestige}</span></p>
          <p>Achievements: <span className="text-txt font-bold">{player.achievements.length}</span></p>
        </div>
      </section>

      {/* P31 Ecosystem */}
      <section className="rounded-lg border border-white/[0.06] bg-void-1 p-4 space-y-2">
        <h3 className="text-[10px] font-bold tracking-wider text-txt-dim uppercase">
          P31 Ecosystem
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <a href="https://p31-spectrum.pages.dev" target="_blank" rel="noopener noreferrer"
            className="block p-2 rounded border border-violet/20 bg-violet/5 text-center
              hover:bg-violet/10 transition-colors">
            <div className="text-violet text-sm">⬡</div>
            <div className="text-[8px] text-violet font-bold tracking-wider">SPECTRUM</div>
            <div className="text-[6px] text-txt-muted mt-0.5">3D · Games</div>
          </a>
          <a href="https://phosphorus31.org" target="_blank" rel="noopener noreferrer"
            className="block p-2 rounded border border-phosphor/20 bg-phosphor/5 text-center
              hover:bg-phosphor/10 transition-colors">
            <div className="text-phosphor text-sm">△</div>
            <div className="text-[8px] text-phosphor font-bold tracking-wider">LABS</div>
            <div className="text-[6px] text-txt-muted mt-0.5">phosphorus31.org</div>
          </a>
          <a href="https://phosphorus31.org/brain/" target="_blank" rel="noopener noreferrer"
            className="block p-2 rounded border border-cyan/20 bg-cyan/5 text-center
              hover:bg-cyan/10 transition-colors">
            <div className="text-cyan text-sm">🧠</div>
            <div className="text-[8px] text-cyan font-bold tracking-wider">BRAIN</div>
            <div className="text-[6px] text-txt-muted mt-0.5">Geodesic</div>
          </a>
          <a href="https://thegeodesicself.substack.com" target="_blank" rel="noopener noreferrer"
            className="block p-2 rounded border border-amber/20 bg-amber/5 text-center
              hover:bg-amber/10 transition-colors">
            <div className="text-amber text-sm">✎</div>
            <div className="text-[8px] text-amber font-bold tracking-wider">WRITING</div>
            <div className="text-[6px] text-txt-muted mt-0.5">Substack</div>
          </a>
          <a href="https://github.com/p31labs" target="_blank" rel="noopener noreferrer"
            className="block p-2 rounded border border-white/10 bg-white/[0.02] text-center
              hover:bg-white/[0.05] transition-colors">
            <div className="text-txt-dim text-sm">⌥</div>
            <div className="text-[8px] text-txt-dim font-bold tracking-wider">GITHUB</div>
            <div className="text-[6px] text-txt-muted mt-0.5">Source</div>
          </a>
          <a href="https://zenodo.org/records/18627420" target="_blank" rel="noopener noreferrer"
            className="block p-2 rounded border border-white/10 bg-white/[0.02] text-center
              hover:bg-white/[0.05] transition-colors">
            <div className="text-txt-dim text-sm">◎</div>
            <div className="text-[8px] text-txt-dim font-bold tracking-wider">ZENODO</div>
            <div className="text-[6px] text-txt-muted mt-0.5">Prior Art</div>
          </a>
        </div>
      </section>

      {/* About */}
      <section className="rounded-lg border border-white/[0.06] bg-void-1 p-4 space-y-2">
        <h3 className="text-[10px] font-bold tracking-wider text-txt-dim uppercase">
          About
        </h3>
        <p className="text-[10px] text-txt-dim leading-relaxed">
          P31 Shelter is a cognitive protection layer — it processes incoming communication,
          scores emotional voltage, and helps you respond on your terms. Built with care for
          neurodivergent minds. On-device scoring. Zero retention. The mesh holds.
        </p>
        <p className="text-[8px] text-txt-muted">
          P31 Labs · Shelter v2.0 · AGPL-3.0
        </p>
      </section>

      {/* Reset */}
      <section>
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-lg border border-rose/30 text-rose text-[10px] font-bold
            tracking-wider uppercase hover:bg-rose/10 transition-colors"
        >
          Reset Game Progress
        </button>
      </section>
    </div>
  );
}
