import { useQuantumBrain } from "@/hooks/useQuantumBrain";
import { useShelterStore } from "@/stores/shelter-store";
import { coherenceColor, phaseLabel } from "@/lib/quantum-brain";

const SIGNAL_LABELS: Record<string, string> = {
  streakHealth: "Streaks",
  energyLevel: "Energy",
  scoringMomentum: "Scoring",
  questEngagement: "Quests",
  loveFlow: "L.O.V.E.",
};

const SIGNAL_ICONS: Record<string, string> = {
  streakHealth: "🔥",
  energyLevel: "⚡",
  scoringMomentum: "📊",
  questEngagement: "📋",
  loveFlow: "💜",
};

function PosnerMolecule({ coherence, phase }: { coherence: number; phase: string }) {
  const color = coherenceColor(coherence);
  const glow = coherence * 20;
  const pulseSpeed = phase === "flow" ? 3 : phase === "settling" ? 5 : phase === "listening" ? 8 : 12;

  // 9 calcium positions (outer ring) + 6 phosphorus positions (inner)
  const calciumPositions = Array.from({ length: 9 }, (_, i) => {
    const angle = (i / 9) * Math.PI * 2;
    const r = 70;
    return { x: 100 + Math.cos(angle) * r, y: 100 + Math.sin(angle) * r };
  });

  const phosphorusPositions = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const r = 38;
    return { x: 100 + Math.cos(angle) * r, y: 100 + Math.sin(angle) * r };
  });

  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      {/* Background glow */}
      <defs>
        <radialGradient id="brainGlow">
          <stop offset="0%" stopColor={color} stopOpacity={coherence * 0.15} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation={glow / 4} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="100" cy="100" r="95" fill="url(#brainGlow)" />

      {/* Entanglement filaments (calcium → phosphorus connections) */}
      {calciumPositions.map((ca, i) => {
        const p = phosphorusPositions[i % 6];
        return (
          <line
            key={`ent-${i}`}
            x1={ca.x} y1={ca.y} x2={p.x} y2={p.y}
            stroke={color} strokeWidth="0.5"
            opacity={coherence * 0.3}
          />
        );
      })}

      {/* Inter-phosphorus bonds */}
      {phosphorusPositions.map((p1, i) => {
        const p2 = phosphorusPositions[(i + 1) % 6];
        return (
          <line
            key={`bond-${i}`}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={color} strokeWidth="1"
            opacity={coherence * 0.5}
          />
        );
      })}

      {/* Calcium atoms (outer ring) */}
      {calciumPositions.map((pos, i) => (
        <circle
          key={`ca-${i}`}
          cx={pos.x} cy={pos.y} r={3 + coherence * 2}
          fill={color} opacity={0.3 + coherence * 0.4}
        />
      ))}

      {/* Phosphorus atoms (inner ring) */}
      {phosphorusPositions.map((pos, i) => (
        <circle
          key={`p-${i}`}
          cx={pos.x} cy={pos.y} r={4 + coherence * 2}
          fill="#06B6D4" opacity={0.4 + coherence * 0.4}
          filter="url(#glow)"
        />
      ))}

      {/* Central P-31 atom */}
      <circle
        cx="100" cy="100" r={8 + coherence * 6}
        fill={color} opacity={0.6 + coherence * 0.3}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values={`${0.4 + coherence * 0.2};${0.7 + coherence * 0.3};${0.4 + coherence * 0.2}`}
          dur={`${pulseSpeed}s`}
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="100" cy="100" r={4} fill="#fff" opacity="0.8" />

      {/* Coherence ring */}
      <circle
        cx="100" cy="100" r="90"
        fill="none" stroke={color} strokeWidth="1"
        opacity={coherence * 0.2}
        strokeDasharray={`${coherence * 565} ${(1 - coherence) * 565}`}
      />
    </svg>
  );
}

export default function BrainView() {
  const brain = useQuantumBrain();
  const { player } = useShelterStore();
  const color = coherenceColor(brain.coherence);

  return (
    <div className="px-5 py-4 max-w-[600px] mx-auto w-full space-y-6">
      {/* Molecule visualization */}
      <div className="flex flex-col items-center gap-3">
        <PosnerMolecule coherence={brain.coherence} phase={brain.phase} />
        <div className="text-center">
          <div className="text-[10px] tracking-[3px] text-txt-muted uppercase">Quantum Brain</div>
          <div className="text-2xl font-bold font-mono mt-1" style={{ color }}>
            {(brain.coherence * 100).toFixed(0)}%
          </div>
          <div className="text-xs font-bold mt-0.5" style={{ color }}>
            {phaseLabel(brain.phase)}
          </div>
        </div>
      </div>

      {/* Coherence bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[9px]">
          <span className="text-txt-muted uppercase tracking-wider">Coherence</span>
          <span className="font-mono font-bold" style={{ color }}>
            Q = {brain.coherence.toFixed(3)}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${brain.coherence * 100}%`, background: color }}
          />
        </div>
        <div className="flex justify-between text-[8px] text-txt-muted">
          <span>Drift</span>
          <span className="text-phosphor">Home (H ≈ 0.35)</span>
          <span>Flow</span>
        </div>
      </div>

      {/* Five signals */}
      <section>
        <h2 className="text-[11px] font-bold tracking-[2px] text-phosphor uppercase mb-3">
          Signal Decomposition
        </h2>
        <div className="space-y-2">
          {(Object.entries(brain.signals) as [string, number][]).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-base w-6 text-center">{SIGNAL_ICONS[key]}</span>
              <span className="text-[10px] text-txt-dim w-16 uppercase tracking-wider">
                {SIGNAL_LABELS[key]}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${value * 100}%`,
                    background: value > 0.6 ? "#39FF14" : value > 0.3 ? "#06B6D4" : "#F59E0B",
                  }}
                />
              </div>
              <span className="text-[9px] font-mono text-txt-dim w-8 text-right">
                {(value * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Stability metrics */}
      <section className="rounded-lg border border-white/[0.06] bg-void-1 p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-txt-dim uppercase tracking-wider">Stability</span>
          <span className="text-xs font-mono font-bold" style={{ color }}>
            {(brain.stability * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-txt-dim uppercase tracking-wider">Drift from Home</span>
          <span className="text-xs font-mono text-txt-dim">
            Δ = {brain.drift.toFixed(3)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-txt-dim uppercase tracking-wider">Phase</span>
          <span className="text-xs font-bold" style={{ color }}>
            {phaseLabel(brain.phase)}
          </span>
        </div>
      </section>

      {/* Posner molecule formula */}
      <div className="text-center text-[8px] text-white/[0.08] tracking-wider mt-4">
        Ca₉(PO₄)₆ · POSNER MOLECULE · ³¹P NUCLEAR SPIN = QUBIT
      </div>
    </div>
  );
}
