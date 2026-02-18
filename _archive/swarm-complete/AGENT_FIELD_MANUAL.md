# P31 AGENT FIELD MANUAL
## Which AI for Which Job — Strengths, Weaknesses, Deployment

The Centaur has multiple synthetic bodies. Each one is built different. Use the right body for the right task.

---

## THE ROSTER

### 🟣 CLAUDE (Opus 4 / Sonnet 4)
**Role:** Chief of Staff. The primary Centaur body.
**Where:** claude.ai, Cursor (as agent), API

**Strengths:**
- Longest context window in practice (~200K tokens). Can hold an entire repo in memory.
- Best at following complex multi-step instructions with constraints
- Best at writing that sounds human (Substack posts, narratives, legal documents)
- Best at understanding YOUR specific context (memories, preferences, conversation history)
- Best at saying "no" appropriately (won't hallucinate legal advice, won't fabricate citations)
- Structured output (docx, pptx, xlsx generation) is unmatched
- Best at the Geodesic Swarm tasks (personal assistant, nuanced judgment)

**Weaknesses:**
- Can't browse the web in Cursor (no search tool in agent mode)
- Gets verbose. Will explain when you said "just do it."
- Occasionally over-cautious on security/legal topics
- Expensive at Opus tier if using API

**In Cursor:**
- Model: `claude-sonnet-4-20250514` for speed, `claude-opus-4-20250115` for quality
- Best for: Writing swarm rules, generating documents, architecture decisions, code review
- Use Opus for: Legal documents, grant narratives, anything requiring judgment
- Use Sonnet for: Bulk code generation, file manipulation, repetitive tasks

**Cursor Agent Config (for .cursorrules):**
```
When using Claude as agent:
- Do not explain what you're about to do. Do it.
- Read swarm-orchestrator.mdc on every session start.
- If operator says "good morning" → run Iota daily anchor.
- If operator says "run swarm X" → load the swarm rule, execute checklist.
- Prefer file creation over conversation. If the output is a document, make the document.
- When generating legal/SSA documents: clinical tone, no emotional language, facts only.
- When generating Substack posts: personal tone, first person, short sentences, vulnerability.
```

---

### 🟢 GEMINI (2.0 Flash / Pro / Advanced)
**Role:** Scout. Deep web research, real-time data, Google ecosystem integration.
**Where:** gemini.google.com, Google AI Studio, API

**Strengths:**
- Best web research (Deep Research mode synthesizes 50+ sources into structured reports)
- Real-time data access (current grant deadlines, current program contacts, current pricing)
- Native Google ecosystem (can read your Drive, understand Google Sheets, knows GAS quirks)
- Massive context window (1M+ tokens in some modes)
- Multimodal: can analyze images, PDFs, videos natively
- Cheapest at scale for research-heavy tasks
- Flash model is extremely fast for iterative research

**Weaknesses:**
- Writing quality is corporate/flat compared to Claude. Don't use for Substack or narratives.
- Will confidently hallucinate URLs and citations. ALWAYS verify links.
- Less precise at following complex multi-constraint instructions
- Tends to give "balanced" answers when you need a decisive recommendation
- Worse at code generation than DeepSeek or Claude

**Deploy for:**
- All 8 Gemini Missions (grant research, HCB, SSA prep, Tools for Life, MMC, Substack growth, Cloudflare, defensive pub)
- "What are the current deadlines for X?" — anything requiring real-time lookup
- Google Drive document analysis
- Bulk PDF processing (compliance docs, legal filings)

**Cursor Agent Config:**
```
Gemini is not recommended as primary Cursor agent for this repo.
Use externally for research missions. Feed results back to Claude.
```

---

### 🔵 DEEPSEEK (R1 / V3 / Coder)
**Role:** Mathematician. Code surgeon. The one who shows their work.
**Where:** chat.deepseek.com, API (extremely cheap)

**Strengths:**
- Best chain-of-thought reasoning for math and logic (R1 mode)
- Shows ALL intermediate steps — you can verify the math
- Excellent code generation, especially for debugging and architecture analysis
- Absurdly cheap ($0.14/M input tokens for V3, $2.19/M for R1 — 10-50x cheaper than Claude Opus)
- Best at: "here's broken code, find every failure mode" type analysis
- Strong at formal verification and proof-level reasoning
- Coder model is competitive with Claude Sonnet for pure code tasks

