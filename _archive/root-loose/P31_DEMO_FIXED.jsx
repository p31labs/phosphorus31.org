import React, { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// P31 LABS — UNIFIED PLATFORM + GEMINI AI
// Merging: High-Fidelity Brand Identity + Interactive Prototype + LLM
// ═══════════════════════════════════════════════════════════════

// --- BRAND TOKENS (Aligned with 02_BRAND_VOICE.md) ---
const C = {
  bg: "#050510", // Deep Void (matches brand guide)
  bgSafe: "#000000",
  surface: "rgba(18, 18, 26, 0.7)",
  surfaceBorder: "rgba(255, 255, 255, 0.08)",
  
  glowGreen: "#2ecc71", // Phosphorus Green (exact brand color)
  glowGreenBright: "#4fffaa", // Bright variant for glows
  glowBlue: "#60a5fa", // Calcium Blue
  calcium: "#ff9f43", // Calcium Warm
  calciumAmber: "#ffc078",
  lovePurple: "#e879f9", // LOVE economy color
  
  red: "#ef4444",
  text: "#e8e8f0", // Matches brand guide
  textDim: "#9ca3af",
  muted: "#6b7280",
};

// --- GEMINI API INTEGRATION (Environment Variable Pattern) ---
// Use Vite: import.meta.env.VITE_GEMINI_API_KEY
// Use CRA: process.env.REACT_APP_GEMINI_API_KEY
const getApiKey = () => {
  if (typeof import !== 'undefined' && import.meta?.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env?.REACT_APP_GEMINI_API_KEY) {
    return process.env.REACT_APP_GEMINI_API_KEY;
  }
  return ""; // Fallback for demo mode
};

async function callGemini(prompt, systemPrompt = "You are P31-OS, an assistive technology AI.") {
  const apiKey = getApiKey();
  if (!apiKey) {
    // Demo mode: return mock response
    console.warn("Gemini API key not set. Using demo mode.");
    return { voltage: 7, status: "HIGH VOLTAGE", triggers: ["URGENCY", "COERCION"], reason: "Demo mode: Message contains urgency and coercion patterns.", responses: null };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { responseMimeType: "application/json" }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return fallback response instead of null
    return { 
      voltage: 5, 
      status: "CAUTION", 
      triggers: ["NETWORK_ERROR"], 
      reason: "Unable to analyze message. Please check your connection or API key.",
      responses: null 
    };
  }
}

// --- FONTS (System Fonts - Delta Compliant) ---
// NO EXTERNAL DEPENDENCIES - Uses system fonts only
const FONTS_CSS = `
  body { 
    margin: 0; 
    background: ${C.bg}; 
    color: ${C.text}; 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    overflow-x: hidden; 
  }
  h1, h2, h3 { 
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 400; 
  }
  .mono { 
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace; 
  }
  
  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0a0a0f; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${C.glowGreen}; }

  /* UTILS */
  .glass {
    background: rgba(10, 10, 15, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  .glass-hover:hover {
    background: rgba(46, 204, 113, 0.03);
    border-color: rgba(46, 204, 113, 0.15);
  }
  .loading-pulse {
    animation: pulse 1.5s infinite ease-in-out;
  }
  @keyframes pulse {
    0% { opacity: 0.4; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .loading-pulse { animation: none; opacity: 1; }
    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

// --- ICONS ---
const Icon = {
  Atom: () => <span>⚛</span>,
  Node: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>,
  Buffer: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Scope: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 9l-5 5-4-4-6 6"/></svg>,
  Brain: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Sprout: () => <span style={{ fontSize: 18 }}>🌱</span>,
};

// ═══════════════════════════════════════════════════════════════
// BACKGROUND: QUANTUM FIELD
// ═══════════════════════════════════════════════════════════════
const QuantumField = ({ isSafeMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isSafeMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Config
    let width, height;
    const particles = [];
    const particleCount = Math.min(80, window.innerWidth / 15);
    
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Particle Class
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 1.5 + 0.5;
        this.isPhosphor = Math.random() > 0.8;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.isPhosphor ? C.glowGreen : "rgba(255,255,255,0.3)";
        ctx.fill();
      }
    }

    // Init
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    // Loop
    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw Connections
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        p.draw();
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
             ctx.moveTo(p.x, p.y);
             ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.strokeStyle = `rgba(46, 204, 113, 0.05)`;
      ctx.stroke();
      
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [isSafeMode]);

  if (isSafeMode) return <div style={{position:"fixed", top:0, left:0, width:"100%", height:"100%", background:"#000", zIndex:-1}} />;

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1,
        background: `radial-gradient(circle at 50% 50%, #0a0a15 0%, #000 100%)`
      }} />
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }} />
      <div style={{ // Grain Overlay
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`
      }} />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════
const P31Badge = () => (
  <svg width="40" height="48" viewBox="0 0 200 240" style={{flexShrink:0}}>
    <rect x="10" y="10" width="180" height="220" rx="4" fill="rgba(46, 204, 113, 0.05)" stroke={C.glowGreen} strokeWidth="8" />
    <text x="35" y="55" fontFamily="monospace" fontSize="24" fill={C.glowGreen}>15</text>
    <text x="100" y="150" fontFamily="serif" fontSize="110" fill={C.glowGreen} textAnchor="middle">P</text>
    <text x="100" y="210" fontFamily="monospace" fontSize="20" fill={C.glowGreen} textAnchor="middle" opacity="0.6">30.97</text>
  </svg>
);

const Card = ({ children, glow, className = "", style = {} }) => (
  <div className={`glass glass-hover ${className}`} style={{
    borderRadius: 12, padding: 24, marginBottom: 20,
    boxShadow: glow ? `0 0 30px ${glow}1a` : "none",
    border: glow ? `1px solid ${glow}44` : undefined,
    transition: "all 0.3s ease",
    ...style
  }}>
    {children}
  </div>
);

const Button = ({ children, onClick, color = C.glowGreen, variant = "solid", disabled, style = {} }) => {
  const base = {
    padding: "12px 20px", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 13, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase",
    transition: "all 0.2s", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "monospace", border: "none", opacity: disabled ? 0.5 : 1,
    ...style
  };
  const variants = {
    solid: { background: color, color: "#000", boxShadow: `0 0 15px ${color}44` },
    outline: { background: "transparent", border: `1px solid ${color}66`, color: color },
    ghost: { background: "transparent", color: C.textDim }
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

// ═══════════════════════════════════════════════════════════════
// FEATURE: NODE ONE
// ═══════════════════════════════════════════════════════════════
const NodeOneDemo = ({ isSafeMode }) => {
  const [active, setActive] = useState(null);
  const [msgLog, setMsgLog] = useState([]);

  const haptics = [
    { id: "ground", label: "Grounding", pat: "▃▃▃▃▃▃" },
    { id: "pulse", label: "Heartbeat", pat: "█ █ █" },
  ];

  const trigger = (h) => {
    setActive(h.id);
    setTimeout(() => setActive(null), 300);
  };

  const send = (txt) => setMsgLog(p => [{t: txt, time: new Date().toLocaleTimeString()}, ...p].slice(0,2));

  return (
    <div style={{animation: "fadeIn 0.5s"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20}}>
        <div>
          <h2 style={{fontSize:32, margin:0, color:C.text}}>Node One</h2>
          <div className="mono" style={{color:C.glowGreen, fontSize:12, letterSpacing:2}}>HARDWARE · ESP32-S3 · DELTA TOPOLOGY</div>
        </div>
        {!isSafeMode && <div className="mono" style={{fontSize:10, color:C.textDim}}>MESH ONLINE • 3 NODES</div>}
      </div>

      <div style={{display:"grid", gridTemplateColumns: isSafeMode ? "1fr" : "1fr 1fr", gap:20}}>
        {/* HAPTICS */}
        <Card glow={active ? C.glowGreen : null}>
          <div className="mono" style={{fontSize:10, color:C.textDim, marginBottom:16}}>DRV2605L HAPTIC DRIVER</div>
          <div style={{display:"grid", gap:10}}>
            {haptics.map(h => (
              <div key={h.id} onClick={() => trigger(h)}
                style={{
                  padding: 16, border: `1px solid ${active===h.id ? C.glowGreen : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 6, cursor: "pointer", background: active===h.id ? "rgba(46, 204, 113, 0.1)" : "transparent",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                <span style={{fontWeight:600}}>{h.label}</span>
                <span className="mono" style={{fontSize:10, opacity:0.5}}>{h.pat}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* MESH COMMS */}
        {!isSafeMode && (
          <Card style={{borderColor: C.red+"44"}}>
            <div className="mono" style={{fontSize:10, color:C.red, marginBottom:16}}>EMERGENCY MESH (LORA) · WHALE CHANNEL</div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16}}>
              <Button variant="outline" color={C.red} onClick={() => send("MELTDOWN")}>🚨 Meltdown</Button>
              <Button variant="outline" color={C.calcium} onClick={() => send("NONVERBAL")}>🤐 Nonverbal</Button>
            </div>
            {msgLog.map((m, i) => (
              <div key={i} className="mono" style={{fontSize:10, color:C.textDim, borderLeft:`2px solid ${C.glowGreen}`, paddingLeft:8, marginTop:4}}>
                [{m.time}] TX: {m.t}
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// FEATURE: THE BUFFER (Gemini Enhanced)
// ═══════════════════════════════════════════════════════════════
const BufferDemo = () => {
  const [txt, setTxt] = useState("You need to respond IMMEDIATELY or there will be consequences. Everyone knows you're avoiding this.");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [responseOptions, setResponseOptions] = useState(null);

  // Gemini System Prompt
  const BUFFER_SYS = `
    You are 'The Buffer', an assistive AI for neurodivergent users. 
    Task 1: Analyze message voltage (0-10) based on urgency, coercion, and emotional manipulation. 
    Task 2: Identify triggers (false urgency, shame, threats).
    Task 3: If asked, draft 3 "Low Voltage" responses (Gray Rock, Firm Boundary, Defer).
    Output JSON: { "voltage": number, "status": "SAFE"|"CAUTION"|"HIGH VOLTAGE", "triggers": [string], "reason": string, "responses": [{ "label": string, "text": string }] }
  `;

  const analyze = async () => {
    setLoading(true);
    setAnalysis(null);
    setResponseOptions(null);
    const res = await callGemini(`Analyze this message: "${txt}"`, BUFFER_SYS);
    if (res) {
      setAnalysis(res);
      setResponseOptions(res.responses);
    }
    setLoading(false);
  };

  const draftResponses = async () => {
    setLoading(true);
    const res = await callGemini(`Generate 3 safe, low-voltage responses to: "${txt}". Use Gray Rock method and firm boundaries.`, BUFFER_SYS);
    if (res && res.responses) setResponseOptions(res.responses);
    setLoading(false);
  };

  return (
    <div style={{animation: "fadeIn 0.5s"}}>
      <h2 style={{fontSize:32, margin:"0 0 20px 0"}}>The Buffer</h2>
      <Card>
        <div style={{display:"flex", gap:20, flexWrap:"wrap"}}>
          <div style={{flex:2, minWidth:200}}>
            <div className="mono" style={{fontSize:10, color:C.textDim, marginBottom:8}}>INCOMING MESSAGE · VOLTAGE ASSESSMENT</div>
            <textarea value={txt} onChange={e=>setTxt(e.target.value)}
              style={{
                width:"100%", height:120, background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.1)",
                color:C.text, padding:12, borderRadius:6, fontFamily:"sans-serif", resize:"none", marginBottom:12
              }}
            />
            <div style={{display:"flex", gap:10}}>
              <Button onClick={analyze} disabled={loading} color={C.glowGreen} variant="outline">
                {loading ? "Scanning..." : "Analyze Voltage ✨"}
              </Button>
              {analysis && analysis.voltage > 5 && (
                <Button onClick={draftResponses} disabled={loading} color={C.calcium} variant="outline">
                  Draft Safe Response ✨
                </Button>
              )}
            </div>
          </div>
          
          <div style={{flex:1, textAlign:"center", display:"flex", flexDirection:"column", justifyContent:"center"}}>
            {loading ? (
              <div className="loading-pulse mono" style={{color:C.glowGreen}}>SCANNING PATTERNS...</div>
            ) : analysis ? (
              <>
                <div className="mono" style={{fontSize:10, color:C.textDim}}>VOLTAGE</div>
                <div style={{fontFamily:"serif", fontSize:64, lineHeight:1, color: analysis.voltage>5 ? C.red : C.glowGreen}}>
                  {analysis.voltage}
                </div>
                <div className="mono" style={{fontSize:10, color: analysis.voltage>5 ? C.red : C.glowGreen, marginTop:4}}>
                  {analysis.status}
                </div>
                <div style={{marginTop:12, fontSize:11, color:C.textDim, textAlign:"left"}}>
                  {analysis.triggers && analysis.triggers.map(t => (
                    <span key={t} style={{display:"inline-block", background:"rgba(255,255,255,0.1)", padding:"2px 6px", borderRadius:4, margin:"2px"}}>{t}</span>
                  ))}
                  <p style={{marginTop:8, lineHeight:1.4}}>{analysis.reason}</p>
                </div>
              </>
            ) : (
              <div className="mono" style={{fontSize:10, color:C.textDim, opacity:0.5}}>WAITING FOR INPUT</div>
            )}
          </div>
        </div>
      </Card>

      {responseOptions && responseOptions.length > 0 && (
        <Card glow={C.calcium}>
          <div className="mono" style={{fontSize:10, color:C.calcium, marginBottom:16}}>SUGGESTED RESPONSES (LOW VOLTAGE)</div>
          <div style={{display:"grid", gap:12}}>
            {responseOptions.map((r, i) => (
              <div key={i} style={{background:"rgba(0,0,0,0.3)", padding:16, borderRadius:8, border:`1px solid ${C.calcium}44`}}>
                <div className="mono" style={{fontSize:10, color:C.calcium, marginBottom:4}}>{r.label}</div>
                <div style={{fontSize:14, color:C.text}}>{r.text}</div>
                <button 
                  onClick={() => navigator.clipboard.writeText(r.text)}
                  className="mono" 
                  style={{marginTop:8, background:"none", border:"none", color:C.textDim, cursor:"pointer", fontSize:10, padding:0}}
                >
                  [COPY TEXT]
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// FEATURE: THE SCOPE (Gemini Enhanced)
// ═══════════════════════════════════════════════════════════════
const ScopeDemo = ({ spoons, setSpoons, isSafeMode }) => {
  const [meds, setMeds] = useState({ ca: 0, stim: 0, locked: false });
  const [taskInput, setTaskInput] = useState("");
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gemini System Prompt
  const SCOPE_SYS = `
    You are 'The Scope', an executive function assistant.
    User will provide a task. Break it down into 3-6 very small, actionable micro-steps.
    Estimate "spoon" cost (1-5) for each step.
    Output JSON: { "task": string, "steps": [{ "step": string, "spoons": number }] }
  `;

  const decomposeTask = async () => {
    if (!taskInput.trim()) return;
    setLoading(true);
    const res = await callGemini(`Break down this task: "${taskInput}"`, SCOPE_SYS);
    if (res && res.steps) setBreakdown(res);
    setLoading(false);
  };

  // Timer logic for 4h gap
  useEffect(() => {
    const i = setInterval(() => {
      if (meds.locked && Date.now() > meds.unlockTime) setMeds(m => ({...m, locked:false}));
    }, 1000);
    return () => clearInterval(i);
  }, [meds.locked]);

  const takeCa = () => setMeds({ ...meds, ca: Date.now(), locked: true, unlockTime: Date.now() + 5000 }); // Demo: 5s instead of 4h

  return (
    <div style={{animation: "fadeIn 0.5s"}}>
      <h2 style={{fontSize:32, margin:"0 0 20px 0"}}>The Scope</h2>
      
      {/* CAPACITY GAUGE */}
      <Card glow={isSafeMode ? C.red : C.glowGreen} style={{textAlign:"center", padding:"30px 20px"}}>
        <div className="mono" style={{fontSize:10, letterSpacing:2, color:C.textDim}}>CURRENT CAPACITY · SPOON ECONOMY</div>
        <div style={{fontFamily:"serif", fontSize:72, lineHeight:1, color: isSafeMode ? C.red : C.glowGreen, margin:"10px 0"}}>
          {spoons}<span style={{fontSize:24, opacity:0.5}}>/12</span>
        </div>
        <div style={{display:"flex", justifyContent:"center", gap:10}}>
          <Button variant="outline" onClick={() => setSpoons(Math.max(0, spoons-1))}>-</Button>
          <Button variant="outline" onClick={() => setSpoons(Math.min(12, spoons+1))}>+</Button>
        </div>
        {isSafeMode && <div className="mono" style={{color:C.red, marginTop:20}}>🔴 SAFE MODE ACTIVE</div>}
      </Card>

      {/* TASK DECOMPOSER (LLM) */}
      <Card glow={C.glowBlue}>
        <div className="mono" style={{fontSize:10, color:C.glowBlue, marginBottom:16}}>EXECUTIVE FUNCTION ASSISTANT</div>
        <div style={{display:"flex", gap:10, marginBottom:16}}>
          <input 
            value={taskInput} 
            onChange={e => setTaskInput(e.target.value)}
            placeholder="Enter a scary task (e.g. 'Do Taxes')"
            style={{
              flex:1, background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.1)",
              color:C.text, padding:"10px 16px", borderRadius:6, fontFamily:"sans-serif"
            }}
          />
          <Button onClick={decomposeTask} disabled={loading} color={C.glowBlue} variant="solid">
            {loading ? "..." : "Decompose ✨"}
          </Button>
        </div>
        
        {loading && <div className="loading-pulse mono" style={{color:C.glowBlue, fontSize:10}}>BREAKING DOWN COMPLEXITY...</div>}

        {breakdown && breakdown.steps && (
          <div style={{display:"grid", gap:8}}>
            {breakdown.steps.map((s, i) => (
              <div key={i} style={{display:"flex", alignItems:"center", gap:12, padding:10, background:"rgba(255,255,255,0.03)", borderRadius:6}}>
                <div style={{width:20, height:20, borderRadius:"50%", border:`1px solid ${C.glowBlue}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:C.glowBlue}}>{i+1}</div>
                <div style={{flex:1, fontSize:14}}>{s.step}</div>
                <div className="mono" style={{fontSize:10, color:C.textDim}}>⚡ {s.spoons}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* MEDS */}
      <Card>
        <div className="mono" style={{fontSize:10, color:C.textDim, marginBottom:16}}>MEDICATION PROTOCOL · 4-HOUR GAP ENFORCEMENT</div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div>
            <div style={{color:C.calcium}}>Calcium Carbonate</div>
            <div style={{fontSize:11, opacity:0.6}}>Blocks absorption of stimulants</div>
          </div>
          <Button variant="outline" color={C.calcium} onClick={takeCa}>Take Dose</Button>
        </div>
        
        <div style={{height:1, background:"rgba(255,255,255,0.1)", margin:"16px 0"}} />

        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", opacity: meds.locked ? 0.5 : 1}}>
          <div>
            <div style={{color:C.calciumAmber}}>Vyvanse (Stimulant)</div>
            <div style={{fontSize:11, color: meds.locked ? C.red : C.textDim}}>
              {meds.locked ? "LOCKED: Wait for absorption" : "Ready to administer"}
            </div>
          </div>
          <Button variant="solid" color={C.calciumAmber} disabled={meds.locked}>Take Dose</Button>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// FEATURE: P31 SPROUT — For the family (kids-first)
// Late addition: warm, playful, age-adaptive. No names; emoji + simple actions.
// ═══════════════════════════════════════════════════════════════
const SproutDemo = ({ isSafeMode, setSpoons }) => {
  const [feeling, setFeeling] = useState(null);
  const [wins, setWins] = useState(["Got dressed", "Ate breakfast"]);
  const [newWin, setNewWin] = useState("");

  const quickFeelings = [
    { id: "ok", emoji: "😊", label: "I'm okay", msg: "Got it. Take your time. 💜" },
    { id: "break", emoji: "🌿", label: "I need a break", msg: "Let's keep things calm. Quiet mode on. 💚", calm: true },
    { id: "happy", emoji: "⭐", label: "Feeling good", msg: "That's great! 🌟" },
    { id: "quiet", emoji: "🤫", label: "Quiet time", msg: "Okay. No pressure. 🤫" },
    { id: "hug", emoji: "🤗", label: "I need a hug", msg: "Sending a virtual hug. You're not alone. 💜" },
    { id: "help", emoji: "🖐️", label: "I need help", msg: "It's okay to need help. Someone can come. 💜" },
  ];

  const onFeeling = (f) => {
    setFeeling(f.id);
    if (f.calm && setSpoons) setSpoons(3);
  };

  const addWin = () => {
    const t = newWin.trim();
    if (t) {
      setWins((w) => [...w, t]);
      setNewWin("");
    }
  };

  const feelingMsg = feeling && quickFeelings.find((f) => f.id === feeling);

  return (
    <div style={{ animation: "fadeIn 0.5s" }}>
      <h2 style={{ fontSize: 32, margin: "0 0 8px 0", color: C.text }}>P31 Sprout</h2>
      <p style={{ color: C.textDim, marginBottom: 24, fontSize: 14 }}>
        For the family. You're safe. The mesh holds. 🔺
      </p>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px",
        borderRadius: 8, background: "rgba(46, 204, 113, 0.08)", border: `1px solid ${C.glowGreen}40`,
        marginBottom: 24, fontSize: 13, color: C.glowGreen,
      }}>
        <span aria-hidden>🛡️</span> You're safe here
      </div>

      {/* How are you right now? — big, tap-friendly */}
      <Card glow={C.lovePurple}>
        <div className="mono" style={{ fontSize: 10, color: C.lovePurple, marginBottom: 16 }}>
          HOW ARE YOU RIGHT NOW?
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {quickFeelings.map((f) => (
            <button
              key={f.id}
              onClick={() => onFeeling(f)}
              style={{
                padding: "16px 20px",
                borderRadius: 12,
                border: `2px solid ${feeling === f.id ? C.lovePurple : "rgba(255,255,255,0.1)"}`,
                background: feeling === f.id ? "rgba(232, 121, 249, 0.15)" : "rgba(0,0,0,0.2)",
                color: C.text,
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                minWidth: 100,
              }}
            >
              <span style={{ fontSize: 28 }}>{f.emoji}</span>
              <span style={{ fontSize: 12 }}>{f.label}</span>
            </button>
          ))}
        </div>
        {feelingMsg && (
          <div style={{ marginTop: 16, padding: 12, background: "rgba(232, 121, 249, 0.08)", borderRadius: 8, fontSize: 13, color: C.text }}>
            {feelingMsg.msg}
          </div>
        )}
      </Card>

      {/* Today's wins — addable (achievement-friendly for older kids) */}
      <Card glow={C.glowGreen}>
        <div className="mono" style={{ fontSize: 10, color: C.glowGreen, marginBottom: 16 }}>
          TODAY'S WINS
        </div>
        <ul style={{ margin: 0, paddingLeft: 20, color: C.text, lineHeight: 1.8 }}>
          {wins.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <input
            value={newWin}
            onChange={(e) => setNewWin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addWin()}
            placeholder="Add a win..."
            style={{
              flex: 1, minWidth: 120, padding: "8px 12px", borderRadius: 6,
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
              color: C.text, fontSize: 13,
            }}
          />
          <Button variant="outline" color={C.glowGreen} onClick={addWin}>Add win 🌱</Button>
        </div>
        <p style={{ fontSize: 11, color: C.textDim, marginTop: 12 }}>
          Every small step counts. 🌱
        </p>
      </Card>

      {isSafeMode && (
        <div style={{ textAlign: "center", padding: 16, color: C.textDim, fontSize: 13 }}>
          Quiet mode is on — we're keeping things calm for everyone.
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP SHELL
// ═══════════════════════════════════════════════════════════════
export default function P31App() {
  const [view, setView] = useState("node");
  const [spoons, setSpoons] = useState(8);
  const isSafeMode = spoons <= 3;

  return (
    <>
      <style>{FONTS_CSS}</style>
      <QuantumField isSafeMode={isSafeMode} />
      
      <div style={{ 
        maxWidth: 1000, margin: "0 auto", padding: "20px", position: "relative", zIndex: 10,
        minHeight: "100vh", display: "flex", flexDirection: "column"
      }}>
        
        {/* HEADER */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 0", marginBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{display:"flex", alignItems:"center", gap:16}}>
            <P31Badge />
            <div>
              <h1 style={{fontSize:24, margin:0, letterSpacing:"0.05em"}}>P31 LABS</h1>
              {!isSafeMode && <div className="mono" style={{fontSize:10, color:C.glowGreen, letterSpacing:2}}>ASSISTIVE TECHNOLOGY · DELTA TOPOLOGY</div>}
            </div>
          </div>
          
          <nav className="mono" style={{display: isSafeMode ? "none" : "flex", gap:24, fontSize:12}}>
            <a href="https://phosphorus31.org" target="_blank" rel="noopener noreferrer" style={{color:C.text, textDecoration:"none"}}>MISSION</a>
            <a href="https://github.com/p31labs" target="_blank" rel="noopener noreferrer" style={{color:C.text, textDecoration:"none"}}>BUILD</a>
            <a href="mailto:will@p31ca.org" style={{color:C.textDim, textDecoration:"none"}}>CONTACT</a>
          </nav>
        </header>

        {/* HERO GRID */}
        <div style={{display:"grid", gridTemplateColumns: "200px 1fr", gap:40, alignItems:"start"}}>
          
          {/* SIDEBAR NAV */}
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            {[
              { id: "node", label: "Node One", icon: Icon.Node },
              { id: "buffer", label: "The Buffer", icon: Icon.Buffer },
              { id: "scope", label: "The Scope", icon: Icon.Scope },
              { id: "sprout", label: "P31 Sprout", icon: Icon.Sprout },
            ].map(item => (
              <button key={item.id} onClick={() => setView(item.id)}
                className="glass-hover"
                style={{
                  background: view === item.id ? "rgba(46, 204, 113, 0.1)" : "transparent",
                  border: `1px solid ${view === item.id ? C.glowGreen : "transparent"}`,
                  color: view === item.id ? C.glowGreen : C.textDim,
                  padding: "12px", borderRadius: 8, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  fontFamily: "monospace", fontSize: 12, textAlign: "left", transition: "all 0.2s"
                }}>
                <item.icon /> {item.label}
              </button>
            ))}

            <div style={{marginTop: 40, padding: 16, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8}}>
              <div className="mono" style={{fontSize:9, color:C.textDim, marginBottom:8}}>SIMULATION CONTROLS</div>
              <div style={{display:"flex", gap:8}}>
                <button onClick={() => setSpoons(2)} style={{flex:1, background:C.red, border:"none", borderRadius:4, height:4, cursor:"pointer", opacity:0.5}} />
                <button onClick={() => setSpoons(10)} style={{flex:1, background:C.glowGreen, border:"none", borderRadius:4, height:4, cursor:"pointer", opacity:0.5}} />
              </div>
              <div style={{textAlign:"center", fontSize:9, marginTop:4, color:C.textDim}}>
                {isSafeMode ? "🔴 SAFE MODE" : "✅ GREEN BOARD"}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div style={{minHeight: 500}}>
             {view === "node" && <NodeOneDemo isSafeMode={isSafeMode} />}
             {view === "buffer" && <BufferDemo />}
             {view === "scope" && <ScopeDemo spoons={spoons} setSpoons={setSpoons} isSafeMode={isSafeMode} />}
             {view === "sprout" && <SproutDemo isSafeMode={isSafeMode} setSpoons={setSpoons} />}
          </div>

        </div>

        {/* FOOTER */}
        <footer style={{marginTop:"auto", paddingTop:40, textAlign:"center", opacity:0.5}}>
          <div className="mono" style={{fontSize:10}}>© 2026 P31 LABS · GEORGIA 501(c)(3) IN FORMATION</div>
          <div style={{fontFamily:"serif", fontStyle:"italic", marginTop:8, fontSize:14}}>The Mesh Holds. 🔺</div>
          <div style={{marginTop:6, fontSize:12, color:C.textDim}}>For families · Kids first 🌱</div>
          <div className="mono" style={{fontSize:9, marginTop:8, color:C.textDim}}>phosphorus31.org · will@p31ca.org</div>
        </footer>

      </div>
    </>
  );
}
