/**
 * P31 Icon & Symbol Constants
 * Canonical Unicode and product colors. Use everywhere for consistency.
 * See: Icon audit doc (P31_ICON_INVENTORY.md).
 */

/** Product icons — exact Unicode (white diamond, bullseye, hexagon, etc.) */
export const P31_PRODUCT_ICONS = {
  /** P31 Shelter (Buffer / cognitive protection) — white diamond */
  shelter: '\u25C7',   // ◇
  /** The Scope (dashboard, spectrum) — bullseye */
  scope: '\u25CE',     // ◎
  /** NODE ONE (ESP32-S3 hardware) — hexagon */
  nodeOne: '\u2B21',   // ⬡
  /** The Centaur (Tandem backend) — diamond with dot */
  centaur: '\u25C8',   // ◈
  /** P31 Sprout (family / kids layer) — teardrop flower */
  sprout: '\u274B',     // ❋
  /** Protocol / tetrahedron / mesh — triangle */
  protocol: '\u25B3',   // △
} as const;

/** Product display names for aria-labels */
export const P31_PRODUCT_NAMES = {
  shelter: 'P31 Shelter',
  scope: 'The Scope',
  nodeOne: 'NODE ONE',
  centaur: 'The Centaur',
  sprout: 'P31 Sprout',
  protocol: 'Protocol',
} as const;

/** Product colors — pair with product icon always */
export const P31_PRODUCT_COLORS: Record<keyof typeof P31_PRODUCT_ICONS, string> = {
  shelter: '#ffffff',   // white (diamond)
  scope: '#22d3ee',    // cyan (Scope / dashboard)
  nodeOne: '#2ecc71',  // phosphorus green (hardware)
  centaur: '#a78bfa',  // violet (Tandem)
  sprout: '#34d399',   // emerald (Sprout / family)
  protocol: '#2ecc71', // phosphorus (tetrahedron)
};

/** Signal icons for Sprout — child-friendly, cross-platform Unicode/emoji */
export const P31_SIGNAL_ICONS = {
  /** I'm okay — checkmark, green */
  ok: { char: '\u2713', label: "I'm okay", color: '#22c55e' },
  /** I need a break — pause, amber */
  break: { char: '\u23F8', label: 'I need a break', color: '#f59e0b' },
  /** I need a hug — hugging face (well-supported emoji) */
  hug: { char: '\u{1F917}', label: 'I need a hug', color: '#22d3ee' },
  /** I need help — exclamation, magenta */
  help: { char: '\u2757', label: 'I need help', color: '#e879f9' },
} as const;

/** Extra feeling options for Sprout (optional) — keep emoji for warmth */
export const P31_SIGNAL_ICONS_EXTRA = {
  happy: { char: '\u2605', label: 'Feeling good', color: '#fbbf24' },   // ★
  quiet: { char: '\u{1F92B}', label: 'Quiet time', color: '#94a3b8' },  // 🤫
} as const;

/** Status icons */
export const P31_STATUS = {
  /** Checkmark — sent / released (accent green) */
  check: '\u2713',
  checkColor: '#22c55e',
  /** Connection: green (ok), amber (reconnecting) */
  connectionOk: '#22c55e',
  connectionReconnecting: '#f59e0b',
  /** Voltage levels (for filled circles / gauges) */
  voltageGreen: '#22c55e',
  voltageAmber: '#f59e0b',
  voltageRed: '#ef4444',
} as const;

export type P31ProductId = keyof typeof P31_PRODUCT_ICONS;

/** Minimum size for signal/button icons (px) — kids, touch, a11y */
export const P31_ICON_MIN_SIZE_PX = 24;

/** Connection dot size (px) */
export const P31_CONNECTION_DOT_SIZE_PX = 8;
