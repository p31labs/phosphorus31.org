# @p31/protocol

Shared P31 protocol types and constants (voltage, signals, L.O.V.E., mesh, metabolism). Single source of truth for design tokens, triage, and vocabulary.

## Exports

- **tokens** — colors, fonts, glow, spacing, radii
- **motion** — durations, easings, reduced-motion
- **constants** — P31, VOLTAGE_THRESHOLDS, VOLTAGE_TIER_MAX
- **voltage** — VoltageTier, ThreatLevel, voltageTier(), threatLevelFromScore()
- **patterns** — THREAT_PATTERNS, PATTERN_WEIGHTS, ThreatPattern
- **triage** — TRIAGE_STATUSES, HOLD_REASONS, TriageStatus, HoldReason, TriageDecision
- **messages** — PatternMatch, VoltageResult, Message, ProcessedMessage
- **signals** — WS_EVENT_TYPES, WsEventType, WsFrame, SproutSignalData, etc.
- **mesh** — NODE_IDS, VERTEX_IDS, NodeId, VertexId
- **love** — LOVE_TRANSACTION_TYPES, LoveTransactionType, LoveTransaction
- **metabolism** — MetabolismColor, BrainStateShape (spoon state: GREEN | YELLOW | RED)

## Dependency graph

```
@p31/protocol     (no runtime dependencies — foundational)
       ↑
       │ imports MetabolismColor, BrainStateShape
       │
@p31/game-integration
       ↑
       │ imports P31Molecule, GameClient, MetabolismState, etc.
       │
   ui / apps/shelter / others
```

**Rule:** Protocol does NOT import from game-integration. Game types (P31Molecule, GameClient, ChallengeDef, WalletTransaction, etc.) live in @p31/game-integration and are not re-exported from protocol to avoid circular dependency.
