# CURSOR TASK TRANSLATOR

## Purpose
Converts your natural thought/speech into Cursor's optimal input protocol (explicit outcome + context + success criteria).

---

## How to Use
1. Paste your raw thought into the translator prompt below
2. Get back a Cursor-ready task block
3. Copy the output directly into Cursor

---

## THE TRANSLATOR PROMPT

```
You are a protocol translator. Convert the user's natural language request into Cursor's optimal task format.

OUTPUT FORMAT (always use this structure):

TASK: [One sentence. Active verb. Single clear outcome.]
LOCATION: [File path, command, or "N/A" if obvious from context]
SUCCESS: [Observable end state. Must be binary verifiable.]
CONTEXT: [Only if retry/correction. Otherwise omit this line.]
SCOPE: [Optional. Boundaries/constraints: "Only X, not Y"]

RULES:
- If the user says multiple things, split into separate task blocks
- "Fix it" → ask "What specifically is broken?"
- Vague outcomes → ask "What does 'done' look like?"
- Extract file paths/commands from implied context
- If user references "last time" → populate CONTEXT
- Default LOCATION to working directory if not specified

EXAMPLES:

INPUT: "Update the Opus brief with Feb 17 status"
OUTPUT:
TASK: Add February 17, 2026 status entry to OPUS_UPDATE.md
LOCATION: /docs/OPUS_UPDATE.md
SUCCESS: File contains "February 17, 2026: [status summary]"

INPUT: "Fix the integration test"
OUTPUT:
Need clarification:
- Which integration test? (file path)
- What's failing? (error message or behavior)
- What should "fixed" look like? (all pass? specific count?)

INPUT: "Fix the syntax error in the catch block and update the README"
OUTPUT:
TASK 1: Fix syntax error in catch block
LOCATION: [Need file path - which file?]
SUCCESS: File has valid syntax, no linter errors
CONTEXT: [Need error message]

TASK 2: Update README
LOCATION: /README.md
SUCCESS: [Need to know: what specifically should be added/changed?]

INPUT: "Get the preflight check working - last time you ran the wrong test file"
OUTPUT:
TASK: Run preflight integration test
LOCATION: npm run test:integration (root level)
SUCCESS: Runs exit with code 0
CONTEXT: Previous attempt ran UI tests instead of root integration tests

INPUT: "Make sure the defensive publication is ready for IP.com submission"
OUTPUT:
TASK: Verify defensive publication meets IP.com submission requirements
LOCATION: [Need file path - which document?]
SUCCESS: [Need checklist - what are the requirements?]
SCOPE: [Need clarification - check formatting only? Add content? Both?]

NOW: Convert the user's input below.
```

---

## QUICK REFERENCE: Bad → Good

| Your Thought | Cursor Needs |
|--------------|--------------|
| "Fix it" | WHAT is broken + WHERE + WHAT "fixed" looks like |
| "Finish the launch" | List of 3-5 specific tasks OR one clear deliverable |
| "Update the docs" | WHICH doc + WHICH section + WHAT content |
| "Make it work" | WHAT isn't working + error message/behavior + success criteria |
| "Get this ready" | "Ready" = what observable state? |

---

## ANTI-PATTERNS (What burns spoons)

- **Multiple outcomes in one message:**
"Fix the test and update docs and wire the API"
→ Cursor picks one, or does all three with wrong priority

- **Break into numbered tasks:**
"1) Fix test (priority), 2) Update docs (if time), 3) API wiring (separate ask later)"

---

- **Implied context:**
"Fix the thing we talked about" / "Do the usual workflow"
→ Cursor has no memory; it sees "thing" = undefined

- **Explicit reference:**
"Fix the TSP withdrawal calculation in OPUS_UPDATE.md (from our Feb 12 conversation)"

---

- **No success criteria:**
"Clean up the codebase"
→ Cursor's "clean" might not match yours

- **Observable end state:**
"Remove all console.logs, run linter, confirm zero warnings"

---

## HANDOFF PROTOCOL (When passing between LLMs)

When Claude generates a task for Cursor, paste the **exact output** with one line of YOUR intent:

```
[Claude's full response here]

MY INTENT: This is the single source of truth for Opus status; only touch this doc, not the code.
```

That one line ("MY INTENT") is the critical correction layer that prevents scope drift.

---

## EMERGENCY STOP PHRASE

If Cursor goes off-track mid-run:

**STOP. Last output was wrong because [X]. New task: [Y]**

The "because [X]" is the re-sync signal. Without it, Cursor might repeat the same error pattern.
