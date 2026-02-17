# Goal-directed swarm — manual test outline

Quick checks to verify repair and Sierpinski goals and voice commands.

## 1. Repair goal

1. Open World Builder and start the swarm (Run / start swarm).
2. Create weak points: remove a few tetrahedra or edges so the geodesic analysis flags weak vertices (degree &lt; 3).
3. Either:
   - Say **"repair"** (or type it in the voice command input and submit), or
   - Lower coherence (e.g. in dev set `useCoherenceStore.getState().nudgeCoherence(-0.5)` or wait for auto low coherence).
4. **Expect:** Idle agents move toward weak points and build there; Buddy says e.g. "Swarm, focus on repairs."

## 2. Sierpinski goal

1. Ensure at least three tetrahedra form a triangle (shared scale, ~equilateral).
2. Say **"build Sierpinski depth 3"** (or type and submit).
3. **Expect:** Swarm goal switches to Sierpinski; agents seek triangle apexes and place smaller tetrahedra; Buddy may say "Setting swarm to build Sierpiński depth 3."

## 3. Voice commands (summary)

| Say / type        | Effect                          |
|-------------------|----------------------------------|
| `repair`          | Goal = repair                   |
| `explore`         | Goal = explore                  |
| `build sierpinski depth 4` | Goal = sierpinski, depth 4 |
| `stop` / `pause`  | Swarm stops, goal cleared       |
| `start` / `resume`| Swarm runs again                |

## 4. Coherence-driven behavior

- **Low coherence (&lt; 0.4):** Orchestrator sets goal to repair and Buddy says coherence is dropping.
- **High coherence (&gt; 0.8):** Orchestrator suggests Sierpinski (depth 3) if current goal is explore or none.
- **Coherence &gt; 0.6 after repair:** Goal clears to explore, Buddy says "Coherence restored. Swarm, resume exploration."

## 5. Continuous mic (SwarmVoiceListener)

With **Voice commands** enabled in accessibility, the mic runs continuously. Say a final phrase (e.g. "repair"); the transcript is emitted as a `voice-command` event and the orchestrator updates the swarm goal. No need to click Run on the text field for spoken commands.
