# Comprehensive Test Plan for Goal-Directed Swarm 🔺💜

This test plan verifies that every connection in your goal-directed swarm system is functioning correctly: the swarm store, goal setting, orchestrator subscriptions, voice events, and agent behavior. Perform these steps in order, and use the browser's developer console to inspect state and logs.

---

## Prerequisites

1. **Open the World Builder** in your browser (e.g., `http://localhost:5173` with the extension loaded).
2. **Ensure the swarm is visible** – you should see the `SwarmControl` panel (bottom-right).
3. **Open the browser console** (F12 → Console tab) to see logs.
4. **Enable voice recognition** if you plan to test voice commands (click the microphone button if available, or ensure `VoiceBuilder` is active).

When the World Builder is mounted, `window.useSwarmStore` and `window.useCoherenceStore` are exposed for console debugging. Temporary `[swarm]` and `[orchestrator]` logs appear in dev when goals change or voice commands are received. You can remove those after testing.

---

## 1. Test Swarm Store Initialization

**Action:**

- Reload the page.
- In the console, type:
  ```js
  window.useSwarmStore.getState()
  ```

**Expected:**

- An object with `agents: Map(0)`, `maxAgents: 10`, `running: false`, `goal: null`, etc.
- No errors.

---

## 2. Test Spawning Agents

**Action:**

- Click **Spawn agent** in the `SwarmControl` panel.
- Observe the scene: a small glowing tetrahedron should appear.
- In console:
  ```js
  window.useSwarmStore.getState().agents.size
  ```
  Should be 1.

**Expected:**

- Agent appears and wanders (explore task).
- Console logs (in dev) may show `[swarm] assignNewTask: fallback explore/build`.

---

## 3. Test Goal Setting via UI

Use the **Goal** dropdown in SwarmControl, or set the goal directly in the console.

**Action:**

- In console:
  ```js
  window.useSwarmStore.getState().setGoal({ type: 'repair' })
  ```
- Check goal:
  ```js
  window.useSwarmStore.getState().goal
  ```
  Should return `{ type: 'repair', priority: 10 }` (or `{ type: 'repair' }`).

**Expected:**

- No immediate agent movement change if there are no weak points yet. The goal is stored.

---

## 4. Test Coherence-Driven Goal Changes (Orchestrator)

**Action:**

- In console, set global coherence to a low value to trigger repair mode:
  ```js
  window.useCoherenceStore.getState().updateGlobalCoherence(0.3)
  ```
- Observe if the swarm goal changes (check goal via console) and if Buddy speaks a message.

**Expected:**

- Goal should become `{ type: 'repair', priority: 10 }`.
- Buddy should say something like "Coherence is dropping. Swarm, focus on repairs."
- Console: `[orchestrator] coherence dropped below 0.4 → goal=repair`.
- If there are weak points, agents should head to them (see step 6).

Set coherence back to normal:

```js
window.useCoherenceStore.getState().updateGlobalCoherence(0.7)
```

Goal may revert to explore; Buddy may announce.

---

## 5. Test Voice Commands

**Action:**

- Enable microphone (if needed).
- Say a command clearly: **"repair"**, or simulate in console:
  ```js
  window.dispatchEvent(new CustomEvent('voice-command', { detail: 'repair' }))
  ```
- Check goal: `window.useSwarmStore.getState().goal`

**Expected:**

- Goal changes to repair (and optionally `priority: 10`).
- Buddy may respond.
- Console: `[orchestrator] voice-command received: repair`.

Try other commands:

- `"build sierpinski depth 4"` – goal becomes `{ type: 'sierpinski', depth: 4 }`.
- `"explore"` – goal `{ type: 'explore' }`.
- `"stop"` – `running` becomes `false`, goal cleared.
- `"start"` – `running` true.

---

## 6. Test Repair Goal in Action

**Action:**

- Manually create a weak point by deleting a few tetrahedra (use **Clear** or remove some blocks if you have a deletion tool).
- Ensure the swarm is running and goal is set to `repair`.
- Watch the agents.

**Expected:**

- Idle agents move toward weak vertices.
- When they arrive, they build a tetrahedron.
- Console: `[swarm] assignNewTask: goal=repair, agent=... → weak point ...`.
- Weak point count decreases as geodesic analysis updates.

---

## 7. Test Sierpinski Goal in Action

**Action:**

- Build a base tetrahedron manually (use **Add Tetra** or equivalent).
- Set goal to sierpinski depth 3 (UI dropdown or console):
  ```js
  window.useSwarmStore.getState().setGoal({ type: 'sierpinski', depth: 3 })
  ```
- Ensure the swarm is running.

**Expected:**

- Agents seek triangle apexes and place smaller tetrahedra.
- Over time, a Sierpinski fractal emerges.
- Console: `[swarm] assignNewTask: goal=sierpinski (local site)` or `(apex)`.

---

## 8. Test Orchestrator Subscription to Coherence

**Action:**

- Set goal to something else (e.g. `explore`).
- Set coherence to 0.3:
  ```js
  window.useCoherenceStore.getState().updateGlobalCoherence(0.3)
  ```
  Goal should become repair.
- Set coherence to 0.9: goal should become `sierpinski`.
- Set coherence to 0.6: goal should revert to `explore` (middle band).

**Expected:**

- Goal updates per thresholds (low → repair, high → sierpinski, middle → explore).
- Buddy speaks appropriate messages.
- Console logs show each transition.

---

## 9. Test Agent Task Assignment with Goal

**Action:**

- With goal set to `repair`, check the task of an agent:
  ```js
  Array.from(window.useSwarmStore.getState().agents.values())[0].task
  ```
- If there are weak points, that agent should have `task: 'repair'` and a `targetPosition`.

**Expected:**

- Agents respect the goal; fallback to explore when no weak points.

---

## 10. End-to-End Scenario

**Action:**

1. Start with a fresh world (clear all structures).
2. Spawn 5 agents (Spawn agent repeatedly or use Auto swarm).
3. Say **"build sierpinski depth 3"** (or dispatch the event in console).
4. Wait and watch the fractal grow.
5. Set coherence to 0.3 and see agents switch to repair.
6. Say **"repair"** to manually override.
7. Say **"explore"** to let them wander.
8. Say **"stop"** to pause.

**Expected:**

- All transitions happen smoothly.
- No errors in console.
- The world feels alive and responsive.

---

## Debugging Tips

- **Console logs** (dev only): `[swarm] assignNewTask` and `[orchestrator]` show goal and voice handling.
- **React DevTools** to inspect store state.
- If voice isn’t working, check microphone permission and that the voice input / SwarmVoiceListener path is active.

---

## Cleanup

After testing, you can remove the temporary `import.meta.env?.DEV` console logs from:

- `stores/swarm.store.ts` (assignNewTask)
- `services/SwarmOrchestrator.ts` (coherence subscription and handleVoiceCommand)

The swarm store and orchestrator remain production-ready.

**The mesh holds – and now it follows your commands.** 🔺💜