**Weaknesses:**
- Writing quality is technically accurate but dry. Never use for Substack or human-facing text.
- Context window is smaller in practice (~128K but effective ~64K)
- Chinese training data occasionally leaks through in edge cases
- R1 thinking can be EXTREMELY long (10,000+ token reasoning chains). Budget for it.
- Less reliable at following complex persona/constraint instructions
- No web access in chat.deepseek.com (research capacity is limited to training data)
- Privacy concerns for some users (Chinese company, data handling)

**Deploy for:**
- All 7 DeepSeek Missions (Vite triage, GAS bridge, SIC-POVM math, Maxwell's Rule, Proof of Care, Posner synthesis, ESP32 security)
- Any task where you need to VERIFY math or logic
- Code architecture review ("find every bug in this 500-line file")
- Fixed-point arithmetic verification (SIC-POVM firmware)
- Formula analysis (Proof of Care, coherence metrics)

**Cursor Agent Config:**
```
DeepSeek can be used as Cursor agent for code-heavy tasks.
Model: deepseek-coder for file manipulation, deepseek-r1 for analysis.
Best for: "fix the build", "find the bug", "optimize this function".
Not for: document generation, narrative writing, personal assistant tasks.
```

---

### 🟡 GPT (4o / o1 / o3)
**Role:** Generalist. Jack of all trades, master of none (but good enough at most things).
**Where:** chatgpt.com, Cursor, API

**Strengths:**
- Most widely available (everyone has access)
- Best plugin/tool ecosystem (code interpreter, DALL-E, browsing)
- o1/o3 reasoning models are strong for complex multi-step problems
- Good at structured data extraction from messy inputs
- Best image generation (DALL-E) if you need visuals for Substack/presentations
- GPT-4o is the best "all-around" model if you only get one
- Largest third-party integration ecosystem

**Weaknesses:**
- Context window is effectively smaller than advertised (performance degrades past ~30K tokens)
- Writing is recognizably "GPT" — the cadence, the "certainly!", the three-point summaries
- Less precise than Claude at following complex constraints
- o1/o3 is expensive and slow for reasoning tasks that DeepSeek R1 handles cheaper
- Tends to add unsolicited caveats and disclaimers
- Code generation is good but not as sharp as DeepSeek Coder for debugging

**Deploy for:**
- Image generation (Substack header images, presentation visuals)
- Quick general questions where you don't need specialist depth
- Code interpreter tasks (data analysis, CSV processing, quick calculations)
- When Claude is at capacity / rate limited
- Fallback for any task where the specialist model isn't available

**Cursor Agent Config:**
```
GPT-4o can serve as Cursor agent for general tasks.
Best for: rapid iteration, code scaffolding, general purpose.
Avoid for: legal documents, precise technical writing, long-context tasks.
Use as fallback when Claude is rate-limited.
```

---

## THE DECISION MATRIX

| Task Type | First Choice | Second Choice | Never |
|-----------|-------------|---------------|-------|
| **Substack post** | Claude Opus | Claude Sonnet | GPT (too recognizable) |
| **Legal document** | Claude Opus | — | GPT, DeepSeek |
| **Grant narrative** | Claude Opus | Claude Sonnet | — |
| **Swarm execution** | Claude Sonnet | GPT-4o | — |
| **Geodesic (personal assistant)** | Claude Opus | Claude Sonnet | DeepSeek |
| **Web research** | Gemini Advanced | GPT (browse) | DeepSeek (no web) |
| **Grant/program lookup** | Gemini | GPT (browse) | Claude (no web in Cursor) |
| **Math verification** | DeepSeek R1 | o1/o3 | Claude (less rigorous) |
| **Code debugging** | DeepSeek Coder | Claude Sonnet | — |
| **Build triage** | DeepSeek Coder | Claude Sonnet | Gemini |
| **Architecture review** | Claude Opus | DeepSeek R1 | GPT |
| **Firmware (ESP32)** | DeepSeek Coder | Claude Sonnet | Gemini |
| **Formula analysis** | DeepSeek R1 | o1 | — |
| **Image generation** | GPT (DALL-E) | — | All others |
| **PDF processing** | Gemini | Claude | — |
| **Quick question** | GPT-4o | Claude Sonnet | DeepSeek R1 (overkill) |
| **Bulk file operations** | Claude Sonnet | GPT-4o | — |
| **Daily anchor (Iota)** | Claude (memory) | — | All others |

---

## CURSOR-SPECIFIC AGENT INSTRUCTIONS

### Model Selection in Cursor

Cursor lets you switch models per-request. Use this:

```
# In .cursor/rules/agent-routing.mdc (optional, for reference)

AGENT ROUTING:
- Default agent: claude-sonnet-4-20250514 (fast, good enough for most tasks)
- Upgrade to opus for: legal docs, grant narratives, Iota personal assistant, judgment calls
- Switch to deepseek-coder for: "fix the build", "find the bug", "optimize this"
- Switch to gpt-4o for: image generation, fallback when rate-limited

NEVER use an agent for:
- Web research (use Gemini externally, paste results back)
- Real-time data lookup (use Gemini externally)
- Financial advice (no model should do this)
```

### Cursor Agent Best Practices for P31 Repo

```
1. ALWAYS read swarm-orchestrator.mdc first (it's alwaysApply, but verify)
2. When given a swarm: read the full .mdc file before touching any code
3. File creation > conversation. If the output is a file, make the file.
4. Run verify_build.sh after any code change in ui/
5. Never modify files in _archive/ unless explicitly migrating them
6. SUPER-CENTAUR/ is read-only for now (wiring is a future swarm)
7. Every commit message should reference the swarm: "feat(alpha): add medication list"
8. If you hit a MATA reference anywhere: delete it. It does not exist.
```

---

## COST COMPARISON (API pricing, approximate)

| Model | Input ($/M tokens) | Output ($/M tokens) | Best Value For |
|-------|--------------------|--------------------|----------------|
| DeepSeek V3 | $0.14 | $0.28 | Bulk code analysis |
| DeepSeek R1 | $0.55 | $2.19 | Math reasoning |
| Gemini 2.0 Flash | $0.10 | $0.40 | Research at scale |
| Claude Sonnet 4 | $3.00 | $15.00 | General agent work |
| GPT-4o | $2.50 | $10.00 | General + images |
| Claude Opus 4 | $15.00 | $75.00 | Highest quality judgment |
| o1 | $15.00 | $60.00 | Complex reasoning |

**For P31 Labs (zero revenue):**
- Use Gemini Flash and DeepSeek V3 for bulk/research (pennies per mission)
- Use Claude Sonnet in Cursor for daily agent work (included in Cursor Pro)
- Reserve Claude Opus / o1 for critical documents (legal, grants, SSA)
- DeepSeek R1 for math verification when you need to show your work

---

## THE SWARM DISPATCH TABLE

| Swarm | Primary Agent | Research Agent | Fallback |
|-------|---------------|----------------|----------|
| IOTA (Geodesic) | Claude Opus | — | Claude Sonnet |
| ALPHA (SSA) | Claude Opus | Gemini (Mission 3) | Claude Sonnet |
| ZETA (Grants) | Claude Sonnet | Gemini (Missions 1, 4, 5) | GPT-4o |
| ETA (Donations) | Claude Sonnet | Gemini (Mission 2) | — |
| BETA (Substack) | Claude Opus | Gemini (Mission 6) | — |
| GAMMA (Legal) | Claude Opus | — | — |
| DELTA (Vite/CI) | DeepSeek Coder | DeepSeek (Missions 1, 2) | Claude Sonnet |
| THETA (Content) | Claude Sonnet | Gemini (Mission 6) | — |
| EPSILON (Board) | Claude Sonnet | Gemini (Mission 4) | — |

The Centaur doesn't have one body. It has five. Route the right task to the right body. The operator's job is to decide WHAT to do. The swarm's job is to decide HOW and with WHOM.
