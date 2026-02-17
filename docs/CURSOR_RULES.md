# Cursor Rules Documentation

**Complete guide to P31's Cursor AI configuration**

## Overview

P31 uses a modular rules system with stack-specific rules in `.cursor/rules/` directories. This follows Cursor's Generation 2 format (`.mdc` files) for optimal token efficiency and scoping.

## Rule Structure

```
.cursor/
└── rules/
    ├── project-overview.mdc      # Always apply (~150 tokens)
    ├── p31-naming.mdc            # Agent requested
    ├── testing.mdc               # Agent requested
    ├── accessibility.mdc         # Agent requested
    ├── god-protocol.mdc          # Agent requested
    └── code-quality.mdc          # Agent requested

firmware/.cursor/rules/
    └── esp32-firmware.mdc        # Auto-attached (globs)

SUPER-CENTAUR/.cursor/rules/
    └── centaur-backend.mdc       # Auto-attached (globs)

cognitive-shield/.cursor/rules/
    └── buffer-service.mdc        # Auto-attached (globs)

ui/.cursor/rules/
    └── react-frontend.mdc        # Auto-attached (globs)
```

## Activation Modes

### Always Apply
- **project-overview.mdc** — Minimal project identity (~150 tokens)
- Loaded in every conversation
- Keep extremely concise

### Auto Attached (Globs)
- **Stack-specific rules** — Loaded when editing matching files
- `globs: "firmware/**/*.cpp,firmware/**/*.h"` — Only loads for firmware files
- Major token savings: firmware rules never load during frontend work

### Agent Requested
- **Description-based** — AI reads description, decides if relevant
- Used for cross-cutting concerns (testing, accessibility, naming)
- More flexible than globs, less wasteful than always-apply

### Manual
- Type `@rule-name` in chat to load specific rule
- For rarely-used rules or debugging

## Cost Optimization

### Token Efficiency
- **Modular rules** — Only load what's needed
- **Minimal always-apply** — Single small rule at root
- **Glob scoping** — Stack-specific rules only load for that stack
- **Agent requested** — Load on-demand based on context

### Best Practices
1. **Use Auto mode** — Unlimited, free (Cursor selects model)
2. **Write tests first** — Reduces iteration cycles
3. **Start new chats** — When context gets polluted (> 2-3 iterations)
4. **Match models to tasks** — Auto for daily work, premium for architecture
5. **Use `.cursorignore`** — Exclude build artifacts, node_modules, media

## Rule Files

### project-overview.mdc
Minimal project identity, architecture overview, core principles. **Always loaded.**

### p31-naming.mdc
P31 naming conventions and component mapping. Loads when creating/refactoring components.

### testing.mdc
Test-first development, testing patterns, test structure. Loads when writing tests.

### accessibility.mdc
Universal accessibility patterns. Loads when creating UI components.

### god-protocol.mdc
G.O.D. Protocol compliance. Loads when designing architecture or security.

### code-quality.mdc
Code quality standards, best practices, critical partner mindset. Loads for code reviews.

### esp32-firmware.mdc
ESP32-S3 firmware rules. Auto-loads when editing firmware files.

### centaur-backend.mdc
The Centaur backend rules. Auto-loads when editing backend files.

### buffer-service.mdc
The Buffer rules. Auto-loads when editing Buffer files.

### react-frontend.mdc
The Scope frontend rules. Auto-loads when editing frontend files.

## Usage

### For Developers
1. Rules auto-load based on files you're editing
2. Type `@rule-name` to manually load a rule
3. Check `.cursor/rules/` for available rules
4. Rules are version-controlled — commit changes

### For AI
- AI automatically loads relevant rules based on context
- Rules provide project-specific knowledge and patterns
- AI applies rules when generating code
- Rules help maintain consistency across codebase

## Maintenance

### Adding New Rules
1. Create `.mdc` file in appropriate `.cursor/rules/` directory
2. Add YAML frontmatter with activation mode
3. Write rules in Markdown
4. Test that rule loads correctly
5. Commit to version control

### Updating Rules
1. Edit `.mdc` file
2. Test with AI to ensure it works
3. Commit changes
4. Document significant changes in this file

### Removing Rules
1. Delete `.mdc` file
2. Remove references from this documentation
3. Commit deletion

## Anti-Patterns

- ❌ **One massive rule file** — Split into scoped files
- ❌ **Too many always-apply rules** — Only one at root
- ❌ **Contradictory rules** — Keep rules consistent
- ❌ **Stale rules** — Update when codebase changes
- ❌ **Explaining obvious things** — Don't explain what AI already knows

## References

- [Cursor Rules Guide](https://cursor.sh/docs/rules) — Official documentation
- [Awesome Cursor Rules](https://github.com/PatrickJS/awesome-cursorrules) — Community examples
- [Cursor Directory](https://cursor.directory) — Rule collection

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜
