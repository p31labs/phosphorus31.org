import { useState, useEffect, useRef, useCallback } from "react";

const TAU = Math.PI * 2;
const MARK1 = 0.349;

function busGet(key: string): number | string | null {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function busSet(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* quota */
  }
}

function createPID(kp = 0.15, ki = 0.05, kd = 0.01) {
  let integral = 0,
    prev = 0;
  return {
    step(error: number, dt = 1) {
      integral = Math.max(-10, Math.min(10, integral + error * dt));
      const d = (error - prev) / dt;
      prev = error;
      return kp * error + ki * integral + kd * d;
    },
    reset() {
      integral = 0;
      prev = 0;
    },
  };
}

const CHIMES = [261.63, 329.63, 392.0, 523.25];

function playChime(
  freq: number,
  ctx: AudioContext | null,
  gain: number
) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain * 0.08, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1.2);
}

export default function QuantumClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const pidRef = useRef(createPID());
  const audioRef = useRef<AudioContext | null>(null);
  const stateRef = useRef({
    frame: 0,
    entropy: 0.08,
    harmony: MARK1,
    spoons: 12,
    coherenceTime: 100,
    pidOut: 0,
    lastChimeMinute: -1,
    strobePhase: 0,
    breathPhase: 0,
  });

  const [time, setTime] = useState(new Date());
  const [entropy, setEntropy] = useState(0.08);
  const [harmony, setHarmony] = useState(MARK1);
  const [spoons, setSpoons] = useState(12);
  const [coherence, setCoherence] = useState(100);
  const [mode, setMode] = useState<"green" | "yellow" | "red" | "critical">("green");
  const [showInfo, setShowInfo] = useState(false);

  const initAudio = useCallback(() => {
    if (!audioRef.current && typeof AudioContext !== "undefined") {
      audioRef.current = new AudioContext();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    function animate() {
      const r = canvas.getBoundingClientRect();
      const W = r.width,
        H = r.height;
      const cx = W / 2,
        cy = H / 2;
      const R = Math.min(W, H) * 0.38;
      const st = stateRef.current;
      const now = new Date();

      ctx.clearRect(0, 0, W, H);
      st.frame++;
      st.breathPhase += TAU / 360;
      st.strobePhase += 0.012;

      const busSpoons = busGet("p31:spoons");
      const busVoltage = busGet("p31:voltage");
      if (busSpoons !== null && typeof busSpoons === "number") st.spoons = busSpoons;
      if (busVoltage !== null && typeof busVoltage === "number")
        st.entropy = Math.max(0.02, busVoltage / 10);

      const err = MARK1 - st.harmony;
      st.pidOut = pidRef.current.step(err);
      st.harmony = Math.max(0, Math.min(1, st.harmony + st.pidOut * 0.008));
      st.entropy = Math.max(0, st.entropy - 0.0003 - Math.abs(st.pidOut) * 0.001);
      if (st.entropy < 0.15 && st.spoons < 12)
        st.spoons = Math.min(12, st.spoons + 0.002);
      if (st.entropy > 0.4) st.spoons = Math.max(0, st.spoons - 0.003 * st.entropy);
      st.coherenceTime =
        st.entropy > 0.5
          ? Math.max(0, st.coherenceTime - 0.3)
          : st.entropy > 0.25
            ? Math.max(20, st.coherenceTime - 0.08)
            : Math.min(100, st.coherenceTime + 0.04);

      const currentMode: "green" | "yellow" | "red" | "critical" =
        st.entropy > 0.6 ? "critical" : st.entropy > 0.4 ? "red" : st.entropy > 0.2 ? "yellow" : "green";

      const hrs = now.getHours() % 12;
      const mins = now.getMinutes();
      const secs = now.getSeconds();
      const ms = now.getMilliseconds();
      const secAngle = ((secs + ms / 1000) / 60) * TAU - TAU / 4;
      const minAngle = ((mins + secs / 60) / 60) * TAU - TAU / 4;
      const hrAngle = ((hrs + mins / 60) / 12) * TAU - TAU / 4;

      const jitter = () => (Math.random() - 0.5) * st.entropy * 4;

      if (mins === 0 && secs === 0 && st.lastChimeMinute !== hrs) {
        st.lastChimeMinute = hrs;
        const chimeIdx = hrs % 4;
        playChime(CHIMES[chimeIdx], audioRef.current, 1 - st.entropy);
      }

      const modeColors: Record<string, string> = {
        green: "57, 255, 20",
        yellow: "255, 184, 0",
        red: "244, 63, 94",
        critical: "244, 63, 94",
      };
      const mc = modeColors[currentMode];
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.8);
      bgGrad.addColorStop(0, `rgba(${mc}, ${0.04 + st.harmony * 0.06})`);
      bgGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const breathScale = 1 + Math.sin(st.breathPhase) * 0.015;
      const cageR = R * 1.08 * breathScale;
      ctx.beginPath();
      ctx.arc(cx, cy, cageR, 0, TAU);
      ctx.strokeStyle = `rgba(0, 212, 255, ${0.12 + st.harmony * 0.15})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.font = "7px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < 9; i++) {
        const a = (TAU / 9) * i + st.frame * 0.0008;
        const px = cx + Math.cos(a) * cageR;
        const py = cy + Math.sin(a) * cageR;
        ctx.fillStyle = `rgba(0, 212, 255, ${0.15 + Math.sin(a * 3 + st.frame * 0.02) * 0.1})`;
        ctx.fillText("Ca", px, py);
      }

      for (let i = 0; i < 12; i++) {
        const a = (TAU / 12) * i - TAU / 4;
        const markerR = R * 0.92;
        const mx = cx + Math.cos(a) * markerR + jitter() * 0.3;
        const my = cy + Math.sin(a) * markerR + jitter() * 0.3;
        const isHour = i === hrs % 12;
        const dotR = isHour ? 4 : 2;
        const alpha = isHour ? 0.9 : 0.25;
        if (isHour) {
          const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 10);
          glow.addColorStop(0, `rgba(${mc}, 0.3)`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(mx, my, 10, 0, TAU);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(mx, my, dotR, 0, TAU);
        ctx.fillStyle = `rgba(${mc}, ${alpha})`;
        ctx.fill();
        const numR = R * 0.78;
        const nx = cx + Math.cos(a) * numR;
        const ny = cy + Math.sin(a) * numR;
        ctx.font = isHour ? "bold 11px monospace" : "9px monospace";
        ctx.fillStyle = `rgba(255, 255, 255, ${isHour ? 0.7 : 0.15})`;
        ctx.fillText(i === 0 ? "12" : String(i), nx + jitter() * 0.2, ny + jitter() * 0.2);
      }

      for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) continue;
        const a = (TAU / 60) * i - TAU / 4;
        const tickOuter = R * 0.92;
        const tickInner = R * 0.88;
        const ox = cx + Math.cos(a) * tickOuter;
        const oy = cy + Math.sin(a) * tickOuter;
        const ix = cx + Math.cos(a) * tickInner;
        const iy = cy + Math.sin(a) * tickInner;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ix, iy);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      const nucleiR = R * 0.45;
      for (let i = 0; i < 6; i++) {
        const a = (TAU / 6) * i - TAU / 4;
        const spinPhase = st.frame * 0.03 + i * (TAU / 6);
        const coherent = st.entropy < 0.35;
        const nx = cx + Math.cos(a) * nucleiR + (coherent ? 0 : jitter());
        const ny = cy + Math.sin(a) * nucleiR + (coherent ? 0 : jitter());
        const nColor = coherent
          ? `rgba(57, 255, 20, ${0.4 + Math.sin(spinPhase) * 0.2})`
          : `rgba(255, 184, 0, ${0.3 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, TAU);
        ctx.fillStyle = nColor;
        ctx.fill();
        const svLen = 10 + (coherent ? 4 : Math.random() * 8);
        const svAngle = coherent ? spinPhase : spinPhase + (Math.random() - 0.5) * st.entropy * 3;
        const sx = nx + Math.cos(svAngle) * svLen;
        const sy = ny + Math.sin(svAngle) * svLen;
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = nColor;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (i < 3 && coherent) {
          const pa = (TAU / 6) * (i + 3) - TAU / 4;
          const px = cx + Math.cos(pa) * nucleiR;
          const py = cy + Math.sin(pa) * nucleiR;
          ctx.beginPath();
          ctx.setLineDash([2, 4]);
          ctx.moveTo(nx, ny);
          ctx.lineTo(px, py);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 + Math.sin(st.frame * 0.02 + i) * 0.08})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.font = "6px monospace";
        ctx.fillStyle = `rgba(255, 255, 255, ${coherent ? 0.3 : 0.15})`;
        ctx.fillText(`³¹P${i}`, nx, ny - 9);
      }

      const hrLen = R * 0.42;
      const hrX = cx + Math.cos(hrAngle) * hrLen + jitter() * 0.5;
      const hrY = cy + Math.sin(hrAngle) * hrLen + jitter() * 0.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(hrX, hrY);
      ctx.strokeStyle = `rgba(${mc}, 0.7)`;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();

      const minLen = R * 0.62;
      const minX = cx + Math.cos(minAngle) * minLen + jitter() * 0.3;
      const minY = cy + Math.sin(minAngle) * minLen + jitter() * 0.3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(minX, minY);
      ctx.strokeStyle = `rgba(${mc}, 0.5)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const secLen = R * 0.78;
      const secJX = jitter() * 1.5;
      const secJY = jitter() * 1.5;
      const secX = cx + Math.cos(secAngle) * secLen + secJX;
      const secY = cy + Math.sin(secAngle) * secLen + secJY;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(secX, secY);
      ctx.strokeStyle = `rgba(${mc}, 0.35)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      const tailLen = R * 0.12;
      const tailX = cx - Math.cos(secAngle) * tailLen;
      const tailY = cy - Math.sin(secAngle) * tailLen;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = `rgba(${mc}, 0.2)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, TAU);
      ctx.fillStyle = `rgba(${mc}, 0.8)`;
      ctx.fill();

      const hR = 14 + Math.sin(st.breathPhase * 2) * 2;
      const hGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hR);
      hGrad.addColorStop(0, `rgba(${mc}, 0.15)`);
      hGrad.addColorStop(1, "transparent");
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, hR, 0, TAU);
      ctx.fill();

      if (st.entropy > 0.1) {
        const count = Math.floor(st.entropy * 25);
        for (let i = 0; i < count; i++) {
          const pa = Math.random() * TAU;
          const pr = R * 0.3 + Math.random() * R * 0.65;
          const px = cx + Math.cos(pa + st.frame * 0.005) * pr;
          const py = cy + Math.sin(pa + st.frame * 0.005) * pr;
          ctx.beginPath();
          ctx.arc(px, py, 0.8, 0, TAU);
          ctx.fillStyle = `rgba(244, 63, 94, ${st.entropy * 0.2 * Math.random()})`;
          ctx.fill();
        }
      }

      const strobeVal = Math.sin(st.strobePhase);
      const strobeLabel = strobeVal > 0 ? "VASE" : "FACE";
      const strobeColor = strobeVal > 0 ? "0, 212, 255" : "139, 92, 246";
      ctx.font = "7px monospace";
      ctx.fillStyle = `rgba(${strobeColor}, 0.25)`;
      ctx.fillText(strobeLabel, cx, cy + R * 1.2 + 4);

      if (st.frame % 8 === 0) {
        setTime(now);
        setEntropy(st.entropy);
        setHarmony(st.harmony);
        setSpoons(st.spoons);
        setCoherence(st.coherenceTime);
        setMode(currentMode);
        busSet("p31:harmony", Math.round(st.harmony * 1000) / 1000);
        busSet("p31:heartbeat", Date.now());
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const modeColor =
    mode === "green" ? "#39FF14" : mode === "yellow" ? "#FFB800" : "#F43F5E";
  const harmonyColor =
    harmony > 0.3 && harmony < 0.4 ? "#39FF14" : harmony < 0.2 ? "#F43F5E" : "#FFB800";
  const spoonFrac = spoons / 12;
  const pad = (n: number) => String(n).padStart(2, "0");
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <div
      onClick={initAudio}
      style={{
        background: "#050508",
        color: "#e0e0e8",
        fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(57,255,20,0.02) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div style={{ textAlign: "center", marginBottom: 8, zIndex: 1 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 5,
            color: modeColor,
            fontWeight: 700,
            textShadow: `0 0 15px ${modeColor}33`,
          }}
        >
          QUANTUM CLOCK
        </div>
        <div style={{ fontSize: 7, color: "#444458", letterSpacing: 2, marginTop: 2 }}>
          Ca₉(PO₄)₆ — COHERENCE TIMEPIECE
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: 380, aspectRatio: "1", zIndex: 1 }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `1px solid ${modeColor}15`,
            boxShadow: `0 0 40px ${modeColor}08, inset 0 0 60px rgba(0,0,0,0.5)`,
          }}
        />
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 4,
          color: modeColor,
          marginTop: 10,
          zIndex: 1,
          textShadow: `0 0 20px ${modeColor}44`,
          opacity: 0.8,
        }}
      >
        {timeStr}
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 10,
          zIndex: 1,
          fontSize: 8,
          letterSpacing: 1.5,
          color: "#555568",
        }}
      >
        <span>
          H <span style={{ color: harmonyColor }}>{harmony.toFixed(3)}</span>
        </span>
        <span>
          S{" "}
          <span
            style={{
              color:
                spoonFrac > 0.5 ? "#39FF14" : spoonFrac > 0.25 ? "#FFB800" : "#F43F5E",
            }}
          >
            {Math.round(spoons)}/12
          </span>
        </span>
        <span style={{ color: modeColor }}>τ {Math.round(coherence)}ms</span>
        <span>
          Σ{" "}
          <span
            style={{
              color:
                entropy < 0.2 ? "#39FF14" : entropy < 0.4 ? "#FFB800" : "#F43F5E",
            }}
          >
            {(entropy * 100).toFixed(0)}%
          </span>
        </span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowInfo(!showInfo);
        }}
        style={{
          marginTop: 10,
          background: "none",
          border: `1px solid ${modeColor}22`,
          color: "#555568",
          fontSize: 8,
          fontFamily: "inherit",
          letterSpacing: 2,
          padding: "4px 12px",
          borderRadius: 4,
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        {showInfo ? "CLOSE" : "HOW TO READ"}
      </button>
      {showInfo && (
        <div
          style={{
            maxWidth: 380,
            marginTop: 8,
            background: "rgba(15,15,20,0.92)",
            border: "1px solid rgba(57,255,20,0.08)",
            borderRadius: 8,
            padding: "12px 16px",
            zIndex: 1,
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              fontSize: 8,
              color: "#888",
              lineHeight: 1.8,
              letterSpacing: 0.5,
            }}
          >
            <p style={{ margin: "0 0 6px", color: "#39FF14" }}>
              THE CALCIUM CAGE IS THE CLOCK FACE.
            </p>
            <p style={{ margin: "0 0 4px" }}>
              9 Ca²⁺ ions orbit the rim — the Posner molecule's protective shell.
            </p>
            <p style={{ margin: "0 0 4px" }}>
              6 ³¹P nuclei form the inner ring — the biological qubits. Their spin
              vectors precess steadily when coherent. When entropy rises, they jitter
              and desync.
            </p>
            <p style={{ margin: "0 0 4px" }}>
              The clock hands jitter with entropy. Low entropy = smooth motion. High
              entropy = the hands shake. The PID (Samson) constantly fights to restore
              order.
            </p>
            <p style={{ margin: "0 0 4px" }}>
              Dashed violet lines between nuclei = singlet entanglement (pairs 0↔3,
              1↔4, 2↔5). They vanish when coherence breaks.
            </p>
            <p style={{ margin: "0 0 4px" }}>
              Red particles = environmental noise penetrating the cage.
            </p>
            <p style={{ margin: "0 0 4px" }}>
              <span style={{ color: "#39FF14" }}>H</span>=harmony (target 0.349) —
              <span style={{ color: "#39FF14" }}>S</span>=spoons —{" "}
              <span style={{ color: "#39FF14" }}>τ</span>=coherence time —{" "}
              <span style={{ color: "#39FF14" }}>Σ</span>=entropy
            </p>
            <p style={{ margin: "4px 0 0", color: "#06B6D4" }}>
              Reads spoons and voltage from the bus. Open Shelter in another tab to
              see real data flow.
            </p>
          </div>
        </div>
      )}
      <div
        style={{
          marginTop: 10,
          fontSize: 7,
          color: "#222230",
          letterSpacing: 2,
          zIndex: 1,
        }}
      >
        P31 LABS — THE CAGE PROTECTS THE SPIN
      </div>
    </div>
  );
}
