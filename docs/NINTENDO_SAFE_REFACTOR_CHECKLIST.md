# Nintendo-Safe Refactor Checklist (MAR10 / Super Star Quest)

Use this checklist to ensure all celebratory content uses **original P31 names, shapes, and sounds** — no third-party IP.

---

## Element renames (Bonding / chemistry)

| Old (risk)   | New (safe)   | Symbol | Notes |
|--------------|--------------|--------|--------|
| Mushroom     | **Wonky Cap**| WNC    | Stylised cap, wavy brim; P31 cyan/magenta or purple with polka dots. |
| Star         | **Sparkle Star** | SPK | 5-point star with distinct proportions or inner glow; gold/cyan. |
| Pipe         | **Tunnel Tube**  | TNL | Cylinder with rings or taper; metallic silver or translucent blue. |

- **chemistry.ts:** Replace `Msh` → `WNC`, `Str` → `SPK`, `Pip` → `TNL`; update `getElementProperties` with new colors/shapes.
- **PeriodicTable.tsx:** New display names and tooltips.
- **MoleculeCanvas / SVG renderer:** Custom rendering for WNC, SPK, TNL (no red mushroom cap, no solid green pipe).
- **birthdayQuestDetection.ts:** Use WNC, SPK, TNL in step logic (Step 2: 3× WNC; Step 3: 1× TNL; Step 4: one each of P, WNC, TNL, SPK).

---

## Copy and branding

- **Banner:** “Mario Day 2026” → **“MAR10 Day 2026”** or **“Level 10 Celebration”**. Text e.g. “Build your Super Star Molecule!”. Keep generic star emoji (⭐).
- **Quest name:** “Birthday Quest” → **“Super Star Quest”** or **“MAR10 Molecule Quest”**.
- **Step titles:** “The Mushroom” → “The Wonky Cap Cluster”; “The Pipe” → “The Tunnel Tube”; “The Star” → “The Super Star Molecule”.
- **Celebration message:** No “Mario”; use “Super Star Molecule”, “MAR10 Day”, or “Level 10 Celebration”.
- **Achievement ID:** Prefer `level10_celebration` over `mario_day` (game-engine already updated).
- **File rename:** `MarioDayBanner.tsx` → `Mar10DayBanner.tsx` or `Level10Banner.tsx`.

---

## Audio

- **Replace:** Two-note “coin” chime (660→990 Hz) with a **P31 completion fanfare**.
- **Suggested:** Three-note arpeggio from P31 frequency (172.35 Hz) and harmonics, e.g. 172.35, 344.7, 516.75 Hz, played in quick succession.
- **Function name:** e.g. `playCompletionFanfare()` or `playP31Fanfare()` (avoid “Mario” or “coin” in name).
- **VibeCodingPanel / print handler:** Call new fanfare on `printjob:completed`; message: “Your Super Star Molecule is ready! Happy MAR10 Day!” (or “Level 10 Celebration!”).

---

## Documentation and code comments

- Remove all references to “Mario”, “Mushroom”, “Pipe”, “Star” (as IP) in comments and user-facing strings.
- Use “Wonky Cap”, “Sparkle Star”, “Tunnel Tube”, “Super Star Molecule”, “MAR10 Day”, “Level 10” consistently.
- **Spec:** `MAR10_MOLECULE_QUEST.md` is canonical. Implementation summary: `MAR10_DAY_2026_IMPLEMENTATION_SUMMARY.md`. Do not distribute docs that mention third-party brands.

---

## Formula and colors

- **Super Star Molecule formula:** Use `Ca₉(PO₄)₆ · ✨` or `Ca₉(PO₄)₆ + Love` (not `· MAR10` if that could be read as brand). Already updated in `moleculeBuilder.ts`.
- **Color map:** Use `BIRTHDAY_QUEST_COLORS` (already renamed from `MARIO_BIRTHDAY_COLORS` in `ui/src/types/molecule.ts`). Palette can stay celebratory (gold, red, green, white) as long as shapes and names are original.

---

## Kid Blocks (Vibe Coding)

- Block labels: “Make Mushroom” → “Make Wonky Cap”; “Make Star” → “Make Sparkle Star”; “Make Pipe” → “Make Tunnel Tube”.
- **blocksToCode():** Emit WNC, SPK, TNL (or the correct function names for those elements).
- **BlockPalette:** Update names and icons (e.g. 🧢 ✨ 🔮 or similar generic icons).

---

## Testing after refactor

1. Banner shows MAR10 / Level 10 text only.
2. Birthday Mode shows WNC, SPK, TNL with new names and shapes.
3. Quest steps complete with new logic (3× WNC, 1× TNL, one each for step 4).
4. Celebration overlay and messages use Super Star / MAR10 / Level 10 language only.
5. Print completion plays P31 fanfare and updated message.
6. Kid Blocks generate code with new symbols; atoms render correctly.

---

*Internal use. Keep branding consistent across codebase; no third-party references in public-facing or open-sourced material.*

*Last updated: 2026-02-18*
