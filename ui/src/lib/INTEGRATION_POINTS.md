# Quantum Hello World → Game Client — Integration Points

**Plug 1:** After the crypto formation ceremony succeeds and the molecule is in persistent storage, wire in the game client and mesh data. Four surgical insertions.

---

## 1. New state (add to the Hello World component)

```ts
import type { GameClient, GameBehavior } from '@p31/game-integration';

const [gameClient, setGameClient] = useState<GameClient | null>(null);
const [gameMode, setGameMode] = useState<GameBehavior | null>(null);
const [walletBalance, setWalletBalance] = useState<{ sovereigntyPool: number; performancePool: number; totalEarned: number } | null>(null);
```

---

## 2. After molecule formation (in `beginForm()` or equivalent, right after storage)

```ts
await window.storage.set("p31:molecule", JSON.stringify(mol));

import { genesis } from '../lib/game-client';

const gameClient = await genesis(mol);
setGameClient(gameClient);

setCeremony("The molecule is whole.");
```

---

## 3. When entering the mesh (in `enterMesh()` or phase transition to mesh)

```ts
import { pullMetabolism, pullWallet, pullMeshDirectory } from '../lib/game-client';

const mode = await pullMetabolism();
if (mode) setGameMode(mode);

if (molecule) {
  const wallet = await pullWallet(molecule.fingerprint);
  if (wallet) setWalletBalance(wallet);
}

const shelterDomes = await pullMeshDirectory();
if (shelterDomes.length > 0) {
  setAllDomes(prev => {
    const fps = new Set(prev.map(d => d.fingerprint));
    const merged = [...prev];
    for (const d of shelterDomes) {
      if (!fps.has(d.fingerprint)) {
        merged.push({
          name: d.dome_name,
          color: d.dome_color,
          intent: d.dome_intent,
          fingerprint: d.fingerprint,
          created: d.created_at,
        });
      }
    }
    return merged;
  });
}
```

---

## 4. Returning user (in boot useEffect, after molecule loaded from storage)

```ts
import { genesis, pullMetabolism } from '../lib/game-client';

try {
  const gc = await genesis(mol);
  setGameClient(gc);
  const mode = await pullMetabolism();
  if (mode) setGameMode(mode);
} catch (e) {
  // Offline is fine.
}
```

---

## 5. Mesh UI — LOVE + metabolism gate (in mesh phase render)

- **LOVE balance card:** show `walletBalance.totalEarned`, `walletBalance.sovereigntyPool`, `walletBalance.performancePool`.
- **Rest mode:** when `gameMode?.uiMode === 'rest'`, show: *"The phosphorus is resting."* and `gameMode.message`.
- **Simplified mode:** when `gameMode?.uiMode === 'simplified'`, show: *"YELLOW · BUILD MODE AVAILABLE · CHALLENGES PAUSED"*.

See `P31_PLUG_1_AND_2_WIRING.md` for full JSX snippets (L.O.V.E. card, rest/simplified panels).

---

## Env

In `ui/.env` or `ui/.env.local`:

```env
VITE_SHELTER_URL=
VITE_SHELTER_KEY=
```

When Shelter is live: set URL and key. When empty, all Shelter calls no-op; molecule and LOVE remain local.
