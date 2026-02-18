# MAR10 Molecule Quest (Super Star Quest)

**A collaborative, multi-day birthday adventure inside the P31 world — culminating on March 10 with a 3D-printed molecule they built together.**

*The Mesh Holds. 💜*

---

## Vision

Turn creation, connection, and quantum biology into a playground for the founding nodes. The gift is not just the physical molecule: it’s the *process* — building with family, writing code that becomes real, and holding something made of the same atoms as their bones.

**No extraction. Real creation. Family connection. A lasting memory.**

---

## Timeline

| Window        | Focus |
|---------------|--------|
| **Now – Feb 28** | Add celebratory elements and Super Star Quest (code + content). |
| **March 1–9** | Kids discover the quest gradually (e.g. one step per day). |
| **March 10 (MAR10 Day)** | Final step: slice and print together. Reveal the physical Super Star Molecule. |

---

## The Super Star Molecule

A **special molecule** for the Bonding game / Molecule Builder:

- **Name:** Super Star Molecule  
- **Core:** A golden **P31** at the center (the biological qubit).  
- **Geometry:** Tetrahedron (family’s four vertices) with celebratory styling.  
- **Colors:** P31 palette — gold, cyan, magenta, green; use `BIRTHDAY_QUEST_COLORS` when rendering.  
- **Effect:** “Birthday glow” — quantum coherence that can pulse when both kids are playing (optional).

Implemented as a Posner-like structure with custom element colors. **Original elements** for the quest (no third-party IP): Wonky Cap (WNC), Sparkle Star (SPK), Tunnel Tube (TNL).

---

## Super Star Quest Chain

A **hidden quest** active between the start date and March 10. Four steps:

| Step | Title                   | Description                                                                 | Reward (Star Bits) |
|------|-------------------------|-----------------------------------------------------------------------------|--------------------|
| 1    | The First Atom          | Place the first atom together (golden P31).                                 | 10                 |
| 2    | The Wonky Cap Cluster  | Build a cluster of Wonky Cap elements (3× WNC).                             | 15                 |
| 3    | The Tunnel Tube        | Place a Tunnel Tube in the builder.                                         | 15                 |
| 4    | The Super Star Molecule| At least one each of P31, Wonky Cap, Tunnel Tube, and Sparkle Star.         | 50                 |

**Star Bits** = L.O.V.E. tokens with a special label for this quest.

---

## Family Vibe Coding

Use **Family Vibe Coding** so they can build parts of the molecule with code:

- **Bash (age 10):** Simple text or blocks, e.g. `makeWonkyCap(x, y, z); addStarGlow();`
- **Willow (age 6):** Simplified blocks or one-liners, e.g. `placeAtom('golden', 0, 0, 0)`

The **Centaur** (AI) can guide with playful, age-appropriate prompts.

---

## From Code to Print

1. **Complete the quest** — All four steps done in the Bonding game / Molecule Builder.  
2. **“Slice & Print”** — Slicing engine converts the Super Star Molecule (or their variant) to G-code.  
3. **Preview** — Layers and print preview on screen.  
4. **Print** — Send to the 3D printer; watch the first layers together.  
5. **Completion** — When the print finishes, play the P31 completion fanfare (custom arpeggio; no third-party audio).

---

## The Reveal

When the print is done:

- Place the molecule under a light (optional: tiny LED inside for a soft glow).  
- Short script: *“This is made of the same kinds of atoms as your bones — calcium, phosphorus, oxygen. We gave it a little sparkle. It’s yours, forever.”*

The real gift: they learned that their code and collaboration made something real they can hold.

---

## What’s in the Repo

- **Spec (this doc):** Vision, timeline, quest steps, and reveal.  
- **Game-engine:** Super Star Quest chain (`generateBirthdayQuestChain`, `isBirthdayQuestActive`), four actions `birthday_quest_step_1` … `birthday_quest_step_4`, Star Bits reward label.  
- **Molecule:** `generateSuperStarMolecule()` in `ui/src/utils/moleculeBuilder.ts`; `BIRTHDAY_QUEST_COLORS` in `ui/src/types/molecule.ts` for celebratory rendering.  
- **Bonding / Builder:** Use original element symbols (WNC, SPK, TNL) and P31-only naming; completion fanfare is a custom P31 arpeggio.

---

## P31 Compliance

- **Kids-first:** Language and difficulty are age-adaptive (6 and 10).  
- **Codename-only:** No full names in code or docs.  
- **No third-party IP:** All names, shapes, and sounds are original (Wonky Cap, Sparkle Star, Tunnel Tube; MAR10 as date only; P31 fanfare).

---

*Gardening creation. The Mesh Holds.* 🔺

*Last updated: 2026-02-18*
